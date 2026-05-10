import { apiClient } from "./client";
import type { PaginatedComments, CommentNode } from "../types";

export const getCommentsApi = async (
  postId: string,
  page = 1,
  size = 20,
): Promise<PaginatedComments> => {
  const res = await apiClient.get(`/posts/${postId}/comments`, {
    params: { page, size },
  });
  return res.data;
};

export const createCommentApi = async (
  postId: string,
  body: string,
): Promise<CommentNode> => {
  const res = await apiClient.post(`/posts/${postId}/comments`, { body });
  return res.data;
};

export const replyToCommentApi = async (
  postId: string,
  commentId: string,
  body: string,
): Promise<CommentNode> => {
  const res = await apiClient.post(
    `/posts/${postId}/comments/${commentId}/reply`,
    { body },
  );
  return res.data;
};

export const deleteCommentApi = async (commentId: string): Promise<void> => {
  await apiClient.delete(`/comments/${commentId}`);
};
