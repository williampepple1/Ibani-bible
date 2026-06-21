"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { BookMeta } from "@/lib/types";

interface BreadcrumbDropdownProps {
  categories: { category: string; books: BookMeta[] }[];
}

export default function BreadcrumbDropdown({ categories }: BreadcrumbDropdownProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="book-dropdown" ref={dropdownRef} style={{ display: "inline-block", position: "relative" }}>
      <button
        className="breadcrumb__link"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-expanded={menuOpen}
        aria-haspopup="true"
        style={{
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
          font: "inherit",
          color: "inherit",
          display: "flex",
          alignItems: "center",
          gap: "4px"
        }}
      >
        Books
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: "12px", height: "12px", transform: menuOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
          <path d="M4 6l4 4 4-4" />
        </svg>
      </button>

      <div className={`book-dropdown__menu ${menuOpen ? "open" : ""}`} role="menu" style={{ left: 0, right: "auto", top: "100%", marginTop: "8px" }}>
        {categories.map(({ category, books }) => (
          <div key={category}>
            <div className="book-dropdown__category">{category}</div>
            {books.map((book) => (
              <Link
                key={book.code}
                href={`/${book.slug}`}
                className="book-dropdown__item"
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
  );
}
