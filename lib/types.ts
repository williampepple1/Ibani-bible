export interface RawVerse {
  book: string;
  chapter: string;
  verse: string;
  ibani_text: string;
  english_text: string;
}

export interface Verse {
  verse: number;
  ibaniText: string;
  englishText: string;
}

export interface BookMeta {
  code: string;
  slug: string;
  name: string;
  chapterCount: number;
  category: string;
}

export interface ChapterData {
  book: BookMeta;
  chapter: number;
  verses: Verse[];
  prevChapter: { bookSlug: string; chapter: number } | null;
  nextChapter: { bookSlug: string; chapter: number } | null;
}

export type ReadingMode = "ibani" | "english" | "side-by-side";
