import { useState } from "react";
import type { CommentNode as T } from "../../types";
import { formatDate } from "../../utils/formatDate";
import { useAuthStore } from "../../store/authStore";
import CommentForm from "./CommentForm";

interface Props {
  comment: T;
  postId: string;
  onReply: (id: string, body: string) => Promise<void>;
  depth?: number;
}

export default function CommentNode({
  comment,
  postId,
  onReply,
  depth = 0,
}: Props) {
  const [showReply, setShowReply] = useState(false);
  const { isAuthenticated } = useAuthStore();

  return (
    <div style={{ display: "flex", gap: 10 }}>
      {/* Avatar */}
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 4,
            flexWrap: "wrap",
          }}
        >
          <span
            style={{ fontSize: 13, fontWeight: 600, color: "var(--text1)" }}
          >
            {comment.author.username}
          </span>
          <span style={{ fontSize: 11, color: "var(--text3)" }}>
            {formatDate(comment.createdAt)}
          </span>
        </div>

        <p
          style={{
            fontSize: 13,
            color: comment.deleted ? "var(--text3)" : "var(--text2)",
            fontStyle: comment.deleted ? "italic" : "normal",
            lineHeight: 1.55,
            marginBottom: 6,
          }}
        >
          {comment.deleted ? "[deleted]" : comment.body}
        </p>

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

        {comment.replies.length > 0 && (
          <div
            style={{
              marginTop: 14,
              display: "flex",
              flexDirection: "column",
              gap: 0,
            }}
          >
            {comment.replies.map((r) => (
              <CommentNode
                key={r.id}
                comment={r}
                postId={postId}
                onReply={onReply}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
