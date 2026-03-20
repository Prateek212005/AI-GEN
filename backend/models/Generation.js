const { supabase } = require("../config/db");

const Generation = {
  async create(genData) {
    // Map camelCase to snake_case
    const insert = {
      user_id: genData.userId,
      type: genData.type,
      prompt: genData.prompt,
      status: genData.status || "pending",
      credits_used: genData.creditsUsed || 0,
      file_path: genData.filePath || null,
      file_url: genData.fileUrl || null,
      saved_to_gallery: genData.savedToGallery !== undefined ? genData.savedToGallery : true,
      error_message: genData.errorMessage || null,
    };

    const { data, error } = await supabase
      .from("generations")
      .insert(insert)
      .select()
      .single();
    if (error) throw error;

    // Return with camelCase aliases for backward compat
    return Generation._toCamel(data);
  },

  async findById(id) {
    const { data, error } = await supabase
      .from("generations")
      .select("*")
      .eq("id", id)
      .single();
    if (error && error.code !== "PGRST116") throw error;
    if (!data) return null;
    return Generation._toCamel(data);
  },

  async updateById(id, updates) {
    const snakeUpdates = {};
    if (updates.filePath !== undefined) snakeUpdates.file_path = updates.filePath;
    if (updates.fileUrl !== undefined) snakeUpdates.file_url = updates.fileUrl;
    if (updates.status !== undefined) snakeUpdates.status = updates.status;
    if (updates.savedToGallery !== undefined) snakeUpdates.saved_to_gallery = updates.savedToGallery;
    if (updates.errorMessage !== undefined) snakeUpdates.error_message = updates.errorMessage;
    if (updates.creditsUsed !== undefined) snakeUpdates.credits_used = updates.creditsUsed;
    snakeUpdates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("generations")
      .update(snakeUpdates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return Generation._toCamel(data);
  },

  async countAll() {
    const { count, error } = await supabase
      .from("generations")
      .select("*", { count: "exact", head: true });
    if (error) throw error;
    return count;
  },

  async countWhere(filter) {
    let query = supabase
      .from("generations")
      .select("*", { count: "exact", head: true });
    query = Generation._applyFilter(query, filter);
    const { count, error } = await query;
    if (error) throw error;
    return count;
  },

  async findMany({ filter = {}, orderBy = "created_at", ascending = false, limit = 20, offset = 0, select = "*" }) {
    let query = supabase.from("generations").select(select);
    query = Generation._applyFilter(query, filter);
    query = query.order(orderBy, { ascending }).range(offset, offset + limit - 1);

    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map(Generation._toCamel);
  },

  async findManyWithUser({ filter = {}, limit = 10 }) {
    let query = supabase
      .from("generations")
      .select("*, users(name)");
    query = Generation._applyFilter(query, filter);
    query = query.order("created_at", { ascending: false }).limit(limit);

    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map((row) => {
      const camel = Generation._toCamel(row);
      camel.userId = { name: row.users?.name || "Unknown" };
      return camel;
    });
  },

  async findOne(filter) {
    let query = supabase.from("generations").select("*");
    query = Generation._applyFilter(query, filter);
    const { data, error } = await query.single();
    if (error && error.code !== "PGRST116") throw error;
    if (!data) return null;
    return Generation._toCamel(data);
  },

  async deleteById(id) {
    const { error } = await supabase.from("generations").delete().eq("id", id);
    if (error) throw error;
  },

  async findAllSince(since) {
    const { data, error } = await supabase
      .from("generations")
      .select("created_at")
      .gte("created_at", since.toISOString());
    if (error) throw error;
    return data || [];
  },

  async sumCreditsUsedSince(since) {
    const { data, error } = await supabase
      .from("generations")
      .select("credits_used")
      .gte("created_at", since.toISOString());
    if (error) throw error;
    return (data || []).reduce((sum, row) => sum + (row.credits_used || 0), 0);
  },

  // Internal helpers
  _applyFilter(query, filter) {
    for (const [key, value] of Object.entries(filter)) {
      const col = Generation._toSnake(key);
      if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        for (const [op, val] of Object.entries(value)) {
          if (op === "$gte") query = query.gte(col, val instanceof Date ? val.toISOString() : val);
          if (op === "$lt") query = query.lt(col, val instanceof Date ? val.toISOString() : val);
          if (op === "$ne") query = query.neq(col, val);
        }
      } else {
        query = query.eq(col, value);
      }
    }
    return query;
  },

  _toSnake(key) {
    const map = {
      userId: "user_id",
      filePath: "file_path",
      fileUrl: "file_url",
      creditsUsed: "credits_used",
      savedToGallery: "saved_to_gallery",
      errorMessage: "error_message",
      createdAt: "created_at",
      updatedAt: "updated_at",
    };
    return map[key] || key;
  },

  _toCamel(row) {
    if (!row) return null;
    return {
      id: row.id,
      userId: row.user_id,
      type: row.type,
      prompt: row.prompt,
      filePath: row.file_path,
      fileUrl: row.file_url,
      status: row.status,
      creditsUsed: row.credits_used,
      savedToGallery: row.saved_to_gallery,
      errorMessage: row.error_message,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  },
};

module.exports = Generation;
