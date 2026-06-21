import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getCategories } from "@/lib/bible-data";

export const metadata: Metadata = {
  metadataBase: new URL("https://bible.ibani.online"),
  title: {
    default: "Ibani Bible — New Testament in the Ibani Language",
    template: "%s | Ibani Bible",
  },
  description:
    "Read the New Testament Bible in the Ibani language with side-by-side English translations. All 27 books, 260 chapters — free and accessible online.",
  keywords: [
    "Ibani Bible",
    "Ibani language",
    "New Testament",
    "Bible translation",
    "Ibani New Testament",
    "Nigerian Bible",
    "African language Bible",
  ],
  openGraph: {
    title: "Ibani Bible — New Testament",
    description:
      "Read the New Testament in the Ibani language with side-by-side English translations.",
    url: "https://bible.ibani.online",
    siteName: "Ibani Bible",
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ibani Bible — New Testament",
    description:
      "Read the New Testament in the Ibani language with side-by-side English translations.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://bible.ibani.online",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = getCategories();

  return (
    <html lang="en" data-theme="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Book",
              name: "Ibani Bible — New Testament",
              description:
                "The New Testament Bible translated into the Ibani language with parallel English text.",
              inLanguage: ["iba", "en"],
              url: "https://bible.ibani.online",
              bookFormat: "https://schema.org/EBook",
              genre: "Religion",
              numberOfPages: 260,
            }),
          }}
        />
      </head>
      <body>
        <Header categories={categories} />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
