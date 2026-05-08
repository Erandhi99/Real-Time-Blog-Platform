export interface CommentNode {
  id: string;
  body: string;
  deleted: boolean;
  createdAt: Date;
  authorId: string;
  author: { id: string; username: string };
  postId: string;
  parentId: string | null;
  replies: CommentNode[];
}

export const buildCommentTree = (
  flatComments: Omit<CommentNode, "replies">[],
): CommentNode[] => {
  const map = new Map<string, CommentNode>();
  const roots: CommentNode[] = [];

  // First pass: create all nodes
  for (const comment of flatComments) {
    map.set(comment.id, { ...comment, replies: [] });
  }

  // Second pass: assign children to parents
  for (const comment of map.values()) {
    if (comment.parentId === null) {
      roots.push(comment);
    } else {
      const parent = map.get(comment.parentId);
      if (parent) {
        parent.replies.push(comment);
      }
    }
  }

  return roots;
};
