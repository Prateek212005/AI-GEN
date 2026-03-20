require("dotenv").config({ path: __dirname + '/.env' });
const { supabase } = require("./config/db");

(async () => {
  try {
    const emailToPromote = "prateekkhese495@gmail.com";

    const { data: user, error: findError } = await supabase
      .from("users")
      .select("*")
      .eq("email", emailToPromote)
      .single();

    if (findError || !user) {
      console.log(`User with email ${emailToPromote} not found. Ensure the user has signed up before running this script.`);
      process.exit(0);
    }

    const { error: updateError } = await supabase
      .from("users")
      .update({ role: "admin", updated_at: new Date().toISOString() })
      .eq("id", user.id);

    if (updateError) throw updateError;

    console.log(`Successfully set user ${user.email} as admin.`);
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
})();
