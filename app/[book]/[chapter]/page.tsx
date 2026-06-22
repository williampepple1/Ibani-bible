import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { getAllChapterParams, getChapter, getCategories } from "@/lib/bible-data";
import VerseDisplay from "@/components/VerseDisplay";
import ChapterNav from "@/components/ChapterNav";
import BreadcrumbDropdown from "@/components/BreadcrumbDropdown";
import AudioPlayer from "@/components/AudioPlayer";
import ChapterTracker from "@/components/ChapterTracker";

interface ChapterPageProps {
  params: Promise<{ book: string; chapter: string }>;
}

export async function generateStaticParams() {
  return getAllChapterParams();
}

export async function generateMetadata({ params }: ChapterPageProps): Promise<Metadata> {
  const { book: bookSlug, chapter: chapterStr } = await params;
  const chapterNum = parseInt(chapterStr, 10);
  const data = getChapter(bookSlug, chapterNum);
  if (!data) return {};

  const firstVerse = data.verses[0]?.ibaniText.slice(0, 120) || "";

  return {
    title: `${data.book.name} ${data.chapter}`,
    description: `${data.book.name} Chapter ${data.chapter} in the Ibani language — ${data.verses.length} verses. ${firstVerse}...`,
    alternates: {
      canonical: `https://bible.ibani.online/${data.book.slug}/${data.chapter}`,
    },
    openGraph: {
      title: `${data.book.name} ${data.chapter} — Ibani Bible`,
      description: `Read ${data.book.name} Chapter ${data.chapter} in Ibani with English translation.`,
      url: `https://bible.ibani.online/${data.book.slug}/${data.chapter}`,
    },
  };
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { book: bookSlug, chapter: chapterStr } = await params;
  const chapterNum = parseInt(chapterStr, 10);
  const data = getChapter(bookSlug, chapterNum);
  const categories = getCategories();

  if (!data) {
    notFound();
  }

  return (
    <>
      <ChapterTracker bookSlug={bookSlug} chapter={chapterNum} />
      <div className="page-header">
        <div className="page-header__inner">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <BreadcrumbDropdown categories={categories} />
            <span className="breadcrumb__sep">›</span>
            <Link href={`/${data.book.slug}`} className="breadcrumb__link">
              {data.book.name}
            </Link>
            <span className="breadcrumb__sep">›</span>
            <span className="breadcrumb__current">Chapter {data.chapter}</span>
          </nav>
        </div>
      </div>

      <section className="section">
        <AudioPlayer bookSlug={bookSlug} chapterNum={chapterNum} />

        <VerseDisplay
          verses={data.verses}
          bookName={data.book.name}
          bookSlug={data.book.slug}
          chapter={data.chapter}
        />

        <ChapterNav
          prevChapter={data.prevChapter}
          nextChapter={data.nextChapter}
        />
      </section>
    </>
  );
}
