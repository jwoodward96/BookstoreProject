import { useEffect, useState } from "react";

// NOTE: Bootstrap classes used here include: row/col grid layout, card, badge, progress, btn, form-select
// Extra Bootstrap features not covered in class: progress bar (<div className="progress">) and sticky sidebar (position-sticky with utility classes).

type Book = {
  bookID: number;
  title: string;
  author: string;
  publisher: string;
  category: string;
  price: number;
};

type CartItem = {
  book: Book;
  quantity: number;
};

const CART_KEY = "bookstoreCart";
const PAGE_KEY = "bookstorePage";
const CATEGORY_KEY = "bookstoreCategory";

function BookList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState<Record<number, CartItem>>({});
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    const savedPage = Number(sessionStorage.getItem(PAGE_KEY) ?? 1);
    const savedCategory = sessionStorage.getItem(CATEGORY_KEY) ?? "All";
    const cartJson = sessionStorage.getItem(CART_KEY);

    setPage(savedPage > 0 ? savedPage : 1);
    setSelectedCategory(savedCategory);

    if (cartJson) {
      try {
        const parsed = JSON.parse(cartJson);
        setCart(parsed);
      } catch {
        setCart({});
      }
    }

    fetch("https://localhost:7022/api/book")
      .then((res) => res.json())
      .then((data: Book[]) => {
        setBooks(data);
      })
      .catch((error) => {
        console.error("Failed fetching books", error);
      });
  }, []);

  useEffect(() => {
    sessionStorage.setItem(PAGE_KEY, String(page));
  }, [page]);

  useEffect(() => {
    sessionStorage.setItem(CATEGORY_KEY, selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    sessionStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  const sortedBooks = [...books].sort((a, b) => a.title.localeCompare(b.title));

  const categoryList = [
    "All",
    ...Array.from(new Set(books.map((b) => b.category ?? "Uncategorized"))).sort(),
  ];

  const filteredBooks =
    selectedCategory === "All"
      ? sortedBooks
      : sortedBooks.filter((b) => b.category === selectedCategory);

  const totalPages = Math.max(1, Math.ceil(filteredBooks.length / pageSize));
  const normalizedPage = Math.min(page, totalPages);

  if (normalizedPage !== page) {
    setPage(normalizedPage);
  }

  const start = (normalizedPage - 1) * pageSize;
  const selectedBooks = filteredBooks.slice(start, start + pageSize);

  const cartItems = Object.values(cart);
  const cartQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cartItems.reduce(
    (sum, item) => sum + item.book.price * item.quantity,
    0
  );

  const addToCart = (book: Book) => {
    setCart((prev) => {
      const existing = prev[book.bookID];
      const updated = {
        ...prev,
        [book.bookID]: {
          book,
          quantity: existing ? existing.quantity + 1 : 1,
        },
      };
      return updated;
    });
  };

  const updateItemQuantity = (bookId: number, qty: number) => {
    setCart((prev) => {
      if (!prev[bookId]) return prev;
      if (qty <= 0) {
        const clone = { ...prev };
        delete clone[bookId];
        return clone;
      }
      return {
        ...prev,
        [bookId]: { ...prev[bookId], quantity: qty },
      };
    });
  };

  const clearCart = () => setCart({});

  const continueShopping = () => {
    setShowCart(false);
    const savedPage = Number(sessionStorage.getItem(PAGE_KEY) ?? 1);
    setPage(savedPage > 0 ? savedPage : 1);
  };

  return (
    <div className="container-fluid mt-4">
      <h1 className="text-center mb-4">Bookstore</h1>

      <div className="row">
        <div className="col-lg-8">
          <div className="d-flex flex-column flex-sm-row gap-2 mb-3">
            <div className="me-sm-3"> 
              <label htmlFor="category" className="form-label fw-bold">
                Filter by category:
              </label>
              <select
                id="category"
                className="form-select"
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setPage(1);
                }}
              >
                {categoryList.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

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
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>

            <div className="align-self-end">
              <button
                className="btn btn-success"
                onClick={() => setShowCart((prev) => !prev)}
              >
                {showCart ? "Hide " : "Show "}
                Cart ({cartQuantity})
              </button>
            </div>
          </div>

          <div className="row row-cols-1 row-cols-md-2 g-3">
            {selectedBooks.map((b) => (
              <div className="col" key={b.bookID}>
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">{b.title}</h5>
                    <h6 className="card-subtitle mb-2 text-muted">{b.category}</h6>
                    <p className="card-text">{b.author} · {b.publisher}</p>
                    <p className="mb-2">
                      <span className="badge bg-info text-dark">
                        ${b.price.toFixed(2)}
                      </span>
                    </p>
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        addToCart(b);
                        sessionStorage.setItem(PAGE_KEY, String(normalizedPage));
                        sessionStorage.setItem(CATEGORY_KEY, selectedCategory);
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
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

            <div>
              Page {normalizedPage} of {totalPages}
            </div>

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
                style={{ width: `${
                  filteredBooks.length
                    ? (selectedBooks.length / filteredBooks.length) * 100
                    : 0
                }%` }}
                aria-valuenow={selectedBooks.length}
                aria-valuemin={0}
                aria-valuemax={filteredBooks.length}
              >
                {selectedBooks.length}/{filteredBooks.length} shown
              </div>
            </div>
          </div>
        </div>

        <aside className="col-lg-4">
          <div className="card sticky-top" style={{ top: "1rem" }}>
            <div className="card-body">
              <h5 className="card-title">Cart Summary</h5>
              <p>
                Item count: <strong>{cartQuantity}</strong>
              </p>
              <p>
                Total price: <strong>${cartSubtotal.toFixed(2)}</strong>
              </p>
              <p>
                Active filter: <span className="badge bg-secondary">{selectedCategory}</span>
              </p>

              <div className="d-grid gap-2">
                <button className="btn btn-outline-secondary" onClick={continueShopping}>
                  Continue Shopping
                </button>
                <button className="btn btn-outline-danger" onClick={clearCart} disabled={cartQuantity === 0}>
                  Clear Cart
                </button>
              </div>
            </div>
          </div>

          {showCart && (
            <div className="card mt-3">
              <div className="card-body">
                <h6 className="card-title">Cart Details</h6>
                {cartItems.length === 0 && <p>No items in cart.</p>}
                {cartItems.map((item) => (
                  <div key={item.book.bookID} className="border-bottom pb-2 mb-2">
                    <div className="d-flex justify-content-between">
                      <strong>{item.book.title}</strong>
                      <span>${(item.book.price * item.quantity).toFixed(2)}</span>
                    </div>
                    <small>{item.book.category}</small>
                    <div className="input-group input-group-sm mt-2">
                      <button
                        className="btn btn-outline-secondary"
                        onClick={() => updateItemQuantity(item.book.bookID, item.quantity - 1)}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min={1}
                        className="form-control text-center"
                        value={item.quantity}
                        onChange={(e) => updateItemQuantity(item.book.bookID, Number(e.target.value))}
                      />
                      <button
                        className="btn btn-outline-secondary"
                        onClick={() => updateItemQuantity(item.book.bookID, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <div className="mt-1">
                      <small>
                        Unit: ${item.book.price.toFixed(2)} · Subtotal: ${
                          (item.book.price * item.quantity).toFixed(2)
                        }
                      </small>
                    </div>
                  </div>
                ))}
                {cartItems.length > 0 && (
                  <div className="d-flex justify-content-between pt-2 mt-2 border-top">
                    <strong>Total:</strong>
                    <strong>${cartSubtotal.toFixed(2)}</strong>
                  </div>
                )}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

export default BookList;