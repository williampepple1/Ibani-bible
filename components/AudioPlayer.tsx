"use client";

import { useEffect, useState, useRef } from "react";
import { getBookBySlug, getAllBooks } from "@/lib/bible-data";

interface AudioPlayerProps {
  bookSlug: string;
  chapterNum: number;
}

export default function AudioPlayer({ bookSlug, chapterNum }: AudioPlayerProps) {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Generate the filename on the client
    const book = getBookBySlug(bookSlug);
    if (!book) return;

    const allBooks = getAllBooks();
    const bookIndex = allBooks.findIndex((b) => b.code === book.code);
    
    if (bookIndex !== -1) {
      const bNum = String(bookIndex + 1).padStart(2, "0");
      const chNum = String(chapterNum).padStart(3, "0");
      const fileName = `IBYLSTN2DA_B${bNum}_${book.code}_${chNum}.mp3`;
      
      const baseUrl = process.env.NEXT_PUBLIC_AUDIO_BASE_URL || "https://ibani.online";
      setAudioUrl(`${baseUrl}/${fileName}`);
    }
  }, [bookSlug, chapterNum]);

  if (!audioUrl) return null;

  return (
    <div className="audio-player" style={{ 
      margin: "0 auto 32px auto", 
      maxWidth: "600px", 
      background: "var(--bg-secondary)", 
      padding: "16px 20px", 
      borderRadius: "16px",
      boxShadow: "var(--shadow-sm)",
      border: "1px solid var(--border-card)"
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
        <h3 style={{ fontSize: "0.95rem", color: "var(--text-primary)", fontWeight: 600, margin: 0 }}>
          Listen to Chapter {chapterNum}
        </h3>
        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", background: "var(--bg-primary)", padding: "2px 8px", borderRadius: "12px" }}>
          Ibani Audio
        </span>
      </div>
      <audio 
        ref={audioRef} 
        controls 
        src={audioUrl} 
        style={{ width: "100%", height: "40px", borderRadius: "8px" }}
      >
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}
