require("dotenv").config({ override: true });
const express = require("express");
const cors = require("cors");
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

app.get("/", (req, res) => {
  res.send("AI-GEN Backend Running 🚀");
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});

server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.error(`❌ PORT ${PORT} IS ALREADY IN USE!`);
    console.error('Please close all other backend terminals running "npm start" and try again.');
    process.exit(1);
  }
});
