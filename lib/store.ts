import { create } from "zustand";
import { persist } from "zustand/middleware";

export type FontSize = "small" | "normal" | "large" | "xlarge";

interface AppState {
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  lastRead: { bookSlug: string; chapter: number } | null;
  setLastRead: (bookSlug: string, chapter: number) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      fontSize: "normal",
      setFontSize: (fontSize) => set({ fontSize }),
      lastRead: null,
      setLastRead: (bookSlug, chapter) => set({ lastRead: { bookSlug, chapter } }),
    }),
    {
      name: "ibani-bible-storage",
    }
  )
);
