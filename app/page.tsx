import BookCard from "@/components/BookCard";
import { getCategories } from "@/lib/bible-data";

export default function HomePage() {
  const categories = getCategories();
  const totalBooks = categories.reduce((sum, c) => sum + c.books.length, 0);
  const totalChapters = categories.reduce(
    (sum, c) => sum + c.books.reduce((s, b) => s + b.chapterCount, 0),
    0
  );

  return (
    <>
      {/* Hero Section */}
      <section className="hero" id="hero">
        <div className="hero__content">
          <div className="hero__badge animate-in">New Testament</div>
          <h1 className="hero__title animate-in animate-in-delay-1">
            The <span className="hero__title-accent">Ibani</span> Bible
          </h1>
          <p className="hero__description animate-in animate-in-delay-2">
            Read the New Testament in the Ibani language with side-by-side
            English translations. Explore all {totalBooks} books, {totalChapters}{" "}
            chapters — free and accessible to everyone.
          </p>
          <div className="hero__stats animate-in animate-in-delay-3">
            <div className="hero__stat">
              <div className="hero__stat-value">{totalBooks}</div>
              <div className="hero__stat-label">Books</div>
            </div>
            <div className="hero__stat">
              <div className="hero__stat-value">{totalChapters}</div>
              <div className="hero__stat-label">Chapters</div>
            </div>
            <div className="hero__stat">
              <div className="hero__stat-value">2</div>
              <div className="hero__stat-label">Languages</div>
            </div>
          </div>
        </div>
      </section>

      {/* Book List by Category */}
      {categories.map(({ category, books }) => (
        <section key={category} className="section" id={`section-${category.toLowerCase().replace(/\s+/g, "-")}`}>
          <h2 className="section__title">{category}</h2>
          <p className="section__subtitle">
            {books.length} book{books.length !== 1 ? "s" : ""}
          </p>
          <div className="book-grid">
            {books.map((book) => (
              <BookCard key={book.code} book={book} />
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
