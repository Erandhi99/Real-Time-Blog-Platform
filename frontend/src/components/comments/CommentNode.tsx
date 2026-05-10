import { useState } from "react";
import type { CommentNode as T } from "../../types";
import { formatDate } from "../../utils/formatDate";
import { useAuthStore } from "../../store/authStore";
import CommentForm from "./CommentForm";

interface Props {
  comment: T;
  postId: string;
  onReply: (id: string, body: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  depth?: number;
}

export default function CommentNode({
  comment,
  postId,
  onReply,
  onDelete,
  depth = 0,
}: Props) {
  const [showReply, setShowReply] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { isAuthenticated, user } = useAuthStore();
  const isAuthor = user?.id === comment.author.id;

  const handleDelete = async () => {
    if (!confirm("Delete this comment?")) return;
    setDeleting(true);
    try {
      await onDelete(comment.id);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div style={{ display: "flex", gap: 10 }}>
      {/* Avatar + thread line */}
      <div
        style={{
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            flexShrink: 0,
            background: `hsl(${(comment.author.username.charCodeAt(0) * 17) % 360}, 55%, 50%)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: 11,
            fontWeight: 700,
          }}
        >
          {comment.author.username[0].toUpperCase()}
        </div>
        {(comment.replies.length > 0 || showReply) && (
          <div
            style={{
              width: 1,
              flex: 1,
              background: "var(--border)",
              marginTop: 6,
              minHeight: 16,
            }}
          />
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0, paddingBottom: 16 }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 4,
            flexWrap: "wrap",
            gap: 6,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{ fontSize: 13, fontWeight: 600, color: "var(--text1)" }}
            >
              {comment.author.username}
            </span>
            <span style={{ fontSize: 11, color: "var(--text3)" }}>
              {formatDate(comment.createdAt)}
            </span>
          </div>

          {/* Delete button — author only, only on non-deleted comments */}
          {isAuthor && !comment.deleted && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              title="Delete comment"
              style={{
                background: "none",
                border: "none",
                cursor: deleting ? "not-allowed" : "pointer",
                color: "var(--text3)",
                padding: "2px 4px",
                borderRadius: 4,
                fontSize: 11,
                opacity: deleting ? 0.5 : 1,
                display: "flex",
                alignItems: "center",
                gap: 3,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--danger)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--text3)")
              }
            >
              <svg
                width="12"
                height="12"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14H6L5 6" />
                <path d="M10 11v6M14 11v6" />
                <path d="M9 6V4h6v2" />
              </svg>
              {deleting ? "Deleting…" : "Delete"}
            </button>
          )}
        </div>

        {/* Body */}
        <p
          style={{
            fontSize: 13,
            lineHeight: 1.55,
            marginBottom: 6,
            color: comment.deleted ? "var(--text3)" : "var(--text2)",
            fontStyle: comment.deleted ? "italic" : "normal",
          }}
        >
          {comment.deleted ? "[deleted]" : comment.body}
        </p>

        {/* Reply button */}
        {isAuthenticated && !comment.deleted && depth < 4 && (
          <button
            onClick={() => setShowReply(!showReply)}
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "var(--accent)",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            {showReply ? "Cancel" : "↩ Reply"}
          </button>
        )}

        {/* Reply form */}
        {showReply && (
          <div style={{ marginTop: 10 }}>
            <CommentForm
              onSubmit={async (body) => {
                await onReply(comment.id, body);
                setShowReply(false);
              }}
              placeholder={`Reply to ${comment.author.username}…`}
              autoFocus
              onCancel={() => setShowReply(false)}
            />
          </div>
        )}

        {/* Nested replies */}
        {comment.replies.length > 0 && (
          <div style={{ marginTop: 14 }}>
            {comment.replies.map((r) => (
              <CommentNode
                key={r.id}
                comment={r}
                postId={postId}
                onReply={onReply}
                onDelete={onDelete}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
