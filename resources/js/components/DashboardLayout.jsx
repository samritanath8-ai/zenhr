// Dashboard.jsx — drop inside DashboardLayout as children
// Usage:
//   import DashboardLayout from "./DashboardLayout";
//   import Dashboard from "./Dashboard";
//
//   <DashboardLayout currentPath="/dashboard">
//     <Dashboard />
//   </DashboardLayout>

import { useState, useEffect, useCallback } from "react";

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000";
const REFRESH_INTERVAL = 30_000; // 30 seconds

// ─── API HELPERS ─────────────────────────────────────────────────────────────
const authHeaders = () => ({
  Accept: "application/json",
  Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
});

async function fetchMetrics() {
  const res = await fetch(`${API_BASE}/api/dashboard/metrics`, { headers: authHeaders() });
  if (!res.ok) throw new Error(`metrics: ${res.status}`);
  return res.json();
  // { total_users, active_sessions, requests_today }
}

async function fetchActivity() {
  const res = await fetch(`${API_BASE}/api/dashboard/activity`, { headers: authHeaders() });
  if (!res.ok) throw new Error(`activity: ${res.status}`);
  return res.json();
  // [{ day, date, count }, ...]
}

// ─── ACTIVITY BAR CHART ──────────────────────────────────────────────────────
const BAR_COLORS = ["#7f77dd","#6ecfaa","#378add","#f5c518","#e07bb5","#5bc5f5","#f08060"];

function ActivityChart({ data, loading }) {
  const max = Math.max(...(data?.map(d => d.count) ?? [1]), 1);

  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 100, marginBottom: 10 }}>
      {(loading || !data ? Array.from({ length: 7 }, (_, i) => ({ day: "—", date: i, count: 0, skeleton: true })) : data)
        .map((d, i) => {
          const height = d.skeleton ? 60 : Math.max(Math.round((d.count / max) * 80), d.count > 0 ? 8 : 3);
          return (
            <div key={d.date} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}
              title={!d.skeleton ? `${d.day} ${d.date}: ${d.count} requests` : undefined}>
              <div style={{
                width: "100%", height,
                borderRadius: "5px 5px 0 0",
                background: d.skeleton ? "#2a2a2e" : (d.count > 0 ? BAR_COLORS[i % BAR_COLORS.length] : "#2a2a2e"),
                opacity: d.skeleton ? 0.35 : (d.count > 0 ? 0.85 : 0.3),
                transition: "height 0.5s ease",
                animation: d.skeleton ? "pulse 1.5s infinite" : "none",
              }} />
              <span style={{ fontSize: 11, color: "#666" }}>{d.day}</span>
            </div>
          );
        })}
    </div>
  );
}

