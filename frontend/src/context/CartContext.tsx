import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Book } from "../types/book";
import type { CartItem } from "../types/cartItem";

// Session storage key used to persist cart data across page refreshes.
const CART_KEY = "bookstoreCart";

// Shape of the value provided by CartContext to all consumers.
export interface CartContextValue {
  cart: Record<number, CartItem>;
  cartItems: CartItem[];
  cartQuantity: number;
  cartSubtotal: number;
  addToCart: (book: Book, quantity?: number) => void;
  removeFromCart: (bookID: number) => void;
  updateItemQuantity: (bookID: number, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

// CartProvider wraps the application and makes cart state available to any child component.
// Cart contents are persisted to sessionStorage so they survive page refreshes.
export function CartProvider({ children }: { children: React.ReactNode }) {
  // Initialize cart from sessionStorage on first render.
  const [cart, setCart] = useState<Record<number, CartItem>>(() => {
    if (typeof window === "undefined") return {};
    try {
      const store = sessionStorage.getItem(CART_KEY);
      if (!store) return {};
      return JSON.parse(store) as Record<number, CartItem>;
    } catch {
      return {};
    }
  });

  // Keep sessionStorage in sync with cart state whenever it changes.
  useEffect(() => {
    sessionStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  // Derived values computed from the cart state.
  const cartItems = useMemo(() => Object.values(cart), [cart]);
  const cartQuantity = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );
  const cartSubtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.book.price * item.quantity, 0),
    [cartItems]
  );

  const addToCart = (book: Book, quantity = 1) => {
    setCart((prev) => {
      const existing = prev[book.bookID];
      const nextQuantity = existing ? existing.quantity + quantity : quantity;
      return {
        ...prev,
        [book.bookID]: { book, quantity: nextQuantity },
      };
    });
  };

  const removeFromCart = (bookID: number) => {
    setCart((prev) => {
      const next = { ...prev };
      delete next[bookID];
      return next;
    });
  };

  const updateItemQuantity = (bookID: number, quantity: number) => {
    setCart((prev) => {
      if (!prev[bookID]) return prev;
      if (quantity <= 0) {
        const next = { ...prev };
        delete next[bookID];
        return next;
      }
      return {
        ...prev,
        [bookID]: { ...prev[bookID], quantity },
      };
    });
  };

  const clearCart = () => setCart({});

  const value: CartContextValue = {
    cart,
    cartItems,
    cartQuantity,
    cartSubtotal,
    addToCart,
    removeFromCart,
    updateItemQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
