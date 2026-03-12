const mongoose = require("mongoose");
require("dotenv").config();
const User = require("./models/User");

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    const users = await User.find({});
    console.log("Users:", users.map(u => ({ email: u.email, role: u.role })));
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