// ─── STAT CARD ───────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, loading, accentColor }) {
  return (
    <div style={{
      flex: 1, background: "#161616", borderRadius: 14,
      padding: "20px 22px", border: "1px solid #1e1e1e",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <span style={{ fontSize: 13, color: "#666" }}>{label}</span>
        <div style={{
          width: 30, height: 30, borderRadius: 8, background: accentColor,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>{icon}</div>
      </div>
      {loading
        ? <div style={{ width: 56, height: 34, borderRadius: 8, background: "#2a2a2e", animation: "pulse 1.5s infinite" }} />
        : <div style={{ fontSize: 30, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>
            {value ?? <span style={{ color: "#444", fontWeight: 400 }}>—</span>}
          </div>
      }
    </div>
  );
}

// ─── QUICK ACTION ─────────────────────────────────────────────────────────────
function QuickAction({ icon, iconBg, label, sub, href = "#" }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a href={href} style={{ textDecoration: "none" }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "11px 12px", borderRadius: 10,
          border: "1px solid #1e1e1e",
          background: hovered ? "#1a1a1a" : "transparent",
          cursor: "pointer", transition: "background 0.15s", marginBottom: 8,
        }}
      >
        <div style={{
          width: 34, height: 34, borderRadius: 9, background: iconBg,
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          fontSize: 15,
        }}>{icon}</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#ccc" }}>{label}</div>
          <div style={{ fontSize: 11, color: "#555" }}>{sub}</div>
        </div>
      </div>
    </a>
  );
}

// ─── MAIN DASHBOARD ──────────────────────────────────────────────────────────
export default function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const load = useCallback(async () => {
    try {
      const [m, a] = await Promise.all([fetchMetrics(), fetchActivity()]);
      setMetrics(m);
      setActivity(a);
      setLastUpdated(new Date());
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [load]);

  return (
    <>
      <style>{`@keyframes pulse { 0%,100%{opacity:.4} 50%{opacity:.8} }`}</style>

      {/* Error banner */}
      {error && (
        <div style={{
          background: "#1e1010", border: "1px solid #4a1a1a", borderRadius: 10,
          padding: "12px 16px", marginBottom: 20, fontSize: 13, color: "#f87171",
        }}>
          ⚠ Could not load data: {error}
        </div>
      )}

      {/* Last updated */}
      {lastUpdated && (
        <p style={{ fontSize: 11, color: "#444", marginBottom: 20, marginTop: -8 }}>
          Last updated {lastUpdated.toLocaleTimeString()} · auto-refreshes every 30s
        </p>
      )}

      {/* Stat cards */}
      <div style={{ display: "flex", gap: 14, marginBottom: 20 }}>
        <StatCard
          label="Total Users"
          value={metrics?.total_users}
          loading={loading}
          accentColor="#1e1a2e"
          icon={
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
              <circle cx="5.5" cy="5" r="2.5" fill="#7f77dd"/>
              <circle cx="10.5" cy="5" r="2.5" fill="#7f77dd" opacity=".5"/>
              <path d="M0 13c0-2 2.5-3.5 5.5-3.5S11 11 11 13" stroke="#7f77dd" strokeWidth="1.2" strokeLinecap="round"/>
              <path d="M10 10.5c1.5 0 3.5.8 3.5 2.5" stroke="#7f77dd" strokeWidth="1.2" strokeLinecap="round" opacity=".5"/>
            </svg>
          }
        />
        <StatCard
          label="Active Sessions"
          value={metrics?.active_sessions}
          loading={loading}
          accentColor="#0e1e14"
          icon={
            <div style={{
              width: 10, height: 10, borderRadius: "50%",
              background: metrics?.active_sessions > 0 ? "#22c880" : "#333",
              boxShadow: metrics?.active_sessions > 0 ? "0 0 6px #22c880" : "none",
            }} />
          }
        />
        <StatCard
          label="Requests Today"
          value={metrics?.requests_today}
          loading={loading}
          accentColor="#0e1620"
          icon={
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="2" width="12" height="12" rx="2" stroke="#378add" strokeWidth="1.2"/>
              <path d="M5 8h6M5 5h6M5 11h4" stroke="#378add" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          }
        />
      </div>

      {/* Activity + Quick actions */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 240px", gap: 14 }}>

        {/* Activity chart */}
        <div style={{ background: "#161616", borderRadius: 14, border: "1px solid #1e1e1e", padding: "20px 22px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#ddd" }}>Activity Overview</div>
              <div style={{ fontSize: 12, color: "#555", marginBottom: 20 }}>
                {activity ? "API requests per day" : "Connect your data source to populate"}
              </div>
            </div>
            <span style={{ background: "#2a2218", color: "#f5c518", fontSize: 12, padding: "4px 10px", borderRadius: 20 }}>
              Last 7 days
            </span>
          </div>
          <ActivityChart data={activity} loading={loading} />
          {activity && (
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <span style={{ fontSize: 11, color: "#444" }}>
                Total: {activity.reduce((s, d) => s + d.count, 0).toLocaleString()} requests
              </span>
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div style={{ background: "#161616", borderRadius: 14, border: "1px solid #1e1e1e", padding: "20px 22px" }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: "#ddd", marginBottom: 14 }}>Quick actions</div>
          <QuickAction icon="+" iconBg="#1e1e24" label="Add user" sub="Create a new account" href="/users/create" />
          <QuickAction icon="👥" iconBg="#1e1a2e" label="Manage users" sub="View all registered users" href="/users" />
          <QuickAction icon="⚙️" iconBg="#1a1e24" label="Settings" sub="Profile & preferences" href="/settings" />
        </div>
      </div>
    </>
  );
}