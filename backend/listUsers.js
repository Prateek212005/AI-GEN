require("dotenv").config();
const { supabase } = require("./config/db");

(async () => {
  try {
    const { data: users, error } = await supabase
      .from("users")
      .select("email, role");

    if (error) throw error;

    console.log("Users:", users);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
