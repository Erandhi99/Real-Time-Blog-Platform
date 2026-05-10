import type { CommentNode as CommentNodeType } from "../../types";
import CommentNode from "./CommentNode";

interface Props {
  comments: CommentNodeType[];
  postId: string;
  onReply: (commentId: string, body: string) => Promise<void>;
}

export default function CommentTree({ comments, postId, onReply }: Props) {
  if (comments.length === 0) {
    return (
      <div
        className="text-center py-12 rounded-xl border"
        style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
      >
        <p className="text-lg mb-1">No comments yet</p>
        <p className="text-sm">Be the first to start the conversation!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <CommentNode
          key={comment.id}
          comment={comment}
          postId={postId}
          onReply={onReply}
        />
      ))}
    </div>
  );
}
