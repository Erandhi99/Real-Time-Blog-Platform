import { Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { AppError } from "./errorHandler";
import { AuthRequest } from "../types";

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return next(new AppError("No token provided", 401));
  }
  const token = authHeader.split(" ")[1];
  const payload = verifyToken(token);
  if (!payload) {
    return next(new AppError("Invalid or expired token", 401));
  }
  req.user = payload;
  next();
};
