const User = require("../models/User");
const Generation = require("../models/Generation");

// GET /api/admin/dashboard
exports.getDashboardStats = async (req, res) => {
  try {
    /* ─── Aggregate Counts ─── */
    const totalUsers = await User.countAll();
    const totalGenerations = await Generation.countAll();

    // Active subscriptions = users NOT on free plan
    const activeSubscriptions = await User.countWhere({
      subscription_plan: { $ne: "free" },
    });

    // Monthly revenue — sum of creditsUsed this month × $0.02 per credit
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const totalCreditsUsed = await Generation.sumCreditsUsedSince(startOfMonth);
    const monthlyRevenue = (totalCreditsUsed * 0.02).toFixed(2);

    /* ─── Growth percentages (this month vs last month) ─── */
    const startOfLastMonth = new Date(startOfMonth);
    startOfLastMonth.setMonth(startOfLastMonth.getMonth() - 1);

    const usersThisMonth = await User.countWhere({
      created_at: { $gte: startOfMonth.toISOString() },
    });
    const usersLastMonth = await User.countWhere({
      created_at: {
        $gte: startOfLastMonth.toISOString(),
        $lt: startOfMonth.toISOString(),
      },
    });

    const gensThisMonth = await Generation.countWhere({
      created_at: { $gte: startOfMonth.toISOString() },
    });
    const gensLastMonth = await Generation.countWhere({
      created_at: {
        $gte: startOfLastMonth.toISOString(),
        $lt: startOfMonth.toISOString(),
      },
    });

    const pct = (curr, prev) => {
      if (prev === 0) return curr > 0 ? 100 : 0;
      return (((curr - prev) / prev) * 100).toFixed(1);
    };

    /* ─── Generation activity by hour (last 24h) for chart ─── */
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentGens = await Generation.findAllSince(oneDayAgo);

    // Group by hour in JS
    const hourlyMap = {};
    for (const gen of recentGens) {
      const hour = new Date(gen.created_at).getUTCHours();
      hourlyMap[hour] = (hourlyMap[hour] || 0) + 1;
    }
    const hourlyActivity = Object.entries(hourlyMap)
      .map(([hour, count]) => ({ _id: parseInt(hour), count }))
      .sort((a, b) => a._id - b._id);

    /* ─── Recent users (last 10) ─── */
    const recentUsers = await User.findRecent(10, "id, name, email, subscription_plan, created_at");

    /* ─── Recent generations (last 10) ─── */
    const recentGenerations = await Generation.findManyWithUser({ limit: 10 });

    res.json({
      stats: {
        totalUsers,
        totalGenerations,
        monthlyRevenue: Number(monthlyRevenue),
        activeSubscriptions,
        userGrowth: Number(pct(usersThisMonth, usersLastMonth)),
        genGrowth: Number(pct(gensThisMonth, gensLastMonth)),
      },
      hourlyActivity,
      recentUsers,
      recentGenerations,
    });
  } catch (err) {
    console.error("Admin dashboard error:", err);
    res.status(500).json({ message: "Failed to load dashboard data" });
  }
};
