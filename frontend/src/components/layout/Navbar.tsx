import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useThemeStore } from "../../store/themeStore";

export default function Navbar() {
  const { isAuthenticated, user, clearAuth } = useAuthStore();
  const { theme, toggle } = useThemeStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    navigate("/");
  };

  return (
    <nav
      className="sticky top-0 z-50 border-b"
      style={{
        background: "var(--bg-card)",
        borderColor: "var(--border)",
        boxShadow: "var(--shadow)",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
            style={{ background: "var(--accent)" }}
          >
            L
          </div>
          <span
            className="text-lg font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            LiveBlog
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Dark mode toggle */}
          <button
            onClick={toggle}
            className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
            style={{
              background: "var(--bg-hover)",
              color: "var(--text-secondary)",
            }}
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? (
              <svg
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            ) : (
              <svg
                width="18"
                height="18"
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
              <span
                className="hidden sm:block text-sm font-medium"
                style={{ color: "var(--text-secondary)" }}
              >
                {user?.username}
              </span>
              <Link
                to="/create"
                className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg text-white transition"
                style={{ background: "var(--accent)" }}
              >
                <svg
                  width="14"
                  height="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
                <span className="hidden sm:inline">New Post</span>
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm px-3 py-1.5 rounded-lg transition"
                style={{
                  color: "var(--text-secondary)",
                  background: "var(--bg-hover)",
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium px-3 py-1.5 rounded-lg transition"
                style={{
                  color: "var(--text-secondary)",
                  background: "var(--bg-hover)",
                }}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm font-medium px-3 py-1.5 rounded-lg text-white transition"
                style={{ background: "var(--accent)" }}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
