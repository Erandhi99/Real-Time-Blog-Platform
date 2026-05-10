import { useState } from "react";
import Button from "../ui/Button";
import axios from "axios";

interface Props {
  onSubmit: (body: string) => Promise<void>;
  placeholder?: string;
  autoFocus?: boolean;
  onCancel?: () => void;
}

export default function CommentForm({
  onSubmit,
  placeholder = "Write a comment...",
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
        className="w-full text-sm rounded-xl p-3 resize-none focus:outline-none focus:ring-2 transition"
        style={
          {
            background: "var(--bg-secondary)",
            border: "1px solid var(--border)",
            color: "var(--text-primary)",
            "--tw-ring-color": "var(--accent)",
          } as React.CSSProperties
        }
      />
      {error && (
        <p className="text-xs mt-1" style={{ color: "var(--danger)" }}>
          {error}
        </p>
      )}
      <div className="flex gap-2 mt-2 justify-end">
        {onCancel && (
          <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" size="sm" disabled={loading || !body.trim()}>
          {loading ? "Posting..." : "Post"}
        </Button>
      </div>
    </form>
  );
}
