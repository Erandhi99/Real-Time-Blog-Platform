import { useEffect } from "react";

interface Props {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  danger = false,
  onConfirm,
  onCancel,
}: Props) {
  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onCancel]);

  // Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    // Backdrop
    <div
      onClick={onCancel}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        backdropFilter: "blur(2px)",
      }}
    >
      {/* Modal box — stop click from closing when clicking inside */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          padding: "24px",
          width: "100%",
          maxWidth: 400,
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          animation: "modalIn 0.15s ease",
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: danger ? "var(--danger-bg)" : "var(--accent-bg)",
          }}
        >
          {danger ? (
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="var(--danger)"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14H6L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4h6v2" />
            </svg>
          ) : (
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
          )}
        </div>

        {/* Title */}
        <h3
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: "var(--text1)",
            margin: "0 0 8px",
          }}
        >
          {title}
        </h3>

        {/* Message */}
        <p
          style={{
            fontSize: 13,
            color: "var(--text2)",
            margin: "0 0 24px",
            lineHeight: 1.6,
          }}
        >
          {message}
        </p>

        {/* Buttons */}
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button
            onClick={onCancel}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              background: "transparent",
              color: "var(--text2)",
              border: "1px solid var(--border)",
            }}
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              border: "none",
              background: danger ? "var(--danger)" : "var(--accent)",
              color: "#fff",
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);   }
        }
      `}</style>
    </div>
  );
}
