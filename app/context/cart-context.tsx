"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useToast } from "@/app/context/toast-context";
import { useAuth } from "@/app/context/auth-context";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  seller: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Each logged-in user gets their own cart, scoped by user id.
// Logged-out visitors get a shared "guest" cart, separate from every
// real account, so switching users never mixes carts together.
function getStorageKey(userId: string | null | undefined) {
  return userId
    ? `handcrafted_haven_cart_${userId}`
    : "handcrafted_haven_cart_guest";
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const { showToast } = useToast();

  // Whenever the logged-in user changes (login, logout, or switching
  // accounts), reload whichever cart belongs to that user.
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const key = getStorageKey(user?.id);
      const stored = localStorage.getItem(key);
      setItems(stored ? JSON.parse(stored) : []);
    } catch (err) {
      console.error("Failed to load cart from localStorage:", err);
      setItems([]);
    }
  }, [user?.id]);

  // Persist changes to that same user-scoped key.
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const key = getStorageKey(user?.id);
      localStorage.setItem(key, JSON.stringify(items));
    } catch (err) {
      console.error("Failed to save cart to localStorage:", err);
    }
  }, [items, user?.id]);

  function addItem(newItem: Omit<CartItem, "quantity">) {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === newItem.id);
      if (existing) {
        return prev.map((i) =>
          i.id === newItem.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [...prev, { ...newItem, quantity: 1 }];
    });
    showToast(`"${newItem.name}" added to cart!`, "success");
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
    showToast("Item removed from cart", "warning");
  }

  function updateQuantity(id: string, quantity: number) {
    if (quantity < 1) {
      removeItem(id);
      return;
    }
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)));
  }

  function clearCart() {
    setItems([]);
    try {
      localStorage.removeItem(getStorageKey(user?.id));
    } catch (err) {
      console.error("Failed to clear cart from localStorage:", err);
    }
  }

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
