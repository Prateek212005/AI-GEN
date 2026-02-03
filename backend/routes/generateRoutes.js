const express = require("express");
const router = express.Router();
const multer = require("multer");
const authMiddleware = require("../middleware/authMiddleware");
const {
    generateImage,
    generateVideo,
    getHistory,
    getGallery,
    deleteFromGallery,
} = require("../controllers/generateController");

// Configure multer for reference image uploads
const upload = multer({ storage: multer.memoryStorage() });

// All routes are protected
router.use(authMiddleware);

// Generate endpoints
router.post("/image", generateImage);
router.post("/video", upload.single("reference_image"), generateVideo);

// History endpoint
router.get("/history", getHistory);

// Gallery endpoints
router.get("/gallery", getGallery);
router.delete("/gallery/:id", deleteFromGallery);

module.exports = router;
