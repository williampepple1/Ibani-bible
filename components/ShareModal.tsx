"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Verse, ReadingMode } from "@/lib/types";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ImageEntry {
  filename: string;
  url: string;
}

interface ShareModalProps {
  verse: Verse;
  bookName: string;
  bookSlug: string;
  chapter: number;
  mode: ReadingMode;
  onClose: () => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const RECENT_KEY = "ibani-bible-recent-images";
const MAX_RECENT = 5;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getRecent(): ImageEntry[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveRecent(entry: ImageEntry) {
  const prev = getRecent().filter((r) => r.url !== entry.url);
  const next = [entry, ...prev].slice(0, MAX_RECENT);
  localStorage.setItem(RECENT_KEY, JSON.stringify(next));
}

// ─── Lazy image card ──────────────────────────────────────────────────────────

function LazyImageCard({
  entry,
  selected,
  onClick,
}: {
  entry: ImageEntry;
  selected: boolean;
  onClick: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([ent]) => { if (ent.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { rootMargin: "200px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <button
      ref={ref}
      onClick={onClick}
      className={`img-picker__card ${selected ? "img-picker__card--selected" : ""}`}
      aria-label={`Select image ${entry.filename}`}
    >
      {visible ? (
        <>
          {!loaded && <div className="img-picker__skeleton" />}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={entry.url}
            alt={entry.filename}
            crossOrigin="anonymous"
            onLoad={() => setLoaded(true)}
            style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.3s" }}
          />
        </>
      ) : (
        <div className="img-picker__skeleton" />
      )}
      {selected && (
        <span className="img-picker__check" aria-hidden>✓</span>
      )}
    </button>
  );
}

// ─── Canvas composer ──────────────────────────────────────────────────────────

async function composeImage(
  imageUrl: string,
  verse: Verse,
  bookName: string,
  chapter: number,
  mode: ReadingMode
): Promise<Blob | null> {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1080;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // Draw background image
  await new Promise<void>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      // Cover-fit
      const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
      const w = img.width * scale;
      const h = img.height * scale;
      ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
      resolve();
    };
    img.onerror = reject;
    img.src = imageUrl;
  });

  // Dark overlay
  ctx.fillStyle = "rgba(0,0,0,0.52)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Gold accent bar
  const grad = ctx.createLinearGradient(60, 0, 400, 0);
  grad.addColorStop(0, "#d4a853");
  grad.addColorStop(1, "#e8c778");
  ctx.fillStyle = grad;
  ctx.fillRect(60, 100, 6, 80);

  // Reference label
  ctx.font = "600 32px 'Inter', sans-serif";
  ctx.fillStyle = "#d4a853";
  ctx.fillText(`${bookName} ${chapter}:${verse.verse}`, 80, 145);

  // Word-wrap helper
  function wrapText(text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
    if (!ctx) return y;
    const words = text.split(" ");
    let line = "";
    let cy = y;
    for (const word of words) {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > maxWidth && line) {
        ctx.fillText(line, x, cy);
        line = word;
        cy += lineHeight;
      } else {
        line = test;
      }
    }
    if (line) ctx.fillText(line, x, cy);
    return cy + lineHeight;
  }

  const PAD = 80;
  const MAX_W = canvas.width - PAD * 2;

  // Ibani text
  if (mode !== "english") {
    ctx.font = "italic 400 44px 'Noto Serif', Georgia, serif";
    ctx.fillStyle = "#f0f0f5";
    const nextY = wrapText(verse.ibaniText, PAD, 240, MAX_W, 60);

    // English text (smaller, below)
    if (mode === "side-by-side") {
      ctx.font = "400 32px 'Noto Serif', Georgia, serif";
      ctx.fillStyle = "rgba(200,208,220,0.9)";
      wrapText(verse.englishText, PAD, nextY + 20, MAX_W, 46);
    }
  } else {
    ctx.font = "italic 400 44px 'Noto Serif', Georgia, serif";
    ctx.fillStyle = "#f0f0f5";
    wrapText(verse.englishText, PAD, 240, MAX_W, 60);
  }

  // Branding
  ctx.font = "500 26px 'Inter', sans-serif";
  ctx.fillStyle = "rgba(212,168,83,0.75)";
  ctx.textAlign = "right";
  ctx.fillText("bible.ibani.online", canvas.width - PAD, canvas.height - 60);

  return new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.92));
}

