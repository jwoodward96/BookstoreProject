import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

// Displays all items currently in the shopping cart.
// Allows the user to adjust quantities, remove items, and see the subtotal.
export default function CartPage() {
  const { cartItems, removeFromCart, clearCart, updateItemQuantity } = useCart();
  const navigate = useNavigate();

  // Calculate the cart subtotal by summing (price × quantity) for each item.
  const subTotal = useMemo(
    () => cartItems.reduce((total, item) => total + item.book.price * item.quantity, 0),
    [cartItems]
  );

  // Show an empty-cart message with a link back to the book list.
  if (!cartItems.length) {
    return (
      <div className="container mt-5">
        <div className="alert alert-info" role="alert">
          Your cart is empty. <button className="btn btn-link" onClick={() => navigate("/")}>Continue shopping</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Shopping Cart</h1>
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead>
            <tr>
              <th>Title</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr key={item.book.bookID}>
                <td>{item.book.title}</td>
                <td>
                  <div className="input-group input-group-sm" style={{ maxWidth: "130px" }}>
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => updateItemQuantity(item.book.bookID, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span className="form-control text-center">{item.quantity}</span>
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => updateItemQuantity(item.book.bookID, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </td>
                <td>${item.book.price.toFixed(2)}</td>
                <td>${(item.book.price * item.quantity).toFixed(2)}</td>
                <td>
                  <button className="btn btn-outline-danger btn-sm" onClick={() => removeFromCart(item.book.bookID)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-between align-items-center mt-4">
        <button className="btn btn-secondary" onClick={() => navigate("/")}>Continue Shopping</button>
        <div className="d-flex align-items-center gap-3">
          <strong className="fs-5">Subtotal:</strong>
          <span className="fs-4">${subTotal.toFixed(2)}</span>
        </div>
        <button className="btn btn-success" onClick={() => alert("Checkout flow not yet implemented")}>Checkout</button>
      </div>

      <div className="mt-3">
        <button className="btn btn-outline-danger" onClick={clearCart}>Clear Cart</button>
      </div>
    </div>
  );
}
