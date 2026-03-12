const mongoose = require("mongoose");
require("dotenv").config({ path: __dirname + '/.env' });
const User = require("./models/User");

mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/aigen", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    const emailToPromote = "prateekkhese495@gmail.com";
    const user = await User.findOne({ email: emailToPromote });
    
    if (user) {
      user.role = "admin";
      await user.save();
      console.log(`Successfully set user ${user.email} as admin.`);
    } else {
      console.log(`User with email ${emailToPromote} not found. Ensure the user has signed up before running this script.`);
    }
    process.exit(0);
  })
  .catch(err => {
    console.error("Error:", err);
    process.exit(1);
  });
