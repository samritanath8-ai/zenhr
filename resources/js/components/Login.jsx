// Login.jsx — ZenHR dark/gold theme

import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Invalid credentials");
      localStorage.setItem("token", data.token);
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.root}>
      {/* Background noise/glow */}
      <div style={styles.glowTop} />
      <div style={styles.glowBottom} />

      <div style={styles.container}>
        {/* Logo */}
        <div style={styles.logoWrap}>
          <div style={styles.logoIcon}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect x="2" y="2" width="10" height="10" rx="2.5" fill="#1a1a1a"/>
              <rect x="16" y="2" width="10" height="10" rx="2.5" fill="#1a1a1a"/>
              <rect x="2" y="16" width="10" height="10" rx="2.5" fill="#1a1a1a"/>
              <rect x="16" y="16" width="10" height="10" rx="2.5" fill="#1a1a1a"/>
            </svg>
          </div>
          <span style={styles.logoText}>ZenHR</span>
        </div>

        {/* Card */}
        <div style={styles.card}>
          <h1 style={styles.heading}>Welcome back</h1>
          <p style={styles.subheading}>Sign in to your account to continue</p>

          {error && <div style={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Email address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                style={styles.input}
                onFocus={e => e.target.style.borderColor = "#f5c518"}
                onBlur={e => e.target.style.borderColor = "#2a2a2a"}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={styles.input}
                onFocus={e => e.target.style.borderColor = "#f5c518"}
                onBlur={e => e.target.style.borderColor = "#2a2a2a"}
              />
            </div>

            <button type="submit" disabled={loading} style={{
              ...styles.btn,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}>
              {loading ? "Signing in..." : "Sign in →"}
            </button>
          </form>
        </div>

        <p style={styles.footer}>
          Don't have an account?{" "}
          <a href="/register" style={styles.link}>Create one</a>
        </p>
      </div>
    </div>
  );
}

const styles = {
  root: {
    minHeight: "100vh",
    background: "#0d0d0d",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'DM Sans', system-ui, sans-serif",
    position: "relative",
    overflow: "hidden",
  },
  glowTop: {
    position: "absolute",
    top: "-200px",
    right: "-100px",
    width: "500px",
    height: "500px",
    background: "radial-gradient(circle, rgba(245,197,24,0.08) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  glowBottom: {
    position: "absolute",
    bottom: "-200px",
    left: "-100px",
    width: "400px",
    height: "400px",
    background: "radial-gradient(circle, rgba(30,60,80,0.3) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  container: {
    width: "100%",
    maxWidth: "420px",
    padding: "0 20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "24px",
    position: "relative",
    zIndex: 1,
  },
  logoWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
  },
  logoIcon: {
    width: "56px",
    height: "56px",
    background: "#f5c518",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 8px 32px rgba(245,197,24,0.3)",
  },
  logoText: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: "-0.02em",
  },
  card: {
    width: "100%",
    background: "#161616",
    border: "1px solid #232323",
    borderRadius: "20px",
    padding: "36px 32px",
    boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
  },
  heading: {
    fontSize: "26px",
    fontWeight: "700",
    color: "#ffffff",
    margin: "0 0 8px",
    letterSpacing: "-0.03em",
  },
  subheading: {
    fontSize: "14px",
    color: "#666",
    margin: "0 0 28px",
  },
  error: {
    background: "rgba(239,68,68,0.1)",
    border: "1px solid rgba(239,68,68,0.3)",
    borderRadius: "10px",
    padding: "10px 14px",
    fontSize: "13px",
    color: "#f87171",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#ccc",
  },
  input: {
    background: "#1e1e1e",
    border: "1px solid #2a2a2a",
    borderRadius: "10px",
    padding: "12px 16px",
    fontSize: "14px",
    color: "#fff",
    outline: "none",
    transition: "border-color 0.2s",
    width: "100%",
    boxSizing: "border-box",
  },
  btn: {
    background: "#f5c518",
    border: "none",
    borderRadius: "12px",
    padding: "14px",
    fontSize: "15px",
    fontWeight: "700",
    color: "#0d0d0d",
    marginTop: "8px",
    transition: "all 0.2s",
    letterSpacing: "-0.01em",
  },
  footer: {
    fontSize: "14px",
    color: "#555",
  },
  link: {
    color: "#f5c518",
    fontWeight: "600",
    textDecoration: "none",
  },
};
