"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { BookMeta } from "@/lib/types";

interface HeaderProps {
  categories: { category: string; books: BookMeta[] }[];
  currentBookSlug?: string;
}

export default function Header({ categories, currentBookSlug }: HeaderProps) {
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window === "undefined") return "dark";
    const saved = localStorage.getItem("ibani-bible-theme") as "dark" | "light" | null;
    if (saved) return saved;
    if (window.matchMedia("(prefers-color-scheme: light)").matches) return "light";
    return "dark";
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync the data-theme attribute to the DOM whenever theme changes
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("ibani-bible-theme", next);
  }

  return (
    <header className="header" id="main-header">
      <div className="header__inner">
        <Link href="/" className="header__brand">
          <span className="header__logo">Ibani Bible</span>
          <span className="header__subtitle">New Testament</span>
        </Link>

        <nav className="header__nav" aria-label="Main navigation">
          <div className="book-dropdown" ref={dropdownRef}>
            <button
              className="book-dropdown__trigger"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-expanded={menuOpen}
              aria-haspopup="true"
              id="book-selector"
            >
              Books
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M4 6l4 4 4-4" />
              </svg>
            </button>

            <div className={`book-dropdown__menu ${menuOpen ? "open" : ""}`} role="menu">
              {categories.map(({ category, books }) => (
                <div key={category}>
                  <div className="book-dropdown__category">{category}</div>
                  {books.map((book) => (
                    <Link
                      key={book.code}
                      href={`/${book.slug}`}
                      className={`book-dropdown__item ${currentBookSlug === book.slug ? "active" : ""}`}
                      role="menuitem"
                      onClick={() => setMenuOpen(false)}
                    >
                      {book.name}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            id="theme-toggle"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </nav>
      </div>
    </header>
  );
}
