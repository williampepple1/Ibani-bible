"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";

export default function HomePage() {
  const router = useRouter();
  const lastRead = useAppStore((state) => state.lastRead);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    if (lastRead) {
      router.replace(`/${lastRead.bookSlug}/${lastRead.chapter}`);
    } else {
      router.replace("/matthew/1");
    }
  }, [mounted, lastRead, router]);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", color: "var(--text-muted)" }}>
      Loading...
    </div>
  );
}
