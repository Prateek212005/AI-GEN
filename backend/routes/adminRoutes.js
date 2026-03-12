const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const { getDashboardStats } = require("../controllers/adminController");

// All admin routes require authentication + admin role
router.use(authMiddleware);
router.use(adminMiddleware);

router.get("/dashboard", getDashboardStats);

module.exports = router;
