const User = require("../models/User");
const Generation = require("../models/Generation");

// GET /api/admin/dashboard
exports.getDashboardStats = async (req, res) => {
  try {
    /* ─── Aggregate Counts ─── */
    const totalUsers = await User.countDocuments();
    const totalGenerations = await Generation.countDocuments();

    // Active subscriptions = users NOT on free plan
    const activeSubscriptions = await User.countDocuments({
      subscription_plan: { $ne: "free" },
    });

    // Monthly revenue — sum of creditsUsed this month × $0.02 per credit
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const revenueAgg = await Generation.aggregate([
      { $match: { createdAt: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: "$creditsUsed" } } },
    ]);
    const monthlyRevenue = revenueAgg.length
      ? (revenueAgg[0].total * 0.02).toFixed(2)
      : "0.00";

    /* ─── Growth percentages (this month vs last month) ─── */
    const startOfLastMonth = new Date(startOfMonth);
    startOfLastMonth.setMonth(startOfLastMonth.getMonth() - 1);

    const usersThisMonth = await User.countDocuments({
      createdAt: { $gte: startOfMonth },
    });
    const usersLastMonth = await User.countDocuments({
      createdAt: { $gte: startOfLastMonth, $lt: startOfMonth },
    });

    const gensThisMonth = await Generation.countDocuments({
      createdAt: { $gte: startOfMonth },
    });
    const gensLastMonth = await Generation.countDocuments({
      createdAt: { $gte: startOfLastMonth, $lt: startOfMonth },
    });

    const pct = (curr, prev) => {
      if (prev === 0) return curr > 0 ? 100 : 0;
      return (((curr - prev) / prev) * 100).toFixed(1);
    };

    /* ─── Generation activity by hour (last 24h) for chart ─── */
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const hourlyActivity = await Generation.aggregate([
      { $match: { createdAt: { $gte: oneDayAgo } } },
      {
        $group: {
          _id: { $hour: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    /* ─── Recent users (last 10) ─── */
    const recentUsers = await User.find()
      .select("name email subscription_plan createdAt")
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    /* ─── Recent generations (last 10) ─── */
    const recentGenerations = await Generation.find()
      .populate("userId", "name")
      .select("type prompt fileUrl status createdAt")
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

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
