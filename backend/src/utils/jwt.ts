import jwt from "jsonwebtoken";
import { env } from "../config/env";

interface TokenPayload {
  id: string;
  email: string;
  username: string;
}

export const signToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "7d" });
};

export const verifyToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
};
