import { apiClient } from "./client";
import type { AuthResponse } from "../types";

export const registerApi = async (
  email: string,
  username: string,
  password: string,
): Promise<AuthResponse> => {
  const res = await apiClient.post("/auth/register", {
    email,
    username,
    password,
  });
  return res.data;
};

export const loginApi = async (
  email: string,
  password: string,
): Promise<AuthResponse> => {
  const res = await apiClient.post("/auth/login", { email, password });
  return res.data;
};
