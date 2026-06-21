import { RawVerse, Verse, BookMeta, ChapterData } from "./types";
import bibleDataJson from "../data/ibani_bible.json";

const rawData: RawVerse[] = bibleDataJson as RawVerse[];

/* ─── Book Metadata Mapping ─── */

interface BookInfo {
  name: string;
  category: string;
}

const BOOK_INFO: Record<string, BookInfo> = {
  MAT: { name: "Matthew", category: "Gospels" },
  MRK: { name: "Mark", category: "Gospels" },
  LUK: { name: "Luke", category: "Gospels" },
  JHN: { name: "John", category: "Gospels" },
  ACT: { name: "Acts", category: "History" },
  ROM: { name: "Romans", category: "Pauline Epistles" },
  "1CO": { name: "1 Corinthians", category: "Pauline Epistles" },
  "2CO": { name: "2 Corinthians", category: "Pauline Epistles" },
  GAL: { name: "Galatians", category: "Pauline Epistles" },
  EPH: { name: "Ephesians", category: "Pauline Epistles" },
  PHP: { name: "Philippians", category: "Pauline Epistles" },
  COL: { name: "Colossians", category: "Pauline Epistles" },
  "1TH": { name: "1 Thessalonians", category: "Pauline Epistles" },
  "2TH": { name: "2 Thessalonians", category: "Pauline Epistles" },
  "1TI": { name: "1 Timothy", category: "Pastoral Epistles" },
  "2TI": { name: "2 Timothy", category: "Pastoral Epistles" },
  TIT: { name: "Titus", category: "Pastoral Epistles" },
  PHM: { name: "Philemon", category: "Pastoral Epistles" },
  HEB: { name: "Hebrews", category: "General Epistles" },
  JAS: { name: "James", category: "General Epistles" },
  "1PE": { name: "1 Peter", category: "General Epistles" },
  "2PE": { name: "2 Peter", category: "General Epistles" },
  "1JN": { name: "1 John", category: "General Epistles" },
  "2JN": { name: "2 John", category: "General Epistles" },
  "3JN": { name: "3 John", category: "General Epistles" },
  JUD: { name: "Jude", category: "General Epistles" },
  REV: { name: "Revelation", category: "Prophecy" },
};

/* Canonical order of NT books */
const BOOK_ORDER = [
  "MAT", "MRK", "LUK", "JHN", "ACT",
  "ROM", "1CO", "2CO", "GAL", "EPH", "PHP", "COL",
  "1TH", "2TH", "1TI", "2TI", "TIT", "PHM",
  "HEB", "JAS", "1PE", "2PE", "1JN", "2JN", "3JN", "JUD",
  "REV",
];

function toSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-");
}

/* ─── Precomputed Data ─── */

interface ParsedData {
  books: BookMeta[];
  slugToCode: Record<string, string>;
  chapters: Record<string, Record<number, Verse[]>>;
}

let _cached: ParsedData | null = null;

function parseData(): ParsedData {
  if (_cached) return _cached;

  const chapters: Record<string, Record<number, Verse[]>> = {};

  for (const raw of rawData) {
    if (!chapters[raw.book]) chapters[raw.book] = {};
    const ch = parseInt(raw.chapter, 10);
    if (!chapters[raw.book][ch]) chapters[raw.book][ch] = [];
    chapters[raw.book][ch].push({
      verse: parseInt(raw.verse, 10),
      ibaniText: raw.ibani_text,
      englishText: raw.english_text,
    });
  }

  // Sort verses within each chapter
  for (const book of Object.keys(chapters)) {
    for (const ch of Object.keys(chapters[book])) {
      chapters[book][parseInt(ch, 10)].sort((a, b) => a.verse - b.verse);
    }
  }

  const slugToCode: Record<string, string> = {};
  const books: BookMeta[] = BOOK_ORDER.map((code) => {
    const info = BOOK_INFO[code];
    const slug = toSlug(info.name);
    slugToCode[slug] = code;
    return {
      code,
      slug,
      name: info.name,
      chapterCount: Object.keys(chapters[code] || {}).length,
      category: info.category,
    };
  });

  _cached = { books, slugToCode, chapters };
  return _cached;
}

