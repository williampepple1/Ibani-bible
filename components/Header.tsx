"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { BookMeta } from "@/lib/types";
import { useAppStore, FontSize } from "@/lib/store";
import SearchModal from "./SearchModal";

interface HeaderProps {
  categories: { category: string; books: BookMeta[] }[];
  currentBookSlug?: string;
}

export default function Header({ categories, currentBookSlug }: HeaderProps) {
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const [searchOpen, setSearchOpen] = useState(false);
  const { fontSize, setFontSize } = useAppStore();

  useEffect(() => {
    const saved = localStorage.getItem("ibani-bible-theme") as "dark" | "light" | null;
    if (saved) {
      setTimeout(() => setTheme(saved), 0);
    }
  }, []);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync the data-theme attribute to the DOM whenever theme changes
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Sync the data-text-size attribute to the DOM whenever fontSize changes
  useEffect(() => {
    document.documentElement.setAttribute("data-text-size", fontSize);
  }, [fontSize]);

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

  function toggleFontSize() {
    const sizes: FontSize[] = ["small", "normal", "large", "xlarge"];
    const currentIndex = sizes.indexOf(fontSize);
    const nextIndex = (currentIndex + 1) % sizes.length;
    setFontSize(sizes[nextIndex]);
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

          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <button
              className="theme-toggle"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              title="Search Bible"
            >
              🔍
            </button>
            <button
              className="theme-toggle"
              onClick={toggleFontSize}
              aria-label="Toggle text size"
              title="Change Text Size"
              style={{ fontSize: "1rem", fontWeight: "bold" }}
            >
              A<span style={{ fontSize: "0.75rem" }}>A</span>
            </button>
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              id="theme-toggle"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
          </div>
        </nav>
      </div>
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
