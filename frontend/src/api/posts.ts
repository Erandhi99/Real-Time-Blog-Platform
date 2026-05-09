import { apiClient } from "./client";
import type { Post, PaginatedResponse } from "../types";

export interface GetPostsParams {
  page?: number;
  size?: number;
  tag?: string;
  category?: string;
  search?: string;
}

export const getPostsApi = async (
  params: GetPostsParams,
): Promise<PaginatedResponse<Post>> => {
  const res = await apiClient.get("/posts", { params });
  return res.data;
};

export const getPostApi = async (id: string): Promise<Post> => {
  const res = await apiClient.get(`/posts/${id}`);
  return res.data;
};

export const createPostApi = async (data: {
  title: string;
  body: string;
  categoryId: string;
  tags: string[];
}): Promise<Post> => {
  const res = await apiClient.post("/posts", data);
  return res.data;
};

export const updatePostApi = async (
  id: string,
  data: Partial<{
    title: string;
    body: string;
    categoryId: string;
    tags: string[];
  }>,
): Promise<Post> => {
  const res = await apiClient.put(`/posts/${id}`, data);
  return res.data;
};

export const deletePostApi = async (id: string): Promise<void> => {
  await apiClient.delete(`/posts/${id}`);
};

export const getCategoriesApi = async () => {
  const res = await apiClient.get("/categories");
  return res.data;
};

export const getTagsApi = async () => {
  const res = await apiClient.get("/tags");
  return res.data;
};
