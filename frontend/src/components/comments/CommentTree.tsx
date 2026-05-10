import type { CommentNode as T } from "../../types";
import CommentNode from "./CommentNode";

interface Props {
  comments: T[];
  postId: string;
  onReply: (id: string, body: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function CommentTree({
  comments,
  postId,
  onReply,
  onDelete,
}: Props) {
  if (comments.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "40px 0",
          color: "var(--text3)",
          fontSize: 13,
          border: "1px dashed var(--border)",
          borderRadius: "var(--radius-lg)",
        }}
      >
        No comments yet — be the first!
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {comments.map((c) => (
        <CommentNode
          key={c.id}
          comment={c}
          postId={postId}
          onReply={onReply}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
