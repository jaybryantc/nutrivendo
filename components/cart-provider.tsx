"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { products } from "@/lib/data";

export type CartLine = { productId: string; quantity: number };

type CartContextValue = {
  lines: CartLine[];
  hydrated: boolean;
  count: number;
  subtotal: number;
  addItem: (productId: string, qty?: number) => void;
  removeItem: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "nv-cart";
const MAX_QTY = 20;

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setLines(
            parsed
              .filter(
                (l): l is CartLine =>
                  !!l &&
                  typeof l === "object" &&
                  typeof (l as CartLine).productId === "string" &&
                  typeof (l as CartLine).quantity === "number"
              )
              .map((l) => ({
                productId: l.productId,
                quantity: Math.max(0, Math.min(MAX_QTY, Math.floor(l.quantity))),
              }))
              .filter((l) => l.quantity > 0)
          );
        }
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* ignore */
    }
  }, [lines, hydrated]);

  const addItem = useCallback((productId: string, qty: number = 1) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.productId === productId);
      if (existing) {
        return prev.map((l) =>
          l.productId === productId
            ? { ...l, quantity: Math.min(MAX_QTY, l.quantity + qty) }
            : l
        );
      }
      return [...prev, { productId, quantity: Math.min(MAX_QTY, qty) }];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setLines((prev) => prev.filter((l) => l.productId !== productId));
  }, []);

  const updateQty = useCallback((productId: string, qty: number) => {
    setLines((prev) => {
      const clamped = Math.max(0, Math.min(MAX_QTY, Math.floor(qty)));
      if (clamped === 0) return prev.filter((l) => l.productId !== productId);
      return prev.map((l) =>
        l.productId === productId ? { ...l, quantity: clamped } : l
      );
    });
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const { count, subtotal } = useMemo(() => {
    let c = 0;
    let s = 0;
    for (const l of lines) {
      c += l.quantity;
      const product = products.find((p) => p.id === l.productId);
      if (product) s += product.price * l.quantity;
    }
    return { count: c, subtotal: s };
  }, [lines]);

  const value: CartContextValue = {
    lines,
    hydrated,
    count,
    subtotal,
    addItem,
    removeItem,
    updateQty,
    clear,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
