const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const Generation = require("../models/Generation");
const User = require("../models/User");

const LEONARDO_API_KEY = process.env.LEONARDO_API_KEY;
const LEONARDO_BASE_URL = "https://cloud.leonardo.ai/api/rest/v1";

// Credit costs
const IMAGE_CREDITS = 5;
const VIDEO_CREDITS = 10;

// Ensure gallery directories exist
const ensureDirectories = () => {
    const imageDir = path.join(__dirname, "../uploads/gallery/images");
    const videoDir = path.join(__dirname, "../uploads/gallery/videos");

    if (!fs.existsSync(imageDir)) {
        fs.mkdirSync(imageDir, { recursive: true });
    }
    if (!fs.existsSync(videoDir)) {
        fs.mkdirSync(videoDir, { recursive: true });
    }
};

ensureDirectories();

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
        const { prompt } = req.body;
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

        // Create pending generation record
        const generation = await Generation.create({
            userId,
            type: "image",
            prompt,
            status: "pending",
            creditsUsed: IMAGE_CREDITS,
        });

        try {
            console.log(`Generating image for prompt: "${prompt}"`);

            // Step 1: Start image generation
            const createResponse = await axios.post(
                `${LEONARDO_BASE_URL}/generations`,
                {
                    prompt: prompt,
                    modelId: "6b645e3a-d64f-4341-a6d8-7a3690fbf042", // Leonardo Creative model
                    width: 1024,
                    height: 1024,
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

            const generationId = createResponse.data.sdGenerationJob?.generationId;

            if (!generationId) {
                throw new Error("Failed to start generation");
            }

            console.log(`Generation started with ID: ${generationId}`);

            // Step 2: Poll for completion
            const completedGeneration = await waitForGeneration(generationId);

            // Step 3: Get the generated image
            if (!completedGeneration.generated_images || completedGeneration.generated_images.length === 0) {
                throw new Error("No images were generated");
            }

            const imageUrl = completedGeneration.generated_images[0].url;

            // Step 4: Download and save the image
            const imageResponse = await axios.get(imageUrl, { responseType: "arraybuffer" });

            const filename = `${uuidv4()}.png`;
            const filePath = path.join(__dirname, "../uploads/gallery/images", filename);
            fs.writeFileSync(filePath, imageResponse.data);

            // Update generation record
            generation.filePath = `uploads/gallery/images/${filename}`;
            generation.fileUrl = `/uploads/gallery/images/${filename}`;
            generation.status = "completed";
            generation.savedToGallery = true;
            await generation.save();

            // Deduct credits
            user.credits -= IMAGE_CREDITS;
            await user.save();

            console.log(`Image generated successfully: ${filename}`);

            res.json({
                message: "Image generated successfully",
                generation: {
                    id: generation._id,
                    type: generation.type,
                    prompt: generation.prompt,
                    fileUrl: `http://localhost:5000${generation.fileUrl}`,
                    status: generation.status,
                    creditsUsed: generation.creditsUsed,
                    createdAt: generation.createdAt,
                },
                remainingCredits: user.credits,
            });
        } catch (apiError) {
            console.error("Leonardo API error:", apiError.response?.data || apiError.message);
            // Update generation as failed
            generation.status = "failed";
            generation.errorMessage = apiError.response?.data?.error || apiError.message;
            await generation.save();

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
                    timeout: 300000, // 5 minute timeout for video generation
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

            // Download and save the video
            const videoResponse = await axios.get(videoUrl, {
                responseType: "arraybuffer",
                timeout: 120000,
            });

            const filename = `${uuidv4()}.mp4`;
            const filePath = path.join(__dirname, "../uploads/gallery/videos", filename);
            fs.writeFileSync(filePath, videoResponse.data);

            // Update generation record
            generation.filePath = `uploads/gallery/videos/${filename}`;
            generation.fileUrl = `/uploads/gallery/videos/${filename}`;
            generation.status = "completed";
            generation.savedToGallery = true;
            await generation.save();

            // Deduct credits
            user.credits -= VIDEO_CREDITS;
            await user.save();

            console.log(`Video saved successfully: ${filename}`);

            res.json({
                message: "Video generated successfully",
                id: generation._id,
                prompt: generation.prompt,
                result_url: `http://localhost:5000${generation.fileUrl}`,
                remainingCredits: user.credits,
            });
        } catch (apiError) {
            console.error("Bytez API error:", apiError.response?.data || apiError.message);
            // Update generation as failed
            generation.status = "failed";
            generation.errorMessage = apiError.response?.data?.error || apiError.message;
            await generation.save();

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

        const query = { userId };
        if (type) query.type = type;
        if (status) query.status = status;

        const generations = await Generation.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Generation.countDocuments(query);

        res.json({
            generations,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / limit),
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

        const query = {
            userId,
            status: "completed",
            savedToGallery: true,
        };
        if (type) query.type = type;

        const items = await Generation.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .select("_id type prompt fileUrl createdAt");

        const total = await Generation.countDocuments(query);

        // Map to frontend expected format
        const formattedItems = items.map(item => ({
            id: item._id,
            type: item.type,
            prompt: item.prompt,
            result_url: `http://localhost:5000${item.fileUrl}`,
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

        const generation = await Generation.findOne({ _id: id, userId });

        if (!generation) {
            return res.status(404).json({ message: "Item not found" });
        }

        // Delete the file if it exists
        if (generation.filePath) {
            const fullPath = path.join(__dirname, "..", generation.filePath);
            if (fs.existsSync(fullPath)) {
                fs.unlinkSync(fullPath);
            }
        }

        // Delete the database record
        await Generation.deleteOne({ _id: id });

        res.json({ message: "Item deleted successfully" });
    } catch (error) {
        console.error("Delete from gallery error:", error.message);
        res.status(500).json({ message: "Failed to delete item" });
    }
};
