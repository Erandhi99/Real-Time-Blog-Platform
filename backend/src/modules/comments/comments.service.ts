import { prisma } from "../../config/database";
import { AppError } from "../../middleware/errorHandler";
import { buildCommentTree } from "../../utils/buildCommentTree";

const COMMENT_SELECT = {
  id: true,
  body: true,
  deleted: true,
  createdAt: true,
  authorId: true,
  author: { select: { id: true, username: true } },
  postId: true,
  parentId: true,
};

export const getComments = async (
  postId: string,
  page: number,
  size: number,
) => {
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) throw new AppError("Post not found", 404);

  // Count only top-level comments for pagination
  const total = await prisma.comment.count({
    where: { postId, parentId: null },
  });

  // Get paginated top-level comment IDs
  const topLevel = await prisma.comment.findMany({
    where: { postId, parentId: null },
    orderBy: { createdAt: "asc" },
    skip: (page - 1) * size,
    take: size,
    select: { id: true },
  });

  const topLevelIds = topLevel.map((c) => c.id);

  // Fetch all comments in the thread (top-level + all their descendants)
  const allComments = await prisma.$queryRaw<any[]>`
    WITH RECURSIVE comment_tree AS (
      SELECT * FROM "Comment" WHERE id = ANY(${topLevelIds}::text[])
      UNION ALL
      SELECT c.* FROM "Comment" c
      INNER JOIN comment_tree ct ON c."parentId" = ct.id
    )
    SELECT * FROM comment_tree ORDER BY "createdAt" ASC
  `;

  // Fetch authors for all comments
  const authorIds = [...new Set(allComments.map((c) => c.authorId))];
  const authors = await prisma.user.findMany({
    where: { id: { in: authorIds } },
    select: { id: true, username: true },
  });
  const authorMap = new Map(authors.map((a) => [a.id, a]));

  const withAuthors = allComments.map((c) => ({
    ...c,
    body: c.deleted ? "[deleted]" : c.body,
    author: authorMap.get(c.authorId) ?? {
      id: c.authorId,
      username: "unknown",
    },
  }));

  return {
    data: buildCommentTree(withAuthors),
    meta: {
      total,
      page,
      size,
      totalPages: Math.ceil(total / size),
    },
  };
};

export const createComment = async (
  postId: string,
  authorId: string,
  body: string,
  parentId?: string,
) => {
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) throw new AppError("Post not found", 404);

  if (parentId) {
    const parent = await prisma.comment.findUnique({ where: { id: parentId } });
    if (!parent || parent.postId !== postId) {
      throw new AppError("Parent comment not found", 404);
    }
  }

  const comment = await prisma.comment.create({
    data: { body, authorId, postId, parentId: parentId ?? null },
    select: {
      ...COMMENT_SELECT,
      replies: false,
    },
  });

  return { ...comment, replies: [] };
};

export const deleteComment = async (id: string, userId: string) => {
  const comment = await prisma.comment.findUnique({ where: { id } });
  if (!comment) throw new AppError("Comment not found", 404);
  if (comment.authorId !== userId) throw new AppError("Forbidden", 403);

  // Soft delete — preserve thread structure
  return prisma.comment.update({
    where: { id },
    data: { deleted: true, body: "[deleted]" },
  });
};
