import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { loginApi } from "../api/auth";
import axios from "axios";

const inputStyle = {
  width: "100%",
  padding: "9px 12px",
  borderRadius: 8,
  fontSize: 14,
  border: "1px solid var(--border)",
  background: "var(--surface2)",
  color: "var(--text1)",
  outline: "none",
};
const labelStyle = {
  display: "block",
  fontSize: 13,
  fontWeight: 600,
  color: "var(--text2)",
  marginBottom: 5,
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { user, token } = await loginApi(email, password);
      setAuth(user, token);
      navigate("/");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message ?? "Login failed");
      } else {
        setError("Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "48px auto" }}>
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          padding: "32px 28px",
        }}
      >
        <h1
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: "var(--text1)",
            marginBottom: 6,
          }}
        >
          Welcome back
        </h1>
        <p style={{ fontSize: 13, color: "var(--text3)", marginBottom: 24 }}>
          Sign in to your account
        </p>

        {error && (
          <div
            style={{
              padding: "10px 12px",
              borderRadius: 8,
              fontSize: 13,
              background: "var(--danger-bg)",
              color: "var(--danger)",
              marginBottom: 16,
            }}
          >
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 16 }}
        >
          <div>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              //placeholder="••••••••"
              style={inputStyle}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "10px",
              borderRadius: 8,
              border: "none",
              background: "var(--accent)",
              color: "#fff",
              fontSize: 14,
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              marginTop: 4,
            }}
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p
          style={{
            fontSize: 13,
            color: "var(--text3)",
            textAlign: "center",
            marginTop: 20,
          }}
        >
          No account?{" "}
          <Link
            to="/register"
            style={{ color: "var(--accent)", fontWeight: 500 }}
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
