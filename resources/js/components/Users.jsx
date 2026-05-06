// Users.jsx — ZenHR dark/gold users page

import { useState, useEffect } from "react";
import DashboardLayout from "./DashboardLayout";

function Avatar({ name, size = 34 }) {
  const initials = name ? name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() : "U";
  const colors = ["#f5c518","#22c55e","#3b82f6","#ec4899","#8b5cf6","#f97316"];
  const color = colors[name?.charCodeAt(0) % colors.length] || "#f5c518";
  return (
    <div style={{
      width: size, height: size,
      background: color,
      borderRadius: "50%",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.38, fontWeight: "700", color: "#0d0d0d",
      flexShrink: 0,
    }}>{initials}</div>
  );
}

const MOCK_USERS = [
  { id: 1, name: "Samrita Nath", email: "samrita@originfresh.com", role: "Admin", status: "Active", joined: "Sep 2025", store: "Frazer Town" },
  { id: 2, name: "Arjun Sharma", email: "arjun@originfresh.com", role: "Manager", status: "Active", joined: "Oct 2025", store: "Koramangala" },
  { id: 3, name: "Priya Menon", email: "priya@originfresh.com", role: "Analyst", status: "Active", joined: "Nov 2025", store: "Indiranagar" },
  { id: 4, name: "Rahul Verma", email: "rahul@originfresh.com", role: "Staff", status: "Inactive", joined: "Dec 2025", store: "Frazer Town" },
  { id: 5, name: "Kavya Reddy", email: "kavya@originfresh.com", role: "Manager", status: "Active", joined: "Jan 2026", store: "HSR Layout" },
  { id: 6, name: "Dev Anand", email: "dev@originfresh.com", role: "Analyst", status: "Active", joined: "Feb 2026", store: "Koramangala" },
];

const ROLE_COLORS = {
  Admin: { bg: "rgba(245,197,24,0.15)", color: "#f5c518", border: "rgba(245,197,24,0.3)" },
  Manager: { bg: "rgba(59,130,246,0.15)", color: "#60a5fa", border: "rgba(59,130,246,0.3)" },
  Analyst: { bg: "rgba(139,92,246,0.15)", color: "#a78bfa", border: "rgba(139,92,246,0.3)" },
  Staff: { bg: "rgba(107,114,128,0.15)", color: "#9ca3af", border: "rgba(107,114,128,0.3)" },
};

