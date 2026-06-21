"use client";

import { useEffect } from "react";
import { useAppStore } from "@/lib/store";

export default function ChapterTracker({ bookSlug, chapter }: { bookSlug: string, chapter: number }) {
  const setLastRead = useAppStore((state) => state.setLastRead);
  
  useEffect(() => {
    setLastRead(bookSlug, chapter);
  }, [bookSlug, chapter, setLastRead]);
  
  return null;
}
