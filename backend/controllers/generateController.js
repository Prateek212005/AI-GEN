const axios = require("axios");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const Generation = require("../models/Generation");
const User = require("../models/User");
const { supabase } = require("../config/db");

const LEONARDO_API_KEY = process.env.LEONARDO_API_KEY;
const LEONARDO_BASE_URL = "https://cloud.leonardo.ai/api/rest/v1";
const SUPABASE_URL = process.env.SUPABASE_URL;

// Credit costs
const IMAGE_CREDITS = 5;
const VIDEO_CREDITS = 10;

// Helper: upload buffer to Supabase Storage and return public URL
const uploadToSupabase = async (buffer, filename, contentType) => {
    const { data, error } = await supabase.storage
        .from("generations")
        .upload(filename, buffer, {
            contentType,
            upsert: true,
        });

    if (error) throw new Error(`Supabase upload failed: ${error.message}`);

    // Get public URL
    const { data: urlData } = supabase.storage
        .from("generations")
        .getPublicUrl(filename);

    return urlData.publicUrl;
};

// Helper: delete file from Supabase Storage
const deleteFromSupabase = async (filePath) => {
    if (!filePath) return;
    const { error } = await supabase.storage
        .from("generations")
        .remove([filePath]);
    if (error) console.error("Supabase delete error:", error.message);
};

// Helper function to wait for generation to complete
const waitForGeneration = async (generationId) => {
    const maxAttempts = 60; // Max 5 minutes (60 * 5 seconds)

    for (let i = 0; i < maxAttempts; i++) {
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds

        const response = await axios.get(
            `${LEONARDO_BASE_URL}/generations/${generationId}`,
            {
                headers: {
                    Authorization: `Bearer ${LEONARDO_API_KEY}`,
                    Accept: "application/json",
                },
            }
        );

        const generation = response.data.generations_by_pk;

        if (generation && generation.status === "COMPLETE") {
            return generation;
        } else if (generation && generation.status === "FAILED") {
            throw new Error("Generation failed");
        }

        console.log(`Generation status: ${generation?.status || 'unknown'}, waiting...`);
    }

    throw new Error("Generation timeout");
};