export default function Users() {
  const [users, setUsers] = useState(MOCK_USERS);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetch("/api/users", { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } })
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setUsers(data); })
      .catch(() => {});
  }, []);

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || u.role === filter;
    return matchSearch && matchFilter;
  });

  return (
    <DashboardLayout currentPath="/users">
      {/* Stats */}
      <div style={styles.statsRow}>
        {[
          { label: "Total Users", value: users.length, icon: "👥" },
          { label: "Active", value: users.filter(u => u.status === "Active").length, icon: "✅" },
          { label: "Admins", value: users.filter(u => u.role === "Admin").length, icon: "🔑" },
          { label: "Stores", value: new Set(users.map(u => u.store)).size, icon: "🏪" },
        ].map(s => (
          <div key={s.label} style={styles.statCard}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ margin: 0, fontSize: 28, fontWeight: 700, color: "#f5c518" }}>{s.value}</p>
                <p style={{ margin: "4px 0 0", fontSize: 12, color: "#555" }}>{s.label}</p>
              </div>
              <span style={{ fontSize: 22 }}>{s.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div style={styles.tableCard}>
        {/* Toolbar */}
        <div style={styles.toolbar}>
          <h3 style={styles.tableTitle}>All Users</h3>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search users..."
              style={styles.searchInput}
            />
            <select
              value={filter}
              onChange={e => setFilter(e.target.value)}
              style={styles.select}
            >
              {["All", "Admin", "Manager", "Analyst", "Staff"].map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <button style={styles.addBtn}>+ Add User</button>
          </div>
        </div>

        {/* Table */}
        <table style={styles.table}>
          <thead>
            <tr style={styles.thead}>
              {["User", "Email", "Role", "Store", "Status", "Joined", ""].map(h => (
                <th key={h} style={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((u, i) => {
              const rc = ROLE_COLORS[u.role] || ROLE_COLORS.Staff;
              return (
                <tr key={u.id} style={{
                  ...styles.tr,
                  background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)",
                }}>
                  <td style={styles.td}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Avatar name={u.name} size={34} />
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#ddd" }}>{u.name}</span>
                    </div>
                  </td>
                  <td style={styles.td}>
                    <span style={{ fontSize: 13, color: "#666" }}>{u.email}</span>
                  </td>
                  <td style={styles.td}>
                    <span style={{
                      background: rc.bg,
                      border: `1px solid ${rc.border}`,
                      color: rc.color,
                      borderRadius: 999,
                      padding: "3px 10px",
                      fontSize: 11,
                      fontWeight: 600,
                    }}>{u.role}</span>
                  </td>
                  <td style={styles.td}>
                    <span style={{ fontSize: 13, color: "#777" }}>{u.store}</span>
                  </td>
                  <td style={styles.td}>
                    <span style={{
                      display: "flex", alignItems: "center", gap: 5, fontSize: 12,
                      color: u.status === "Active" ? "#4ade80" : "#666",
                    }}>
                      <span style={{
                        width: 7, height: 7, borderRadius: "50%",
                        background: u.status === "Active" ? "#4ade80" : "#444",
                        display: "inline-block",
                      }} />
                      {u.status}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <span style={{ fontSize: 12, color: "#555" }}>{u.joined}</span>
                  </td>
                  <td style={styles.td}>
                    <button style={styles.actionBtn}>⋯</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px", color: "#444", fontSize: 14 }}>
            No users found matching your search.
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

const styles = {
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 14,
    marginBottom: 20,
  },
  statCard: {
    background: "#111",
    border: "1px solid #1e1e1e",
    borderRadius: 14,
    padding: "18px 20px",
  },
  tableCard: {
    background: "#111",
    border: "1px solid #1e1e1e",
    borderRadius: 16,
    overflow: "hidden",
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "18px 20px",
    borderBottom: "1px solid #1e1e1e",
  },
  tableTitle: {
    fontSize: 15, fontWeight: 700, color: "#fff", margin: 0,
  },
  searchInput: {
    background: "#1a1a1a",
    border: "1px solid #2a2a2a",
    borderRadius: 9,
    padding: "8px 14px",
    fontSize: 13,
    color: "#fff",
    outline: "none",
    width: 200,
    fontFamily: "inherit",
  },
  select: {
    background: "#1a1a1a",
    border: "1px solid #2a2a2a",
    borderRadius: 9,
    padding: "8px 12px",
    fontSize: 13,
    color: "#ccc",
    outline: "none",
    fontFamily: "inherit",
    cursor: "pointer",
  },
  addBtn: {
    background: "#f5c518",
    border: "none",
    borderRadius: 9,
    padding: "8px 16px",
    fontSize: 13,
    fontWeight: 700,
    color: "#0d0d0d",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  thead: {
    background: "#161616",
  },
  th: {
    padding: "10px 16px",
    textAlign: "left",
    fontSize: 11,
    fontWeight: 600,
    color: "#444",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    borderBottom: "1px solid #1e1e1e",
  },
  tr: {
    borderBottom: "1px solid #1a1a1a",
    transition: "background 0.1s",
  },
  td: {
    padding: "12px 16px",
    verticalAlign: "middle",
  },
  actionBtn: {
    background: "#1a1a1a",
    border: "1px solid #2a2a2a",
    borderRadius: 7,
    padding: "4px 10px",
    color: "#555",
    cursor: "pointer",
    fontSize: 16,
    fontFamily: "inherit",
  },
};
