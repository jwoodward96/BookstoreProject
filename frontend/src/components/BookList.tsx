import { useEffect, useState } from "react";

function BookList() {
  const [books, setBooks] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    fetch("https://localhost:7022/api/book")
      .then((res) => res.json())
      .then((data) => setBooks(data));
  }, []);

  // ✅ Sort books by title
  const sortedBooks = [...books].sort((a, b) =>
    a.title.localeCompare(b.title)
  );

  // ✅ Pagination logic
  const start = (page - 1) * pageSize;
  const selectedBooks = sortedBooks.slice(start, start + pageSize);

  return (
    <div className="container col-md-6 mt-4">
      <h1 className="text-center mb-4">Book List</h1>

      {/* ✅ Page Size Selector */}
      <div className="d-flex justify-content-center mb-4">
        <label className="me-2 fw-bold">Results per page:</label>
        <select
          className="form-select w-auto"
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setPage(1);
          }}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
      </div>

      {/* ✅ Book Cards */}
      {selectedBooks.map((b) => (
        <div className="card p-4 mb-4 shadow-sm text-center" key={b.bookID}>
          <h3 className="mb-3">{b.title}</h3>
          <p><strong>Author:</strong> {b.author}</p>
          <p><strong>Publisher:</strong> {b.publisher}</p>
          <p><strong>Price:</strong> ${b.price}</p>
        </div>
      ))}

      {/* ✅ Pagination Controls */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <button
          className="btn btn-primary"
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
        >
          ← Previous
        </button>

        <span className="fw-bold">Page {page}</span>

        <button
          className="btn btn-primary"
          onClick={() => setPage(page + 1)}
          disabled={start + pageSize >= books.length}
        >
          Next →
        </button>
      </div>
    </div>
  );
}

export default BookList;