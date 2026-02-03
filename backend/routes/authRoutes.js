const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const { signup, login } = require("../controllers/authController");

// PUBLIC ROUTES
router.post("/signup", signup);
router.post("/login", login);

// PROTECTED ROUTE (GET CURRENT USER)
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user" });
  }
});

module.exports = router;
