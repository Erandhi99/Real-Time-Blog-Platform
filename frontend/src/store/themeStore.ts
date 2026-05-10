import { create } from "zustand";

type Theme = "light" | "dark";

const apply = (t: Theme) => {
  document.documentElement.setAttribute("data-theme", t);
  localStorage.setItem("theme", t);
};

const initial = (localStorage.getItem("theme") as Theme) ?? "light";
apply(initial);

interface ThemeState {
  theme: Theme;
  toggle: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: initial,
  toggle: () => {
    const next = get().theme === "light" ? "dark" : "light";
    apply(next);
    set({ theme: next });
  },
}));
