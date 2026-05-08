import { Request } from "express";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    username: string;
  };
}

export interface PaginationQuery {
  page?: string;
  size?: string;
}

export interface PostQuery extends PaginationQuery {
  tag?: string;
  category?: string;
  search?: string;
}
