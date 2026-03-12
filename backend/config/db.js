const mongoose = require("mongoose");
require("dotenv").config({ override: true });

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, { family: 4 });

    console.log("✅ MongoDB Connected");
    console.log("Connected Database:", mongoose.connection.name);
    console.log("Mongo URL:", process.env.MONGO_URL);

  } catch (error) {
    console.error("❌ MongoDB Error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;