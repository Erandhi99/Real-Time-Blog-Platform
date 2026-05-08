import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(3).max(200),
  body: z.string().min(10),
  categoryId: z.string(),
  tags: z.array(z.string()).optional().default([]),
});

export const updatePostSchema = createPostSchema.partial();
