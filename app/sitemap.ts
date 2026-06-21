import { MetadataRoute } from "next";
import { getAllBooks, getAllChapterParams } from "@/lib/bible-data";

export const dynamic = "force-static";

const BASE_URL = "https://bible.ibani.online";

export default function sitemap(): MetadataRoute.Sitemap {
  const books = getAllBooks();
  const chapterParams = getAllChapterParams();

  const entries: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];

  // Book pages
  for (const book of books) {
    entries.push({
      url: `${BASE_URL}/${book.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  // Chapter pages
  for (const { book, chapter } of chapterParams) {
    entries.push({
      url: `${BASE_URL}/${book}/${chapter}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  return entries;
}
