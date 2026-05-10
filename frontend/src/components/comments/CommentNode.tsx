import { useState } from "react";
import type { CommentNode as CommentNodeType } from "../../types";
import { formatDate } from "../../utils/formatDate";
import { useAuthStore } from "../../store/authStore";
import CommentForm from "./CommentForm";

interface Props {
  comment: CommentNodeType;
  postId: string;
  onReply: (commentId: string, body: string) => Promise<void>;
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
  const maxDepth = 4;

  const handleReply = async (body: string) => {
    await onReply(comment.id, body);
    setShowReply(false);
  };

  return (
    <div className="flex gap-3">
      {/* Avatar */}
      <div className="flex-shrink-0">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
          style={{
            background: `hsl(${comment.author.username.charCodeAt(0) * 15}, 60%, 50%)`,
          }}
        >
          {comment.author.username[0].toUpperCase()}
        </div>
        {/* Thread line */}
        {comment.replies.length > 0 && (
          <div
            className="w-px mx-auto mt-2 flex-1"
            style={{
              background: "var(--border)",
              minHeight: "16px",
              height: "calc(100% - 36px)",
            }}
          />
        )}
      </div>

      <div className="flex-1 min-w-0 pb-4">
        {/* Header */}
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span
            className="text-sm font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            {comment.author.username}
          </span>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            {formatDate(comment.createdAt)}
          </span>
        </div>

        {/* Body */}
        <p
          className="text-sm leading-relaxed mb-2"
          style={{
            color: comment.deleted
              ? "var(--text-muted)"
              : "var(--text-secondary)",
            fontStyle: comment.deleted ? "italic" : "normal",
          }}
        >
          {comment.deleted ? "[deleted]" : comment.body}
        </p>

        {/* Reply button */}
        {isAuthenticated && !comment.deleted && depth < maxDepth && (
          <button
            onClick={() => setShowReply(!showReply)}
            className="text-xs font-medium transition"
            style={{ color: "var(--accent)" }}
          >
            {showReply ? "Cancel" : "↩ Reply"}
          </button>
        )}

        {/* Reply form */}
        {showReply && (
          <div className="mt-3">
            <CommentForm
              onSubmit={handleReply}
              placeholder={`Reply to ${comment.author.username}...`}
              autoFocus
              onCancel={() => setShowReply(false)}
            />
          </div>
        )}

        {/* Nested replies */}
        {comment.replies.length > 0 && (
          <div className="mt-4 space-y-4">
            {comment.replies.map((reply) => (
              <CommentNode
                key={reply.id}
                comment={reply}
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
