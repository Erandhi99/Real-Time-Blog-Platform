import { useState } from "react";
import axios from "axios";

interface Props {
  onSubmit: (body: string) => Promise<void>;
  placeholder?: string;
  autoFocus?: boolean;
  onCancel?: () => void;
}

export default function CommentForm({
  onSubmit,
  placeholder = "Write a comment…",
  autoFocus = false,
  onCancel,
}: Props) {
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;
    setLoading(true);
    setError("");
    try {
      await onSubmit(body.trim());
      setBody("");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message ?? "Failed to post comment");
      } else {
        setError("Failed to post comment");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        rows={3}
        style={{
          width: "100%",
          padding: "10px 12px",
          borderRadius: 8,
          fontSize: 13,
          border: "1px solid var(--border)",
          background: "var(--surface2)",
          color: "var(--text1)",
          resize: "none",
          outline: "none",
          lineHeight: 1.5,
          fontFamily: "inherit",
        }}
      />
      {error && (
        <p style={{ fontSize: 12, color: "var(--danger)", marginTop: 4 }}>
          {error}
        </p>
      )}
      <div
        style={{
          display: "flex",
          gap: 8,
          justifyContent: "flex-end",
          marginTop: 8,
        }}
      >
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: "6px 12px",
              borderRadius: 7,
              border: "1px solid var(--border)",
              background: "transparent",
              color: "var(--text2)",
              fontSize: 12,
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading || !body.trim()}
          style={{
            padding: "6px 14px",
            borderRadius: 7,
            border: "none",
            background: "var(--accent)",
            color: "#fff",
            fontSize: 12,
            cursor: loading || !body.trim() ? "not-allowed" : "pointer",
            fontWeight: 600,
            opacity: loading || !body.trim() ? 0.6 : 1,
          }}
        >
          {loading ? "Posting…" : "Post"}
        </button>
      </div>
    </form>
  );
}
