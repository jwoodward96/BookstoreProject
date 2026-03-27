import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import CategoryFilter from "../components/CategoryFilter";
import CartSummary from "../components/CartSummary";
import BookCard from "../components/BookCard";
import WelcomeBand from "../components/WelcomeBand";
import type { Book } from "../types/book";

const API_URL = "https://localhost:7022/api/book";
const PAGE_KEY = "bookstorePage";
const CATEGORY_KEY = "bookstoreCategory";

// Bootstrap features not covered in class: sticky-top and progress bar.
// Used attributes:
//  - sticky-top on CartSummary card container (bootstrap class for position sticky)
//  - progress component .progress and .progress-bar for page progress indicator, dynamically set width
//  - responsive grid classes row-cols-1 row-cols-md-2 and col-lg-8 / col-lg-4 for layout

export default function ProjectsPage() {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [books, setBooks] = useState<Book[]>([]);
  const [page, setPage] = useState<number>(() => Number(sessionStorage.getItem(PAGE_KEY) ?? 1));
  const [pageSize, setPageSize] = useState<number>(5);
  const [selectedCategory, setSelectedCategory] = useState<string>(sessionStorage.getItem(CATEGORY_KEY) ?? "All");

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data: Book[]) => setBooks(data))
      .catch((error) => console.error("Book fetch failed", error));
  }, []);

  useEffect(() => {
    sessionStorage.setItem(PAGE_KEY, String(page));
  }, [page]);

  useEffect(() => {
    sessionStorage.setItem(CATEGORY_KEY, selectedCategory);
  }, [selectedCategory]);

  const sortedBooks = useMemo(() => [...books].sort((a, b) => a.title.localeCompare(b.title)), [books]);
  const categoryList = useMemo(
    () => ["All", ...Array.from(new Set(sortedBooks.map((b) => b.category ?? "Uncategorized"))).sort()],
    [sortedBooks]
  );

  const filteredBooks = useMemo(
    () => (selectedCategory === "All" ? sortedBooks : sortedBooks.filter((b) => b.category === selectedCategory)),
    [sortedBooks, selectedCategory]
  );

  const totalPages = Math.max(1, Math.ceil(filteredBooks.length / pageSize));
  const normalizedPage = Math.min(page, totalPages);

  useEffect(() => {
    if (page !== normalizedPage) {
      setPage(normalizedPage);
    }
  }, [normalizedPage, page]);

  const currentBooks = filteredBooks.slice((normalizedPage - 1) * pageSize, normalizedPage * pageSize);

  const handleDonate = (book: Book) => {
    navigate(`/donate/${book.bookID}/${encodeURIComponent(book.title)}`, { state: { book } });
  };

  const progressPercent = filteredBooks.length ? (currentBooks.length / filteredBooks.length) * 100 : 0;

  return (
    <div className="container-fluid mt-4">
      <WelcomeBand />
      <div className="row">
        <div className="col-lg-8">
          <div className="d-flex flex-column flex-sm-row gap-2 mb-3">
            <CategoryFilter categories={categoryList} selectedCategory={selectedCategory} onChange={(value) => {
              setSelectedCategory(value);
              setPage(1);
            }} />

            <div className="me-sm-3">
              <label htmlFor="pageSize" className="form-label fw-bold">
                Results per page:
              </label>
              <select
                id="pageSize"
                className="form-select"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                aria-label="Select how many books to show per page"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>
          </div>

          <div className="row row-cols-1 row-cols-md-2 g-3">
            {currentBooks.map((book) => (
              <BookCard key={book.bookID} book={book} onAddToCart={addToCart} onDonate={handleDonate} />
            ))}
          </div>

          <div className="d-flex justify-content-between align-items-center mt-4">
            <button
              className="btn btn-outline-primary"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={normalizedPage === 1}
            >
              ← Previous
            </button>

            <div className="fw-bold">Page {normalizedPage} of {totalPages}</div>

            <button
              className="btn btn-outline-primary"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={normalizedPage >= totalPages}
            >
              Next →
            </button>
          </div>

          <div className="mt-3">
            <div className="progress" style={{ height: "18px" }}>
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${progressPercent}%` }}
                aria-valuenow={currentBooks.length}
                aria-valuemin={0}
                aria-valuemax={filteredBooks.length}
              >
                {currentBooks.length}/{filteredBooks.length} shown
              </div>
            </div>
          </div>
        </div>

        <aside className="col-lg-4">
          <CartSummary />
        </aside>
      </div>
    </div>
  );
}
