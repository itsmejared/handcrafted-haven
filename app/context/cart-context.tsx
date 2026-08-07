"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useToast } from "@/app/context/toast-context";

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
const CART_STORAGE_KEY = "handcrafted_haven_cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(CART_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
      } catch (err) {
        console.error("Failed to load cart from localStorage:", err);
      }
    }
    return [];
  });

  const { showToast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (err) {
      console.error("Failed to save cart to localStorage:", err);
    }
  }, [items]);

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
    localStorage.removeItem(CART_STORAGE_KEY);
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
