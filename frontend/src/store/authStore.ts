import { create } from "zustand";
import type { User } from "../types";

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  isAuthenticated: boolean;
}

// Load token from sessionStorage on app start
const storedToken = sessionStorage.getItem("token");
const storedUser = sessionStorage.getItem("user");

export const useAuthStore = create<AuthState>((set) => ({
  user: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken ?? null,
  isAuthenticated: !!storedToken,

  setAuth: (user, token) => {
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("user", JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },

  clearAuth: () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
