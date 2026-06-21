import Link from "next/link";

interface ChapterGridProps {
  bookSlug: string;
  chapterCount: number;
}

export default function ChapterGrid({ bookSlug, chapterCount }: ChapterGridProps) {
  const chapters = Array.from({ length: chapterCount }, (_, i) => i + 1);

  return (
    <div className="chapter-grid" id="chapter-grid">
      {chapters.map((ch) => (
        <Link
          key={ch}
          href={`/${bookSlug}/${ch}`}
          className="chapter-cell"
          id={`chapter-${ch}`}
        >
          {ch}
        </Link>
      ))}
    </div>
  );
}
