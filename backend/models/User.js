const { supabase } = require("../config/db");

const User = {
  async findById(id) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();
    if (error && error.code !== "PGRST116") throw error;
    return data;
  },

  async findByIdSelect(id, fields) {
    const { data, error } = await supabase
      .from("users")
      .select(fields)
      .eq("id", id)
      .single();
    if (error && error.code !== "PGRST116") throw error;
    return data;
  },

  async findOne(filter) {
    let query = supabase.from("users").select("*");
    for (const [key, value] of Object.entries(filter)) {
      query = query.eq(key, value);
    }
    const { data, error } = await query.single();
    if (error && error.code !== "PGRST116") return null;
    return data;
  },

  async create(userData) {
    const { data, error } = await supabase
      .from("users")
      .insert(userData)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateById(id, updates) {
    updates.updated_at = new Date().toISOString();
    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async countAll() {
    const { count, error } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true });
    if (error) throw error;
    return count;
  },

  async countWhere(filter) {
    let query = supabase
      .from("users")
      .select("*", { count: "exact", head: true });
    for (const [key, value] of Object.entries(filter)) {
      if (typeof value === "object" && value !== null) {
        // Handle operators like $ne, $gte, $lt
        for (const [op, val] of Object.entries(value)) {
          if (op === "$ne") query = query.neq(key, val);
          if (op === "$gte") query = query.gte(key, val);
          if (op === "$lt") query = query.lt(key, val);
        }
      } else {
        query = query.eq(key, value);
      }
    }
    const { count, error } = await query;
    if (error) throw error;
    return count;
  },

  async findRecent(limit = 10, selectFields = "*") {
    const { data, error } = await supabase
      .from("users")
      .select(selectFields)
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data;
  },

  async findAll() {
    const { data, error } = await supabase.from("users").select("*");
    if (error) throw error;
    return data;
  },
};

module.exports = User;
