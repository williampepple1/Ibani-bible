"use client";

import { useState, useCallback, useEffect } from "react";
import { Verse, ReadingMode } from "@/lib/types";

interface VerseDisplayProps {
  verses: Verse[];
  bookName: string;
  bookSlug: string;
  chapter: number;
}

export default function VerseDisplay({ verses, bookName, bookSlug, chapter }: VerseDisplayProps) {
  // Prefer ?mode= from the share URL, then fall back to localStorage
  const [mode, setMode] = useState<ReadingMode>(() => {
    if (typeof window === "undefined") return "side-by-side";
    const params = new URLSearchParams(window.location.search);
    const urlMode = params.get("mode");
    if (urlMode && (["ibani", "english", "side-by-side"] as string[]).includes(urlMode)) {
      return urlMode as ReadingMode;
    }
    const saved = localStorage.getItem("ibani-bible-reading-mode") as ReadingMode | null;
    if (saved && (["ibani", "english", "side-by-side"] as string[]).includes(saved)) {
      return saved;
    }
    return "side-by-side";
  });
  // Initialise from hash so the verse is highlighted before the first paint
  const [selectedVerse, setSelectedVerse] = useState<number | null>(() => {
    if (typeof window === "undefined") return null;
    const hash = window.location.hash;
    if (!hash.startsWith("#verse-")) return null;
    const n = parseInt(hash.replace("#verse-", ""), 10);
    return isNaN(n) ? null : n;
  });

  const handleShare = async (v: Verse) => {
    const verseUrl = `https://bible.ibani.online/${bookSlug}/${chapter}?mode=${mode}#verse-${v.verse}`;
    const text = `${bookName} ${chapter}:${v.verse}\n\nIbani: ${v.ibaniText}\nEnglish: ${v.englishText}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${bookName} ${chapter}:${v.verse}`,
          text: text,
          url: verseUrl,
        });
      } catch (err) {
        console.log("Error sharing", err);
      }
    } else {
      await navigator.clipboard.writeText(verseUrl);
      alert(`Link copied!\n${verseUrl}`);
    }
    setSelectedVerse(null);
  };

  // Scroll to the pre-selected verse after hydration
  useEffect(() => {
    if (selectedVerse === null) return;
    const timer = setTimeout(() => {
      const el = document.getElementById(`verse-${selectedVerse}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 300);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount only

  const changeMode = useCallback((newMode: ReadingMode) => {
    setMode(newMode);
    localStorage.setItem("ibani-bible-reading-mode", newMode);
  }, []);

  return (
    <div id="verse-display">
      {/* Reading Mode Toggle */}
      <div className="reading-mode" role="radiogroup" aria-label="Reading mode">
        <button
          className={`reading-mode__btn ${mode === "ibani" ? "active" : ""}`}
          onClick={() => changeMode("ibani")}
          role="radio"
          aria-checked={mode === "ibani"}
          id="mode-ibani"
        >
          Ibani
        </button>
        <button
          className={`reading-mode__btn ${mode === "english" ? "active" : ""}`}
          onClick={() => changeMode("english")}
          role="radio"
          aria-checked={mode === "english"}
          id="mode-english"
        >
          English
        </button>
        <button
          className={`reading-mode__btn ${mode === "side-by-side" ? "active" : ""}`}
          onClick={() => changeMode("side-by-side")}
          role="radio"
          aria-checked={mode === "side-by-side"}
          id="mode-side-by-side"
        >
          Side by Side
        </button>
      </div>

      {/* Chapter Title */}
      <h1 className="chapter-heading">
        {bookName} {chapter}
      </h1>
      <p className="chapter-subheading">
        {verses.length} verse{verses.length !== 1 ? "s" : ""}
        {mode === "ibani" && " · Ibani"}
        {mode === "english" && " · English"}
        {mode === "side-by-side" && " · Ibani & English"}
      </p>

      {/* Verses */}
      {mode === "side-by-side" ? (
        <div className={`chapter-content chapter-content--wide`}>
          {verses.map((v) => (
            <div 
              key={v.verse} 
              className={`verse-parallel ${selectedVerse === v.verse ? 'selected' : ''}`} 
              id={`verse-${v.verse}`}
              onClick={() => setSelectedVerse(selectedVerse === v.verse ? null : v.verse)}
              style={{ cursor: "pointer", position: "relative", backgroundColor: selectedVerse === v.verse ? "var(--accent-gold-dim)" : "transparent", padding: selectedVerse === v.verse ? "16px" : "16px 0", borderRadius: selectedVerse === v.verse ? "8px" : "0" }}
            >
              <div className="verse-parallel__col">
                <div className="verse-parallel__label">Ibani</div>
                <sup className="verse__number">{v.verse}</sup>
                <span>{v.ibaniText}</span>
              </div>
              <div className="verse-parallel__col verse-parallel__col--english">
                <div className="verse-parallel__label">English</div>
                <sup className="verse__number">{v.verse}</sup>
                <span>{v.englishText}</span>
              </div>
              {selectedVerse === v.verse && (
                <div style={{ position: "absolute", top: "8px", right: "8px" }}>
                  <button onClick={(e) => { e.stopPropagation(); handleShare(v); }} style={{ background: "var(--accent-gold)", color: "#fff", border: "none", padding: "4px 12px", borderRadius: "16px", fontSize: "0.8rem", cursor: "pointer", fontWeight: 600, boxShadow: "var(--shadow-sm)" }}>
                    Share / Copy
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <article className="chapter-content">
          <div className="verses-block">
            {verses.map((v) => (
              <span 
                key={v.verse} 
                className="verse" 
                id={`verse-${v.verse}`}
                onClick={() => setSelectedVerse(selectedVerse === v.verse ? null : v.verse)}
                style={{ cursor: "pointer", backgroundColor: selectedVerse === v.verse ? "var(--accent-gold-dim)" : "transparent", position: "relative" }}
              >
                <sup className="verse__number">{v.verse}</sup>
                <span className="verse__text">
                  {mode === "ibani" ? v.ibaniText : v.englishText}
                </span>
                {selectedVerse === v.verse && (
                  <button onClick={(e) => { e.stopPropagation(); handleShare(v); }} style={{ background: "var(--accent-gold)", color: "#fff", border: "none", padding: "2px 8px", borderRadius: "12px", fontSize: "0.7rem", cursor: "pointer", fontWeight: 600, marginLeft: "8px", verticalAlign: "middle" }}>
                    Share
                  </button>
                )}
              </span>
            ))}
          </div>
        </article>
      )}
    </div>
  );
}
