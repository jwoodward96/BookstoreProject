import type { Book } from "../types/book";

// Props required by the BookCard component.
type BookCardProps = {
  book: Book;
  onAddToCart: (book: Book) => void;
  onDonate: (book: Book) => void;
};

// Displays a single book as a Bootstrap card.
// Shows the title, category, author, publisher, price, and action buttons.
export default function BookCard({ book, onAddToCart, onDonate }: BookCardProps) {
  return (
    <div className="col">
      {/* Bootstrap card with full height and a subtle drop shadow */}
      <div className="card h-100 shadow-sm">
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{book.title}</h5>
          <h6 className="card-subtitle mb-2 text-muted">{book.category}</h6>
          <p className="card-text">{book.author} · {book.publisher}</p>
          <p className="mb-2">
            {/* Badge displays the price formatted to two decimal places */}
            <span className="badge bg-info text-dark">${book.price.toFixed(2)}</span>
          </p>
          {/* Buttons are pushed to the bottom of the card with mt-auto */}
          <div className="mt-auto d-grid gap-2">
            <button className="btn btn-primary" onClick={() => onAddToCart(book)}>
              Add to Cart
            </button>
            <button className="btn btn-outline-secondary" onClick={() => onDonate(book)}>
              Donate (Cart page)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
