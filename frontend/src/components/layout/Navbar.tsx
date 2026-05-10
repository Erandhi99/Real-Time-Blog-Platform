import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useThemeStore } from "../../store/themeStore";

export default function Navbar() {
  const { isAuthenticated, user, clearAuth } = useAuthStore();
  const { theme, toggle } = useThemeStore();
  const navigate = useNavigate();

  const s = {
    nav: {
      background: "var(--surface)",
      borderBottom: "1px solid var(--border)",
      position: "sticky" as const,
      top: 0,
      zIndex: 50,
    },
    inner: {
      maxWidth: 960,
      margin: "0 auto",
      padding: "0 16px",
      height: 56,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    logo: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      fontWeight: 700,
      fontSize: 17,
      color: "var(--text1)",
    },
    logoDot: {
      width: 28,
      height: 28,
      borderRadius: 8,
      background: "var(--accent)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#fff",
      fontSize: 13,
      fontWeight: 700,
    },
    right: { display: "flex", alignItems: "center", gap: 8 },
    iconBtn: {
      width: 34,
      height: 34,
      borderRadius: 8,
      border: "1px solid var(--border)",
      background: "var(--surface2)",
      color: "var(--text2)",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    ghostBtn: {
      padding: "6px 12px",
      borderRadius: 8,
      border: "1px solid var(--border)",
      background: "transparent",
      color: "var(--text2)",
      cursor: "pointer",
      fontSize: 13,
      fontWeight: 500,
    },
    primaryBtn: {
      padding: "6px 14px",
      borderRadius: 8,
      border: "none",
      background: "var(--accent)",
      color: "#fff",
      cursor: "pointer",
      fontSize: 13,
      fontWeight: 600,
      display: "flex",
      alignItems: "center",
      gap: 5,
    },
    userText: {
      fontSize: 13,
      color: "var(--text3)",
    },
  };

  return (
    <nav style={s.nav}>
      <div style={s.inner}>
        <Link to="/" style={s.logo}>
          <div style={s.logoDot}>L</div>
          LiveBlog
        </Link>

        <div style={s.right}>
          <button
            onClick={toggle}
            style={s.iconBtn}
            title="Toggle theme"
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <svg
                width="15"
                height="15"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            ) : (
              <svg
                width="15"
                height="15"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            )}
          </button>

          {isAuthenticated ? (
            <>
              <span style={s.userText}>{user?.username}</span>
              <Link to="/create" style={s.primaryBtn}>
                <svg
                  width="13"
                  height="13"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
                New post
              </Link>
              <button
                onClick={() => {
                  clearAuth();
                  navigate("/");
                }}
                style={s.ghostBtn}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={s.ghostBtn as React.CSSProperties}>
                Login
              </Link>
              <Link to="/register" style={s.primaryBtn as React.CSSProperties}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
