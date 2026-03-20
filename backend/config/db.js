const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ override: true });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ SUPABASE_URL or SUPABASE_SERVICE_KEY missing from .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const testConnection = async () => {
  try {
    const { data, error } = await supabase.from("users").select("id").limit(1);
    if (error) throw error;
    console.log("✅ Supabase Connected");
  } catch (error) {
    console.error("❌ Supabase Error:", error.message);
    process.exit(1);
  }
};

module.exports = { supabase, testConnection };