// Generate Image using Leonardo.ai
exports.generateImage = async (req, res) => {
    try {
        const { prompt, style, aspect_ratio } = req.body;
        const userId = req.userId;

        if (!prompt) {
            return res.status(400).json({ message: "Prompt is required" });
        }

        // Check API key
        if (!LEONARDO_API_KEY) {
            console.error("LEONARDO_API_KEY not set");
            return res.status(500).json({ message: "API key not configured" });
        }

        // Check user credits
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.credits < IMAGE_CREDITS) {
            return res.status(400).json({
                message: "Insufficient credits",
                required: IMAGE_CREDITS,
                available: user.credits,
            });
        }

        // Style prefixes for the prompt
        const stylePrompts = {
            realistic: "photorealistic, highly detailed, professional photography, 8k resolution,",
            anime: "anime style, vibrant colors, japanese animation, detailed anime artwork,",
            cyberpunk: "cyberpunk style, neon lights, futuristic, sci-fi, dystopian city,",
        };

        // Aspect ratio to dimensions mapping
        const aspectRatioDimensions = {
            "1:1": { width: 1024, height: 1024 },
            "16:9": { width: 1360, height: 768 },
            "9:16": { width: 768, height: 1360 },
        };

        // Get style prefix and dimensions
        const stylePrefix = stylePrompts[style] || stylePrompts.realistic;
        const dimensions = aspectRatioDimensions[aspect_ratio] || aspectRatioDimensions["1:1"];

        // Combine style with user prompt
        const enhancedPrompt = `${stylePrefix} ${prompt}`;

        // Create pending generation record
        const generation = await Generation.create({
            userId,
            type: "image",
            prompt,
            status: "pending",
            creditsUsed: IMAGE_CREDITS,
        });

        try {
            console.log(`Generating image with style "${style}", aspect ratio "${aspect_ratio}"`);
            console.log(`Enhanced prompt: "${enhancedPrompt}"`);

            // Step 1: Start image generation
            const createResponse = await axios.post(
                `${LEONARDO_BASE_URL}/generations`,
                {
                    prompt: enhancedPrompt,
                    modelId: "6b645e3a-d64f-4341-a6d8-7a3690fbf042",
                    width: dimensions.width,
                    height: dimensions.height,
                    num_images: 1,
                },
                {
                    headers: {
                        Authorization: `Bearer ${LEONARDO_API_KEY}`,
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                }
            );

            const leonardoGenId = createResponse.data.sdGenerationJob?.generationId;

            if (!leonardoGenId) {
                throw new Error("Failed to start generation");
            }

            console.log(`Generation started with ID: ${leonardoGenId}`);

            // Step 2: Poll for completion
            const completedGeneration = await waitForGeneration(leonardoGenId);

            // Step 3: Get the generated image
            if (!completedGeneration.generated_images || completedGeneration.generated_images.length === 0) {
                throw new Error("No images were generated");
            }

            const imageUrl = completedGeneration.generated_images[0].url;

            // Step 4: Download the image
            const imageResponse = await axios.get(imageUrl, { responseType: "arraybuffer" });

            // Step 5: Upload to Supabase Storage
            const filename = `images/${uuidv4()}.png`;
            const publicUrl = await uploadToSupabase(
                Buffer.from(imageResponse.data),
                filename,
                "image/png"
            );

            // Update generation record
            const updatedGen = await Generation.updateById(generation.id, {
                filePath: filename,
                fileUrl: publicUrl,
                status: "completed",
                savedToGallery: true,
            });

            // Deduct credits
            await User.updateById(userId, { credits: user.credits - IMAGE_CREDITS });

            console.log(`Image generated and uploaded: ${filename}`);

            res.json({
                message: "Image generated successfully",
                generation: {
                    id: updatedGen.id,
                    type: updatedGen.type,
                    prompt: updatedGen.prompt,
                    fileUrl: publicUrl,
                    status: updatedGen.status,
                    creditsUsed: updatedGen.creditsUsed,
                    createdAt: updatedGen.createdAt,
                },
                remainingCredits: user.credits - IMAGE_CREDITS,
            });
        } catch (apiError) {
            console.error("Leonardo API error:", apiError.response?.data || apiError.message);
            await Generation.updateById(generation.id, {
                status: "failed",
                errorMessage: apiError.response?.data?.error || apiError.message,
            });
            throw apiError;
        }
    } catch (error) {
        console.error("Image generation error:", error.response?.data || error.message);
        res.status(500).json({
            message: "Image generation failed",
            error: error.response?.data?.error || error.message,
        });
    }
};

