"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { searchVerses, SearchResult } from "@/lib/bible-data";

export default function SearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (query.length > 2) {
        setResults(searchVerses(query));
      } else {
        setResults([]);
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "var(--bg-glass)", backdropFilter: "blur(8px)",
      zIndex: 9999, display: "flex", justifyContent: "center", alignItems: "flex-start", padding: "80px 20px"
    }}>
      <div style={{
        width: "100%", maxWidth: "600px", background: "var(--bg-card)",
        borderRadius: "16px", boxShadow: "var(--shadow-lg)", border: "1px solid var(--border-card)",
        overflow: "hidden", display: "flex", flexDirection: "column", maxHeight: "80vh"
      }}>
        <div style={{ padding: "16px", borderBottom: "1px solid var(--border-subtle)", display: "flex", gap: "12px" }}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search the Bible (English or Ibani)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1, background: "transparent", border: "none", outline: "none",
              color: "var(--text-primary)", fontSize: "1.1rem"
            }}
          />
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "1.2rem" }}>
            ✕
          </button>
        </div>
        <div style={{ overflowY: "auto", padding: "16px", flex: 1 }}>
          {query.length > 2 && results.length === 0 && (
            <div style={{ textAlign: "center", color: "var(--text-muted)", padding: "32px 0" }}>No results found for &quot;{query}&quot;</div>
          )}
          {query.length <= 2 && (
            <div style={{ textAlign: "center", color: "var(--text-muted)", padding: "32px 0" }}>Type at least 3 characters to search</div>
          )}
          {results.slice(0, 100).map((r, i) => (
            <Link key={i} href={`/${r.bookSlug}/${r.chapter}#verse-${r.verse}`} onClick={onClose} style={{
              display: "block", padding: "12px", borderBottom: "1px solid var(--border-subtle)", textDecoration: "none"
            }}>
              <div style={{ fontSize: "0.8rem", color: "var(--accent-gold)", fontWeight: 600, marginBottom: "4px" }}>
                {r.bookName} {r.chapter}:{r.verse}
              </div>
              <div style={{ color: "var(--text-primary)", fontSize: "0.95rem", marginBottom: "2px", fontFamily: "var(--font-serif)" }}>{r.ibaniText}</div>
              <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", fontStyle: "italic", fontFamily: "var(--font-serif)" }}>{r.englishText}</div>
            </Link>
          ))}
          {results.length > 100 && (
            <div style={{ textAlign: "center", color: "var(--text-muted)", paddingTop: "16px", fontSize: "0.8rem" }}>
              Showing first 100 results. Keep typing to refine.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
