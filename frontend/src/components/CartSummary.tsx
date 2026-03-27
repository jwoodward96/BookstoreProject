import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function CartSummary() {
  const { cartQuantity, cartSubtotal } = useCart();
  const navigate = useNavigate();

  // Bootstrap features not covered in class used here:
  //  - sticky-top (keeps summary visible while scrolling)
  //  - card + button utility classes
  return (
    <div className="card sticky-top" style={{ top: "1rem" }}>
      <div className="card-body">
        <h5 className="card-title">Cart Summary</h5>
        <p>
          Item count: <strong>{cartQuantity}</strong>
        </p>
        <p>
          Total price: <strong>${cartSubtotal.toFixed(2)}</strong>
        </p>
        <div className="d-grid gap-2">
          <button className="btn btn-outline-primary" onClick={() => navigate("/cart")}>
            View Cart
          </button>
        </div>
      </div>
    </div>
  );
}
