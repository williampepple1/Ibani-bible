import Link from "next/link";
import { BookMeta } from "@/lib/types";

interface BookCardProps {
  book: BookMeta;
}

export default function BookCard({ book }: BookCardProps) {
  return (
    <Link href={`/${book.slug}`} className="book-card" id={`book-${book.slug}`}>
      <div className="book-card__name">{book.name}</div>
      <div className="book-card__meta">
        <span className="book-card__chapters">
          {book.chapterCount} {book.chapterCount === 1 ? "chapter" : "chapters"}
        </span>
        <svg className="book-card__arrow" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </Link>
  );
}
