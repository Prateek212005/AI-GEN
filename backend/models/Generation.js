const mongoose = require("mongoose");

const generationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        type: {
            type: String,
            enum: ["image", "video"],
            required: true,
        },
        prompt: {
            type: String,
            required: true,
        },
        filePath: {
            type: String,
        },
        fileUrl: {
            type: String,
        },
        status: {
            type: String,
            enum: ["pending", "completed", "failed"],
            default: "pending",
        },
        creditsUsed: {
            type: Number,
            default: 0,
        },
        savedToGallery: {
            type: Boolean,
            default: true,
        },
        errorMessage: {
            type: String,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Generation", generationSchema);