/* ─── Public API ─── */

export function getAllBooks(): BookMeta[] {
  return parseData().books;
}

export function getBookBySlug(slug: string): BookMeta | undefined {
  const { books, slugToCode } = parseData();
  const code = slugToCode[slug];
  if (!code) return undefined;
  return books.find((b) => b.code === code);
}

export function getChapter(bookSlug: string, chapter: number): ChapterData | undefined {
  const { slugToCode, chapters, books } = parseData();
  const code = slugToCode[bookSlug];
  if (!code) return undefined;

  const bookChapters = chapters[code];
  if (!bookChapters || !bookChapters[chapter]) return undefined;

  const book = books.find((b) => b.code === code)!;
  const bookIndex = books.indexOf(book);

  // Calculate prev/next chapter, crossing book boundaries
  let prevChapter: ChapterData["prevChapter"] = null;
  let nextChapter: ChapterData["nextChapter"] = null;

  if (chapter > 1) {
    prevChapter = { bookSlug: book.slug, chapter: chapter - 1 };
  } else if (bookIndex > 0) {
    const prevBook = books[bookIndex - 1];
    prevChapter = { bookSlug: prevBook.slug, chapter: prevBook.chapterCount };
  }

  if (chapter < book.chapterCount) {
    nextChapter = { bookSlug: book.slug, chapter: chapter + 1 };
  } else if (bookIndex < books.length - 1) {
    const nextBook = books[bookIndex + 1];
    nextChapter = { bookSlug: nextBook.slug, chapter: 1 };
  }

  return {
    book,
    chapter,
    verses: bookChapters[chapter],
    prevChapter,
    nextChapter,
  };
}

export function getAllBookSlugs(): string[] {
  return parseData().books.map((b) => b.slug);
}

export function getAllChapterParams(): { book: string; chapter: string }[] {
  const { books, chapters } = parseData();
  const params: { book: string; chapter: string }[] = [];
  for (const book of books) {
    const bookChapters = chapters[book.code];
    if (bookChapters) {
      for (const ch of Object.keys(bookChapters)) {
        params.push({ book: book.slug, chapter: ch });
      }
    }
  }
  return params;
}

export function getCategories(): { category: string; books: BookMeta[] }[] {
  const books = getAllBooks();
  const catMap = new Map<string, BookMeta[]>();
  for (const book of books) {
    if (!catMap.has(book.category)) catMap.set(book.category, []);
    catMap.get(book.category)!.push(book);
  }
  return Array.from(catMap.entries()).map(([category, books]) => ({
    category,
    books,
  }));
}

export interface SearchResult {
  bookSlug: string;
  bookName: string;
  chapter: number;
  verse: number;
  ibaniText: string;
  englishText: string;
}

export function searchVerses(query: string): SearchResult[] {
  if (!query || query.trim() === "") return [];
  const lowerQuery = query.toLowerCase();
  const { books, chapters } = parseData();
  const results: SearchResult[] = [];
  
  for (const book of books) {
    const bookChapters = chapters[book.code];
    if (!bookChapters) continue;
    
    for (const [chStr, verses] of Object.entries(bookChapters)) {
      const chNum = parseInt(chStr, 10);
      for (const v of verses) {
        if (v.ibaniText.toLowerCase().includes(lowerQuery) || v.englishText.toLowerCase().includes(lowerQuery)) {
          results.push({
            bookSlug: book.slug,
            bookName: book.name,
            chapter: chNum,
            verse: v.verse,
            ibaniText: v.ibaniText,
            englishText: v.englishText,
          });
        }
      }
    }
  }
  return results;
}
