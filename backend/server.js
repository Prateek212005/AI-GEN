require("dotenv").config({ override: true });
const express = require("express");
const cors = require("cors");
const https = require("https");
const http = require("http");
const { testConnection } = require("./config/db");


const app = express();

testConnection();

app.use(cors());
app.use(express.json());

// Serve static files for gallery
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/generate", require("./routes/generateRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

// Health check endpoint (used by keep-alive ping)
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: Date.now() });
});

app.get("/", (req, res) => {
  res.send("AI-GEN Backend Running 🚀");
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);

  // Keep-alive: ping self every 14 minutes to prevent Render free tier from sleeping
  const RENDER_URL = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;
  const PING_INTERVAL = 14 * 60 * 1000; // 14 minutes

  setInterval(() => {
    const lib = RENDER_URL.startsWith("https") ? https : http;
    lib.get(`${RENDER_URL}/health`, (res) => {
      console.log(`🏓 Keep-alive ping: ${res.statusCode}`);
    }).on("error", (err) => {
      console.error("🏓 Keep-alive ping failed:", err.message);
    });
  }, PING_INTERVAL);
});

server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.error(`❌ PORT ${PORT} IS ALREADY IN USE!`);
    console.error('Please close all other backend terminals running "npm start" and try again.');
    process.exit(1);
  }
});
