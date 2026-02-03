require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");


const app = express();

console.log("url in env : ", process.env.MONGO_URL)
connectDB();

app.use(cors());
app.use(express.json());

// Serve static files for gallery
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/generate", require("./routes/generateRoutes"));

app.get("/", (req, res) => {
  res.send("AI-GEN Backend Running 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});
