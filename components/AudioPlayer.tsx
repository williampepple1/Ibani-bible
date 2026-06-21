"use client";

import { useState, useEffect, useRef } from "react";

interface AudioPlayerProps {
  bookSlug: string;
  chapterNum: number;
}

export default function AudioPlayer({ bookSlug, chapterNum }: AudioPlayerProps) {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    async function fetchAudioUrl() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/audio/${bookSlug}/${chapterNum}`);
        if (!res.ok) throw new Error("Audio not available");
        const data = await res.json();
        if (data.url) {
          setAudioUrl(data.url);
        } else {
          throw new Error("No URL returned");
        }
      } catch (err) {
        console.error("Failed to load audio:", err);
        setError("Audio not available for this chapter.");
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchAudioUrl();
  }, [bookSlug, chapterNum]);

  if (isLoading) {
    return (
      <div style={{ margin: "0 auto 24px auto", maxWidth: "600px", padding: "16px", textAlign: "center", color: "var(--text-muted)", fontSize: "0.9rem" }}>
        Loading audio...
      </div>
    );
  }

  if (error || !audioUrl) {
    // Silently fail if audio is not found so it doesn't clutter the UI
    // Alternatively, uncomment to show error:
    // return <div style={{ color: "red", textAlign: "center", marginBottom: "24px" }}>{error}</div>;
    return null; 
  }

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
