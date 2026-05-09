export interface User {
  id: string;
  email: string;
  username: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Post {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  author: { id: string; username: string };
  category: Category;
  tags: { tag: Tag }[];
  _count: { comments: number };
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    size: number;
    totalPages: number;
  };
}

export interface CommentNode {
  id: string;
  body: string;
  deleted: boolean;
  createdAt: string;
  author: { id: string; username: string };
  postId: string;
  parentId: string | null;
  replies: CommentNode[];
}

export interface PaginatedComments {
  data: CommentNode[];
  meta: {
    total: number;
    page: number;
    size: number;
    totalPages: number;
  };
}
