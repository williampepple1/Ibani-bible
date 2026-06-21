"use client";

import { useState, useCallback, useEffect } from "react";
import { Verse, ReadingMode } from "@/lib/types";

interface VerseDisplayProps {
  verses: Verse[];
  bookName: string;
  chapter: number;
}

export default function VerseDisplay({ verses, bookName, chapter }: VerseDisplayProps) {
  const [mode, setMode] = useState<ReadingMode>("side-by-side");

  useEffect(() => {
    const saved = localStorage.getItem("ibani-bible-reading-mode") as ReadingMode | null;
    if (saved && ["ibani", "english", "side-by-side"].includes(saved)) {
      setMode(saved);
    }
  }, []);

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
            <div key={v.verse} className="verse-parallel" id={`verse-${v.verse}`}>
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
            </div>
          ))}
        </div>
      ) : (
        <article className="chapter-content">
          <div className="verses-block">
            {verses.map((v) => (
              <span key={v.verse} className="verse" id={`verse-${v.verse}`}>
                <sup className="verse__number">{v.verse}</sup>
                <span className="verse__text">
                  {mode === "ibani" ? v.ibaniText : v.englishText}
                </span>
              </span>
            ))}
          </div>
        </article>
      )}
    </div>
  );
}
