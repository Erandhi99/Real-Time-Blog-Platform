import { Response, NextFunction } from "express";
import { AuthRequest } from "../../types";
import * as CommentService from "./comments.service";

export const listComments = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const size = Math.min(50, parseInt(req.query.size as string) || 20);
    const result = await CommentService.getComments(
      req.params.postId as string,
      page,
      size,
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const createComment = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const comment = await CommentService.createComment(
      req.params.postId as string,
      req.user!.id,
      req.body.body,
    );
    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
};

export const replyToComment = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const comment = await CommentService.createComment(
      req.params.postId as string,
      req.user!.id,
      req.body.body,
      req.params.commentId as string,
    );
    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
};

export const deleteComment = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    await CommentService.deleteComment(req.params.id as string, req.user!.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
