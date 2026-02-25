const mongoose = require("mongoose");
require("dotenv").config();


// console.log("url in env : ",process.env.MONGO_URL)
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      family: 4
    });
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;