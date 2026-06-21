import Link from "next/link";
import { getBookBySlug } from "@/lib/bible-data";

interface ChapterNavProps {
  prevChapter: { bookSlug: string; chapter: number } | null;
  nextChapter: { bookSlug: string; chapter: number } | null;
}

export default function ChapterNav({ prevChapter, nextChapter }: ChapterNavProps) {
  const prevBook = prevChapter ? getBookBySlug(prevChapter.bookSlug) : null;
  const nextBook = nextChapter ? getBookBySlug(nextChapter.bookSlug) : null;

  return (
    <nav className="chapter-nav" aria-label="Chapter navigation" id="chapter-nav">
      {prevChapter && prevBook ? (
        <Link
          href={`/${prevChapter.bookSlug}/${prevChapter.chapter}`}
          className="chapter-nav__link"
          id="prev-chapter"
        >
          <span className="chapter-nav__label">← Previous</span>
          <span className="chapter-nav__title">
            {prevBook.name} {prevChapter.chapter}
          </span>
        </Link>
      ) : (
        <div />
      )}

      {nextChapter && nextBook ? (
        <Link
          href={`/${nextChapter.bookSlug}/${nextChapter.chapter}`}
          className="chapter-nav__link chapter-nav__link--next"
          id="next-chapter"
        >
          <span className="chapter-nav__label">Next →</span>
          <span className="chapter-nav__title">
            {nextBook.name} {nextChapter.chapter}
          </span>
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
}
