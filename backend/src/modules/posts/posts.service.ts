import { prisma } from "../../config/database";
import { AppError } from "../../middleware/errorHandler";

const POST_SELECT = {
  id: true,
  title: true,
  body: true,
  createdAt: true,
  updatedAt: true,
  author: { select: { id: true, username: true } },
  category: { select: { id: true, name: true, slug: true } },
  tags: { select: { tag: { select: { id: true, name: true, slug: true } } } },
  _count: { select: { comments: true } },
};

export const getPosts = async (
  page: number,
  size: number,
  tag?: string,
  category?: string,
  search?: string,
) => {
  const where: any = { published: true };

  if (category) where.category = { slug: category };
  if (tag) where.tags = { some: { tag: { slug: tag } } };
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { body: { contains: search, mode: "insensitive" } },
    ];
  }

  const [total, posts] = await Promise.all([
    prisma.post.count({ where }),
    prisma.post.findMany({
      where,
      select: POST_SELECT,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * size,
      take: size,
    }),
  ]);

  return {
    data: posts,
    meta: {
      total,
      page,
      size,
      totalPages: Math.ceil(total / size),
    },
  };
};

export const getPostById = async (id: string) => {
  const post = await prisma.post.findUnique({
    where: { id },
    select: POST_SELECT,
  });
  if (!post) throw new AppError("Post not found", 404);
  return post;
};

export const createPost = async (
  authorId: string,
  title: string,
  body: string,
  categoryId: string,
  tags: string[],
) => {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });
  if (!category) throw new AppError("Category not found", 404);

  return prisma.post.create({
    data: {
      title,
      body,
      authorId,
      categoryId,
      tags: {
        create: tags.map((tagId) => ({ tag: { connect: { id: tagId } } })),
      },
    },
    select: POST_SELECT,
  });
};

export const updatePost = async (
  id: string,
  userId: string,
  data: { title?: string; body?: string; categoryId?: string; tags?: string[] },
) => {
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) throw new AppError("Post not found", 404);
  if (post.authorId !== userId) throw new AppError("Forbidden", 403);

  const { tags, ...rest } = data;

  return prisma.post.update({
    where: { id },
    data: {
      ...rest,
      ...(tags && {
        tags: {
          deleteMany: {},
          create: tags.map((tagId) => ({ tag: { connect: { id: tagId } } })),
        },
      }),
    },
    select: POST_SELECT,
  });
};

export const deletePost = async (id: string, userId: string) => {
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) throw new AppError("Post not found", 404);
  if (post.authorId !== userId) throw new AppError("Forbidden", 403);
  await prisma.post.delete({ where: { id } });
};
