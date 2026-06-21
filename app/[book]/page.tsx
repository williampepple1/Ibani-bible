import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { getAllBookSlugs, getBookBySlug } from "@/lib/bible-data";
import ChapterGrid from "@/components/ChapterGrid";

interface BookPageProps {
  params: Promise<{ book: string }>;
}

export async function generateStaticParams() {
  return getAllBookSlugs().map((book) => ({ book }));
}

export async function generateMetadata({ params }: BookPageProps): Promise<Metadata> {
  const { book: bookSlug } = await params;
  const book = getBookBySlug(bookSlug);
  if (!book) return {};

  return {
    title: `${book.name} — Ibani Bible`,
    description: `Read the Book of ${book.name} in the Ibani language. ${book.chapterCount} chapters with side-by-side English translation.`,
    alternates: {
      canonical: `https://bible.ibani.online/${book.slug}`,
    },
    openGraph: {
      title: `${book.name} — Ibani Bible`,
      description: `Read the Book of ${book.name} in Ibani with English translation. ${book.chapterCount} chapters.`,
      url: `https://bible.ibani.online/${book.slug}`,
    },
  };
}

export default async function BookPage({ params }: BookPageProps) {
  const { book: bookSlug } = await params;
  const book = getBookBySlug(bookSlug);

  if (!book) {
    notFound();
  }

  return (
    <>
      <div className="page-header">
        <div className="page-header__inner">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/" className="breadcrumb__link">
              Home
            </Link>
            <span className="breadcrumb__sep">›</span>
            <span className="breadcrumb__current">{book.name}</span>
          </nav>

          <h1 className="chapter-heading">{book.name}</h1>
          <p className="book-description">
            {book.chapterCount} chapter{book.chapterCount !== 1 ? "s" : ""} · {book.category}
          </p>
        </div>
      </div>

      <section className="section">
        <h2 className="section__title">Chapters</h2>
        <p className="section__subtitle">Select a chapter to begin reading</p>
        <ChapterGrid bookSlug={book.slug} chapterCount={book.chapterCount} />
      </section>
    </>
  );
}
