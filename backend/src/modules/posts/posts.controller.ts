import { Response, NextFunction } from "express";
import { AuthRequest } from "../../types";
import * as PostService from "./posts.service";

export const listPosts = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const size = Math.min(50, parseInt(req.query.size as string) || 10);
    const { tag, category, search } = req.query as Record<string, string>;
    const result = await PostService.getPosts(
      page,
      size,
      tag,
      category,
      search,
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const getPost = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const post = await PostService.getPostById(req.params.id as string);
    res.json(post);
  } catch (err) {
    next(err);
  }
};

export const createPost = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { title, body, categoryId, tags } = req.body;
    const post = await PostService.createPost(
      req.user!.id,
      title,
      body,
      categoryId,
      tags,
    );
    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
};

export const updatePost = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const post = await PostService.updatePost(
      req.params.id as string,
      req.user!.id,
      req.body,
    );
    res.json(post);
  } catch (err) {
    next(err);
  }
};

export const deletePost = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    await PostService.deletePost(req.params.id as string, req.user!.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