// Generate Video using Bytez API
exports.generateVideo = async (req, res) => {
    try {
        const { prompt } = req.body;
        const userId = req.userId;

        if (!prompt) {
            return res.status(400).json({ message: "Prompt is required" });
        }

        // Check API key
        const BYTEZ_API_KEY = process.env.BYTEZ_API_KEY;
        if (!BYTEZ_API_KEY) {
            console.error("BYTEZ_API_KEY not set");
            return res.status(500).json({ message: "Video API key not configured" });
        }

        // Check user credits
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.credits < VIDEO_CREDITS) {
            return res.status(400).json({
                message: "Insufficient credits",
                required: VIDEO_CREDITS,
                available: user.credits,
            });
        }

        // Create pending generation record
        const generation = await Generation.create({
            userId,
            type: "video",
            prompt,
            status: "pending",
            creditsUsed: VIDEO_CREDITS,
        });

        try {
            console.log(`Generating video for prompt: "${prompt}"`);

            // Call Bytez API for video generation
            const response = await axios.post(
                "https://api.bytez.com/models/v2/ali-vilab/text-to-video-ms-1.7b",
                { text: prompt },
                {
                    headers: {
                        Authorization: BYTEZ_API_KEY,
                        "Content-Type": "application/json",
                    },
                    timeout: 300000,
                }
            );

            if (response.data.error) {
                throw new Error(response.data.error);
            }

            const videoUrl = response.data.output;

            if (!videoUrl) {
                throw new Error("No video URL returned from API");
            }

            console.log(`Video generated: ${videoUrl}`);

            // Download the video
            const videoResponse = await axios.get(videoUrl, {
                responseType: "arraybuffer",
                timeout: 120000,
            });

            // Upload to Supabase Storage
            const filename = `videos/${uuidv4()}.mp4`;
            const publicUrl = await uploadToSupabase(
                Buffer.from(videoResponse.data),
                filename,
                "video/mp4"
            );

            // Update generation record
            await Generation.updateById(generation.id, {
                filePath: filename,
                fileUrl: publicUrl,
                status: "completed",
                savedToGallery: true,
            });

            // Deduct credits
            await User.updateById(userId, { credits: user.credits - VIDEO_CREDITS });

            console.log(`Video saved to Supabase Storage: ${filename}`);

            res.json({
                message: "Video generated successfully",
                id: generation.id,
                prompt: generation.prompt,
                result_url: publicUrl,
                remainingCredits: user.credits - VIDEO_CREDITS,
            });
        } catch (apiError) {
            console.error("Bytez API error:", apiError.response?.data || apiError.message);
            await Generation.updateById(generation.id, {
                status: "failed",
                errorMessage: apiError.response?.data?.error || apiError.message,
            });
            throw apiError;
        }
    } catch (error) {
        console.error("Video generation error:", error.response?.data || error.message);
        res.status(500).json({
            message: "Video generation failed",
            error: error.response?.data?.error || error.message,
        });
    }
};

// Get Generation History
exports.getHistory = async (req, res) => {
    try {
        const userId = req.userId;
        const { type, status, limit = 20, page = 1 } = req.query;

        const filter = { userId };
        if (type) filter.type = type;
        if (status) filter.status = status;

        const parsedLimit = parseInt(limit);
        const parsedPage = parseInt(page);
        const offset = (parsedPage - 1) * parsedLimit;

        const generations = await Generation.findMany({
            filter,
            limit: parsedLimit,
            offset,
        });

        const total = await Generation.countWhere(filter);

        res.json({
            generations,
            pagination: {
                total,
                page: parsedPage,
                limit: parsedLimit,
                pages: Math.ceil(total / parsedLimit),
            },
        });
    } catch (error) {
        console.error("Get history error:", error.message);
        res.status(500).json({ message: "Failed to fetch history" });
    }
};

// Get Gallery (completed generations only)
exports.getGallery = async (req, res) => {
    try {
        const userId = req.userId;
        const { type, limit = 20, page = 1 } = req.query;

        const filter = {
            userId,
            status: "completed",
            savedToGallery: true,
        };
        if (type) filter.type = type;

        const parsedLimit = parseInt(limit);
        const parsedPage = parseInt(page);
        const offset = (parsedPage - 1) * parsedLimit;

        const items = await Generation.findMany({
            filter,
            limit: parsedLimit,
            offset,
            select: "id, type, prompt, file_url, created_at",
        });

        // fileUrl is now a full public URL from Supabase Storage
        const formattedItems = items.map(item => ({
            id: item.id,
            type: item.type,
            prompt: item.prompt,
            result_url: item.fileUrl,
            created_at: item.createdAt,
        }));

        res.json(formattedItems);
    } catch (error) {
        console.error("Get gallery error:", error.message);
        res.status(500).json({ message: "Failed to fetch gallery" });
    }
};

// Delete from Gallery
exports.deleteFromGallery = async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.params;

        const generation = await Generation.findOne({ id, user_id: userId });

        if (!generation) {
            return res.status(404).json({ message: "Item not found" });
        }

        // Delete the file from Supabase Storage
        if (generation.filePath) {
            await deleteFromSupabase(generation.filePath);
        }

        // Delete the database record
        await Generation.deleteById(id);

        res.json({ message: "Item deleted successfully" });
    } catch (error) {
        console.error("Delete from gallery error:", error.message);
        res.status(500).json({ message: "Failed to delete item" });
    }
};
