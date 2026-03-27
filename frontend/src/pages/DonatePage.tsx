import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Book } from "../types/book";
import { useCart } from "../context/CartContext";

export default function DonatePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [book, setBook] = useState<Book | null>(null);
  const [donationAmount, setDonationAmount] = useState(5);

  useEffect(() => {
    if (id) {
      fetch(`https://localhost:7022/api/book/${id}`)
        .then((res) => (res.ok ? res.json() : Promise.reject("Not found")))
        .then((data: Book) => setBook(data))
        .catch((error) => console.error("Cannot load book for donate", error));
    }
  }, [id]);

  if (!book) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning">Loading book details...</div>
      </div>
    );
  }

  const handleDonate = () => {
    const donationBook: Book = {
      ...book,
      price: donationAmount,
      title: `${book.title} (Donation)`,
    };
    addToCart(donationBook, 1);
    navigate("/cart");
  };

  return (
    <div className="container mt-4">
      <h1>Donate for {book.title}</h1>
      <div className="row gy-3 mt-3">
        <div className="col-md-12">
          <p className="lead">Category: {book.category}</p>
          <p>
            {book.author} · {book.publisher}
          </p>
          <p>
            Price suggestion: <strong>${donationAmount.toFixed(2)}</strong>
          </p>
        </div>
      </div>
      <div className="mb-3">
        <label htmlFor="donationAmount" className="form-label">
          Donation Amount (USD)
        </label>
        <input
          id="donationAmount"
          type="number"
          min={1}
          step={1}
          className="form-control"
          value={donationAmount}
          onChange={(e) => setDonationAmount(Number(e.target.value))}
        />
      </div>
      <div className="d-flex gap-2">
        <button className="btn btn-success" onClick={handleDonate}>
          Add Donation to Cart
        </button>
        <button className="btn btn-secondary" onClick={() => navigate("/")}>
          Back to Books
        </button>
      </div>
    </div>
  );
}
