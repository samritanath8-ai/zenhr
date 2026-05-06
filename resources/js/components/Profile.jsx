// Profile.jsx — ZenHR dark/gold profile page

import { useState } from "react";
import DashboardLayout from "./DashboardLayout";

function Avatar({ name, size = 80 }) {
  const initials = name ? name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() : "U";
  return (
    <div style={{
      width: size, height: size,
      background: "linear-gradient(135deg, #f5c518, #e6a800)",
      borderRadius: "50%",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.38, fontWeight: "700", color: "#0d0d0d",
      flexShrink: 0,
      boxShadow: "0 8px 32px rgba(245,197,24,0.3)",
    }}>{initials}</div>
  );
}

const Field = ({ label, value, editable, onChange }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
    <label style={{ fontSize: 12, fontWeight: 600, color: "#555", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</label>
    {editable ? (
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          background: "#1a1a1a",
          border: "1px solid #2a2a2a",
          borderRadius: 10,
          padding: "11px 14px",
          fontSize: 14,
          color: "#fff",
          outline: "none",
          fontFamily: "inherit",
        }}
        onFocus={e => e.target.style.borderColor = "#f5c518"}
        onBlur={e => e.target.style.borderColor = "#2a2a2a"}
      />
    ) : (
      <div style={{
        background: "#161616",
        border: "1px solid #1e1e1e",
        borderRadius: 10,
        padding: "11px 14px",
        fontSize: 14,
        color: "#777",
      }}>{value}</div>
    )}
  </div>
);

export default function Profile() {
  const user = JSON.parse(localStorage.getItem("user") || '{"name":"Admin User","email":"admin@originfresh.com","role":"Admin"}');
  const [name, setName] = useState(user.name);
  const [saved, setSaved] = useState(false);
  const [tab, setTab] = useState("profile"); // profile | security | activity

  const handleSave = () => {
    const updated = { ...user, name };
    localStorage.setItem("user", JSON.stringify(updated));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const TABS = [
    { id: "profile", label: "Profile" },
    { id: "security", label: "Security" },
    { id: "activity", label: "Activity" },
  ];

  return (
    <DashboardLayout currentPath="/profile">
      {/* Header card */}
      <div style={styles.heroCard}>
        <div style={styles.heroBg} />
        <div style={styles.heroContent}>
          <Avatar name={name} size={80} />
          <div>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>{name}</h2>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#888" }}>{user.email}</p>
            <span style={styles.roleBadge}>{user.role}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            ...styles.tabBtn,
            color: tab === t.id ? "#f5c518" : "#555",
            borderBottom: tab === t.id ? "2px solid #f5c518" : "2px solid transparent",
          }}>{t.label}</button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "profile" && (
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Personal Information</h3>
          <div style={styles.grid}>
            <Field label="Full Name" value={name} editable onChange={setName} />
            <Field label="Email Address" value={user.email} editable={false} />
            <Field label="Role" value={user.role} editable={false} />
            <Field label="Member Since" value="September 2025" editable={false} />
          </div>
          <div style={{ marginTop: 24, display: "flex", gap: 12, alignItems: "center" }}>
            <button onClick={handleSave} style={styles.saveBtn}>Save Changes</button>
            {saved && <span style={{ fontSize: 13, color: "#4ade80" }}>✓ Saved successfully</span>}
          </div>
        </div>
      )}

      {tab === "security" && (
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Security Settings</h3>
          <div style={styles.grid}>
            <Field label="Current Password" value="••••••••" editable={false} />
            <Field label="New Password" value="" editable onChange={() => {}} />
            <Field label="Confirm Password" value="" editable onChange={() => {}} />
          </div>
          <button style={{ ...styles.saveBtn, marginTop: 24 }}>Update Password</button>
        </div>
      )}

      {tab === "activity" && (
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Recent Activity</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>
            {[
              { action: "Logged in", time: "Today, 9:12 AM", icon: "🔐" },
              { action: "Ran forecast model", time: "Today, 6:02 AM", icon: "🔄" },
              { action: "Viewed dashboard", time: "Yesterday, 4:30 PM", icon: "📊" },
              { action: "Updated profile", time: "Apr 20, 2026", icon: "👤" },
              { action: "Logged in", time: "Apr 20, 2026", icon: "🔐" },
            ].map((item, i) => (
              <div key={i} style={styles.activityRow}>
                <span style={{ fontSize: 18 }}>{item.icon}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: 13, color: "#ddd", fontWeight: 500 }}>{item.action}</p>
                  <p style={{ margin: "2px 0 0", fontSize: 12, color: "#555" }}>{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats row */}
      <div style={styles.statsRow}>
        {[
          { label: "Forecasts Run", value: "42" },
          { label: "Products Tracked", value: "49" },
          { label: "Days Active", value: "236" },
          { label: "Reports Generated", value: "18" },
        ].map(stat => (
          <div key={stat.label} style={styles.statCard}>
            <p style={{ margin: 0, fontSize: 28, fontWeight: 700, color: "#f5c518" }}>{stat.value}</p>
            <p style={{ margin: "4px 0 0", fontSize: 12, color: "#555" }}>{stat.label}</p>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}

const styles = {
  heroCard: {
    position: "relative",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 24,
    border: "1px solid #1e1e1e",
  },
  heroBg: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(135deg, #161616 0%, #111 60%, rgba(245,197,24,0.05) 100%)",
  },
  heroContent: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    gap: 20,
    padding: "28px 28px",
  },
  roleBadge: {
    display: "inline-block",
    marginTop: 8,
    background: "rgba(245,197,24,0.15)",
    border: "1px solid rgba(245,197,24,0.3)",
    borderRadius: 999,
    padding: "3px 12px",
    fontSize: 11,
    fontWeight: 600,
    color: "#f5c518",
    letterSpacing: "0.04em",
  },
  tabs: {
    display: "flex",
    gap: 4,
    borderBottom: "1px solid #1e1e1e",
    marginBottom: 20,
  },
  tabBtn: {
    background: "transparent",
    border: "none",
    padding: "10px 16px",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "all 0.15s",
  },
  card: {
    background: "#111",
    border: "1px solid #1e1e1e",
    borderRadius: 16,
    padding: "24px",
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 700,
    color: "#fff",
    margin: "0 0 20px",
    letterSpacing: "-0.01em",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
  },
  saveBtn: {
    background: "#f5c518",
    border: "none",
    borderRadius: 10,
    padding: "11px 24px",
    fontSize: 14,
    fontWeight: 700,
    color: "#0d0d0d",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  activityRow: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: "12px 14px",
    background: "#161616",
    borderRadius: 10,
    border: "1px solid #1e1e1e",
  },
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 14,
  },
  statCard: {
    background: "#111",
    border: "1px solid #1e1e1e",
    borderRadius: 14,
    padding: "20px",
    textAlign: "center",
  },
};
