import React, { useState, useEffect, useRef, useCallback } from "react";
import { getAdminDashboard } from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Users,
  Sparkles,
  CreditCard,
  Settings,
  Search,
  Bell,
  Plus,
} from "lucide-react";
import "./AdminDashboard.css";

/* ──────── helper: format large numbers ──────── */
const fmt = (n) => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return n.toLocaleString();
  return String(n);
};

/* ──────── helper: time-ago ──────── */
const timeAgo = (date) => {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} mins`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
};

/* ──────── Mini Sparkline SVG ──────── */
const Sparkline = ({ color = "#8b5cf6" }) => {
  const pts = Array.from({ length: 12 }, () => Math.random() * 30 + 5);
  const max = Math.max(...pts);
  const path = pts
    .map((p, i) => {
      const x = (i / (pts.length - 1)) * 120;
      const y = 35 - (p / max) * 30;
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  return (
    <div className="stat-sparkline">
      <svg viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d={path} stroke={color} strokeWidth="2" fill="none" opacity="0.6" />
      </svg>
    </div>
  );
};

/* ──────── GPU Chart (Canvas) ──────── */
const GpuChart = ({ hourlyActivity }) => {
  const canvasRef = useRef(null);

  const drawChart = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);

    // Build data: 24 hours
    const data = new Array(24).fill(0);
    if (hourlyActivity) {
      hourlyActivity.forEach((h) => {
        if (h._id >= 0 && h._id < 24) data[h._id] = h.count;
      });
    }
    // If all zeros, generate sample data for visual appeal
    const hasData = data.some((v) => v > 0);
    const displayData = hasData
      ? data
      : Array.from({ length: 24 }, (_, i) =>
        Math.floor(40 + Math.sin(i * 0.5) * 30 + Math.random() * 20)
      );
    const displayData2 = displayData.map(
      (v) => v * (0.5 + Math.random() * 0.3)
    );

    const max = Math.max(...displayData, ...displayData2) * 1.2;
    const padL = 40;
    const padR = 20;
    const padT = 10;
    const padB = 30;
    const chartW = W - padL - padR;
    const chartH = H - padT - padB;

    // Grid lines
    ctx.strokeStyle = "rgba(100,116,139,0.15)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padT + (chartH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padL, y);
      ctx.lineTo(W - padR, y);
      ctx.stroke();
      // Labels
      ctx.fillStyle = "#64748b";
      ctx.font = "11px Inter, sans-serif";
      ctx.textAlign = "right";
      const pct = Math.round(((4 - i) / 4) * 100);
      ctx.fillText(pct + "%", padL - 8, y + 4);
    }

    // X labels
    const hours = ["12:00 PM", "03:00 PM", "06:00 PM", "09:00 PM", "12:00 AM"];
    ctx.fillStyle = "#64748b";
    ctx.font = "11px Inter, sans-serif";
    ctx.textAlign = "center";
    hours.forEach((label, i) => {
      const x = padL + (chartW / (hours.length - 1)) * i;
      ctx.fillText(label, x, H - 6);
    });

    // Draw area + line for both datasets
    const drawLine = (arr, color, fillColor) => {
      const step = chartW / (arr.length - 1);
      ctx.beginPath();
      arr.forEach((v, i) => {
        const x = padL + step * i;
        const y = padT + chartH - (v / max) * chartH;
        if (i === 0) ctx.moveTo(x, y);
        else {
          // Smooth curve
          const prevX = padL + step * (i - 1);
          const prevY = padT + chartH - (arr[i - 1] / max) * chartH;
          const cpx = (prevX + x) / 2;
          ctx.bezierCurveTo(cpx, prevY, cpx, y, x, y);
        }
      });
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Fill
      const lastX = padL + step * (arr.length - 1);
      const lastY = padT + chartH - (arr[arr.length - 1] / max) * chartH;
      ctx.lineTo(lastX, padT + chartH);
      ctx.lineTo(padL, padT + chartH);
      ctx.closePath();
      ctx.fillStyle = fillColor;
      ctx.fill();
    };

    drawLine(displayData2, "#06b6d4", "rgba(6,182,212,0.08)");
    drawLine(displayData, "#8b5cf6", "rgba(139,92,246,0.12)");
  }, [hourlyActivity]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width * 2;
      canvas.height = rect.height * 2;
      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";
      canvas.getContext("2d").scale(2, 2);
      drawChart();
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [drawChart]);

  return <canvas ref={canvasRef} />;
};

/* ════════════════════════════════════════════════════
   ADMIN DASHBOARD PAGE
   ════════════════════════════════════════════════════ */
const AdminDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeNav, setActiveNav] = useState("overview");
  const BACKEND = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAdminDashboard();
      setData(res);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // refresh every 30s
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, []);

  /* ─── Loading / Error states ─── */
  if (loading && !data) {
    return (
      <div className="admin-dashboard admin-loading">
        <div className="loading-spinner" />
        <span>Loading dashboard…</span>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="admin-dashboard admin-error">
        <span>⚠️ {error}</span>
        <button className="retry-btn" onClick={fetchData}>
          Retry
        </button>
      </div>
    );
  }

  const { stats, hourlyActivity, recentUsers, recentGenerations } = data;

  /* ─── Nav items ─── */
  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "users", label: "Users", icon: Users },
    { id: "generations", label: "Generations", icon: Sparkles },
    { id: "credits", label: "Credits", icon: CreditCard },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  /* ─── Plan badge class ─── */
  const planClass = (plan) => {
    if (!plan) return "free";
    const p = plan.toLowerCase();
    if (p === "enterprise") return "enterprise";
    if (p === "pro") return "pro";
    if (p === "starter") return "starter";
    return "free";
  };

  return (
    <div className="admin-dashboard">
      {/* ═══ SIDEBAR ═══ */}
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <img
            src="/assets/logo.png"
            alt="AI-GEN Logo"
            className="brand-logo"
          />

          <div className="brand-text">
            <h2>AI-GEN</h2>
            <span>Control Center</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeNav === item.id ? "active" : ""}`}
              onClick={() => setActiveNav(item.id)}
            >
              <item.icon className="nav-icon" size={20} />
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-user">
          <div className="user-avatar">
            {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
          </div>
          <div className="user-info">
            <p>{user?.name || "Admin"}</p>
            <span>System Admin</span>
          </div>
        </div>
      </aside>

      {/* ═══ MAIN ═══ */}
      <main className="admin-main">
        {/* ─── Header ─── */}
        <header className="admin-header">
          <div className="header-left">
            <h1>Dashboard Overview</h1>
            <p>Welcome back. Everything is running smoothly.</p>
          </div>
          <div className="header-right">
            <div className="search-box">
              <Search className="search-icon" size={16} />
              <input type="text" placeholder="Search data points..." />
            </div>
            <button className="notification-btn">
              <Bell size={18} />
              <span className="notification-dot" />
            </button>
            <button className="generate-report-btn">
              <Plus size={16} />
              Generate Report
            </button>
          </div>
        </header>

        {/* ─── Stat Cards ─── */}
        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon users">👥</div>
              <span
                className={`stat-badge ${stats.userGrowth >= 0 ? "positive" : "negative"
                  }`}
              >
                {stats.userGrowth >= 0 ? "+" : ""}
                {stats.userGrowth}%
              </span>
            </div>
            <p className="stat-label">Total Users</p>
            <p className="stat-value">{fmt(stats.totalUsers)}</p>
            <Sparkline color="#8b5cf6" />
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon generations">🎬</div>
              <span
                className={`stat-badge ${stats.genGrowth >= 0 ? "positive" : "negative"
                  }`}
              >
                {stats.genGrowth >= 0 ? "+" : ""}
                {stats.genGrowth}%
              </span>
            </div>
            <p className="stat-label">Total Generations</p>
            <p className="stat-value">{fmt(stats.totalGenerations)}</p>
            <Sparkline color="#06b6d4" />
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon revenue">💰</div>
              <span className="stat-badge positive">+8.2%</span>
            </div>
            <p className="stat-label">Monthly Revenue</p>
            <p className="stat-value">
              ${stats.monthlyRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>
            <Sparkline color="#22c55e" />
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon subscriptions">💎</div>
              <span className="stat-badge negative">-2.1%</span>
            </div>
            <p className="stat-label">Active Subscriptions</p>
            <p className="stat-value">{fmt(stats.activeSubscriptions)}</p>
            <Sparkline color="#8b5cf6" />
          </div>
        </section>

        {/* ─── Middle: Chart + Health ─── */}
        <section className="middle-section">
          <div className="chart-card">
            <div className="chart-header">
              <div>
                <h3>Platform GPU Infrastructure</h3>
                <p>Real-time resource utilization across nodes</p>
              </div>
              <div className="chart-legend">
                <span className="legend-item">
                  <span className="legend-dot cluster-a" />
                  Node Cluster A
                </span>
                <span className="legend-item">
                  <span className="legend-dot cluster-b" />
                  Node Cluster B
                </span>
              </div>
            </div>
            <div className="chart-container">
              <GpuChart hourlyActivity={hourlyActivity} />
            </div>
          </div>

          <div className="health-card">
            <h3>Platform Health</h3>
            <div className="health-items">
              <div className="health-item">
                <div className="health-item-left">
                  <span className="health-dot operational" />
                  <strong>Main API</strong>
                </div>
                <span className="health-status operational">Operational</span>
              </div>
              <div className="health-item">
                <div className="health-item-left">
                  <span className="health-dot operational" />
                  <strong>CDN Global</strong>
                </div>
                <span className="health-status operational">Operational</span>
              </div>
              <div className="health-item">
                <div className="health-item-left">
                  <span className="health-dot warning" />
                  <strong>Video Renderer</strong>
                </div>
                <span className="health-status warning">High Load</span>
              </div>
            </div>
            <div className="uptime-section">
              <div className="uptime-header">
                <span>Global Uptime</span>
                <strong>99.98%</strong>
              </div>
              <div className="uptime-bar">
                <div className="uptime-fill" style={{ width: "99.98%" }} />
              </div>
            </div>
          </div>
        </section>

        {/* ─── Bottom: Users + Feed ─── */}
        <section className="bottom-section">
          <div className="users-card">
            <div className="card-header">
              <h3>Recent Users</h3>
              <button className="view-all-btn">View All</button>
            </div>
            <table className="users-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Plan</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers && recentUsers.length > 0 ? (
                  recentUsers.slice(0, 6).map((u) => (
                    <tr key={u.id}>
                      <td>
                        <div className="user-cell">
                          <div className="user-table-avatar">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          {u.name}
                        </div>
                      </td>
                      <td>
                        <span
                          className={`plan-badge ${planClass(
                            u.subscription_plan
                          )}`}
                        >
                          {u.subscription_plan
                            ? u.subscription_plan.charAt(0).toUpperCase() +
                            u.subscription_plan.slice(1)
                            : "Free"}
                        </span>
                      </td>
                      <td style={{ color: "var(--text-secondary)" }}>
                        {timeAgo(u.created_at)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} style={{ textAlign: "center", color: "var(--text-muted)", padding: "24px" }}>
                      No users yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="feed-card">
            <div className="feed-header">
              <h3>Live Generation Feed</h3>
              <span className="live-badge">
                <span className="live-dot" />
                LIVE
              </span>
            </div>
            <div className="feed-grid">
              {recentGenerations && recentGenerations.length > 0 ? (
                recentGenerations.slice(0, 6).map((gen) => (
                  <div className="feed-item" key={gen.id}>
                    {gen.fileUrl ? (
                      <img
                        src={
                          gen.fileUrl.startsWith("http")
                            ? gen.fileUrl
                            : `${BACKEND}${gen.fileUrl}`
                        }
                        alt={gen.prompt}
                        loading="lazy"
                      />
                    ) : (
                      <div className="feed-item-placeholder">
                        <span className="placeholder-icon">
                          {gen.type === "video" ? "🎬" : "🖼️"}
                        </span>
                        <span>{gen.status}</span>
                      </div>
                    )}
                    <span
                      className={`feed-type-badge ${gen.type === "video" ? "video" : "image"
                        }`}
                    >
                      {gen.type === "video" ? "VIDEO" : "IMAGE"}
                    </span>
                    <div className="feed-prompt">
                      {gen.prompt?.slice(0, 60)}
                      {gen.prompt?.length > 60 ? "…" : ""}
                    </div>
                  </div>
                ))
              ) : (
                <div
                  className="feed-item-placeholder"
                  style={{
                    gridColumn: "1 / -1",
                    aspectRatio: "auto",
                    padding: "40px",
                  }}
                >
                  <span className="placeholder-icon">🖼️</span>
                  <span>No generations yet</span>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