// ─── Main Modal ───────────────────────────────────────────────────────────────

export default function ShareModal({
  verse,
  bookName,
  bookSlug,
  chapter,
  mode,
  onClose,
}: ShareModalProps) {
  const [tab, setTab] = useState<"link" | "image">("link");
  const [shareMode, setShareMode] = useState<ReadingMode>(mode);
  const [images, setImages] = useState<ImageEntry[]>([]);
  const [recent, setRecent] = useState<ImageEntry[]>([]);
  const [selected, setSelected] = useState<ImageEntry | null>(null);
  const [composing, setComposing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  const verseUrl = `https://bible.ibani.online/${bookSlug}/${chapter}?mode=${mode}#verse-${verse.verse}`;
  const shareText = `${bookName} ${chapter}:${verse.verse}\n\nIbani: ${verse.ibaniText}\nEnglish: ${verse.englishText}`;

  // Load saved share mode
  useEffect(() => {
    const saved = localStorage.getItem("ibani-bible-share-mode") as ReadingMode | null;
    if (saved && ["ibani", "english", "side-by-side"].includes(saved)) {
      setShareMode(saved);
    }
  }, []);

  const handleShareModeChange = (newMode: ReadingMode) => {
    setShareMode(newMode);
    localStorage.setItem("ibani-bible-share-mode", newMode);
  };

  // Load image manifest once
  useEffect(() => {
    if (tab !== "image" || images.length > 0 || fetchError) return;
    fetch("/image-manifest.json")
      .then((r) => r.json())
      .then((data: ImageEntry[]) => {
        setImages(shuffle(data));
        setRecent(getRecent());
      })
      .catch(() => setFetchError(true));
  }, [tab, images.length, fetchError]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleSelectImage = useCallback((entry: ImageEntry) => {
    setSelected(entry);
  }, []);

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(verseUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    try {
      await navigator.share({ title: `${bookName} ${chapter}:${verse.verse}`, text: shareText, url: verseUrl });
    } catch {
      handleCopyLink();
    }
  };

  const handleShareImage = async () => {
    if (!selected) return;
    setComposing(true);
    try {
      saveRecent(selected);
      setRecent(getRecent());
      const blob = await composeImage(selected.url, verse, bookName, chapter, shareMode);
      if (!blob) return;
      const file = new File([blob], `ibani-bible-${bookSlug}-${chapter}-${verse.verse}.jpg`, { type: "image/jpeg" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: `${bookName} ${chapter}:${verse.verse}`, text: shareText });
      } else {
        // fallback: download
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = file.name;
        a.click();
        URL.revokeObjectURL(a.href);
      }
    } catch (err) {
      console.error("Share image error", err);
    } finally {
      setComposing(false);
    }
  };

  return (
    <div
      className="share-modal__backdrop"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label="Share verse"
    >
      <div className="share-modal__panel">
        {/* Header */}
        <div className="share-modal__header">
          <div>
            <h2 className="share-modal__title">Share Verse</h2>
            <p className="share-modal__ref">{bookName} {chapter}:{verse.verse}</p>
          </div>
          <button className="share-modal__close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* Tabs */}
        <div className="share-tabs" role="tablist">
          <button
            role="tab"
            aria-selected={tab === "link"}
            className={`share-tab ${tab === "link" ? "share-tab--active" : ""}`}
            onClick={() => setTab("link")}
            id="tab-link"
          >
            🔗 Share Link
          </button>
          <button
            role="tab"
            aria-selected={tab === "image"}
            className={`share-tab ${tab === "image" ? "share-tab--active" : ""}`}
            onClick={() => setTab("image")}
            id="tab-image"
          >
            🖼️ Share as Image
          </button>
        </div>

        {/* ── Tab: Link ── */}
        {tab === "link" && (
          <div className="share-modal__body" role="tabpanel" aria-labelledby="tab-link">
            <div className="share-verse-preview">
              <p className="share-verse-preview__ibani">{verse.ibaniText}</p>
              {mode !== "ibani" && (
                <p className="share-verse-preview__english">{verse.englishText}</p>
              )}
            </div>
            <div className="share-url-box">
              <span className="share-url-box__url">{verseUrl}</span>
            </div>
            <div className="share-actions">
              {typeof navigator !== "undefined" && "share" in navigator && (
                <button className="share-btn share-btn--primary" onClick={handleNativeShare}>
                  ↗ Share
                </button>
              )}
              <button className="share-btn share-btn--secondary" onClick={handleCopyLink}>
                {copied ? "✓ Copied!" : "Copy Link"}
              </button>
            </div>
          </div>
        )}

        {/* ── Tab: Image ── */}
        {tab === "image" && (
          <div className="share-modal__body share-modal__body--image" role="tabpanel" aria-labelledby="tab-image">
            {!selected ? (
              <>
                {/* Recently used */}
                {recent.length > 0 && (
                  <div className="img-picker__section">
                    <p className="img-picker__label">Recently used</p>
                    <div className="img-picker__row">
                      {recent.map((r) => (
                        <LazyImageCard
                          key={r.url}
                          entry={r}
                          selected={false}
                          onClick={() => handleSelectImage(r)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* All images */}
                <div className="img-picker__section">
                  {recent.length > 0 && <p className="img-picker__label">All images</p>}
                  {fetchError ? (
                    <p className="img-picker__error">Could not load images. Please check your connection.</p>
                  ) : images.length === 0 ? (
                    <div className="img-picker__grid">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="img-picker__skeleton" style={{ borderRadius: 8, aspectRatio: "1" }} />
                      ))}
                    </div>
                  ) : (
                    <div className="img-picker__grid">
                      {images.map((entry) => (
                        <LazyImageCard
                          key={entry.url}
                          entry={entry}
                          selected={false}
                          onClick={() => handleSelectImage(entry)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Preview + action */}
                <button
                  className="share-btn share-btn--secondary"
                  onClick={() => setSelected(null)}
                  style={{ alignSelf: "flex-start", padding: "6px 12px", fontSize: "0.8rem", marginBottom: "8px" }}
                >
                  ← Back to images
                </button>
                <div className="share-mode-toggle" style={{ display: 'flex', gap: '8px', marginBottom: '16px', justifyContent: 'center' }}>
                  {(['ibani', 'english', 'side-by-side'] as ReadingMode[]).map(m => (
                    <button
                      key={m}
                      onClick={() => handleShareModeChange(m)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '20px',
                        border: shareMode === m ? '1px solid #d4a853' : '1px solid #444',
                        background: shareMode === m ? 'rgba(212,168,83,0.15)' : 'transparent',
                        color: shareMode === m ? '#d4a853' : '#a0a0a0',
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {m === 'ibani' ? 'Ibani Only' : m === 'english' ? 'English Only' : 'Side-by-side'}
                    </button>
                  ))}
                </div>
                <div className="canvas-preview">
                  <div className="canvas-preview__img-wrap">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={selected.url} alt="Preview" className="canvas-preview__bg" crossOrigin="anonymous" />
                    <div className="canvas-preview__overlay">
                      <span className="canvas-preview__ref">{bookName} {chapter}:{verse.verse}</span>
                      {shareMode !== "english" ? (
                        <>
                          <p className="canvas-preview__text">{verse.ibaniText}</p>
                          {shareMode === "side-by-side" && (
                            <p className="canvas-preview__text canvas-preview__text--en">{verse.englishText}</p>
                          )}
                        </>
                      ) : (
                        <p className="canvas-preview__text">{verse.englishText}</p>
                      )}
                      <span className="canvas-preview__brand">bible.ibani.online</span>
                    </div>
                  </div>
                  <button
                    className="share-btn share-btn--primary share-btn--full"
                    onClick={handleShareImage}
                    disabled={composing}
                    id="share-image-btn"
                  >
                    {composing ? "Preparing…" : "🖼️ Share / Download Image"}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
