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
import { products, getAddOn, sumAddOns } from "@/lib/data";

export type CartLine = {
  productId: string;
  quantity: number;
  addOnIds: string[];
};

type CartContextValue = {
  lines: CartLine[];
  hydrated: boolean;
  count: number;
  subtotal: number;
  addItem: (productId: string, qty?: number, addOnIds?: string[]) => void;
  removeItem: (lineKey: string) => void;
  updateQty: (lineKey: string, qty: number) => void;
  updateAddOns: (lineKey: string, addOnIds: string[]) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "nv-cart";
const MAX_QTY = 20;

/**
 * Stable identity for a cart line: a product plus a specific set of add-ons.
 * Two lines merge only when they share the same product AND the same add-ons.
 */
export function lineKey(productId: string, addOnIds: string[]): string {
  return `${productId}::${[...addOnIds].sort().join(",")}`;
}

/** Keep only known add-on ids, de-duplicated and sorted for a stable key. */
function normalizeAddOnIds(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  for (const v of raw) {
    if (typeof v === "string" && getAddOn(v)) seen.add(v);
  }
  return [...seen].sort();
}

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
                (l): l is { productId: string; quantity: number } =>
                  !!l &&
                  typeof l === "object" &&
                  typeof (l as CartLine).productId === "string" &&
                  typeof (l as CartLine).quantity === "number"
              )
              .map((l) => ({
                productId: l.productId,
                quantity: Math.max(0, Math.min(MAX_QTY, Math.floor(l.quantity))),
                // Legacy carts (no addOnIds) default to an empty set.
                addOnIds: normalizeAddOnIds((l as { addOnIds?: unknown }).addOnIds),
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

  const addItem = useCallback(
    (productId: string, qty: number = 1, addOnIds: string[] = []) => {
      const ids = normalizeAddOnIds(addOnIds);
      const key = lineKey(productId, ids);
      setLines((prev) => {
        const existing = prev.find(
          (l) => lineKey(l.productId, l.addOnIds) === key
        );
        if (existing) {
          return prev.map((l) =>
            lineKey(l.productId, l.addOnIds) === key
              ? { ...l, quantity: Math.min(MAX_QTY, l.quantity + qty) }
              : l
          );
        }
        return [
          ...prev,
          { productId, quantity: Math.min(MAX_QTY, qty), addOnIds: ids },
        ];
      });
    },
    []
  );

  const removeItem = useCallback((key: string) => {
    setLines((prev) =>
      prev.filter((l) => lineKey(l.productId, l.addOnIds) !== key)
    );
  }, []);

  const updateQty = useCallback((key: string, qty: number) => {
    setLines((prev) => {
      const clamped = Math.max(0, Math.min(MAX_QTY, Math.floor(qty)));
      if (clamped === 0)
        return prev.filter((l) => lineKey(l.productId, l.addOnIds) !== key);
      return prev.map((l) =>
        lineKey(l.productId, l.addOnIds) === key
          ? { ...l, quantity: clamped }
          : l
      );
    });
  }, []);

  const updateAddOns = useCallback((key: string, addOnIds: string[]) => {
    const norm = normalizeAddOnIds(addOnIds);
    setLines((prev) => {
      const target = prev.find((l) => lineKey(l.productId, l.addOnIds) === key);
      if (!target) return prev;
      const newKey = lineKey(target.productId, norm);
      if (newKey === key) return prev;
      // If another line already matches the new add-on set, merge into it.
      const other = prev.find(
        (l) => l !== target && lineKey(l.productId, l.addOnIds) === newKey
      );
      if (other) {
        return prev
          .map((l) =>
            l === other
              ? {
                  ...l,
                  quantity: Math.min(MAX_QTY, l.quantity + target.quantity),
                }
              : l
          )
          .filter((l) => l !== target);
      }
      return prev.map((l) =>
        l === target ? { ...l, addOnIds: norm } : l
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
      if (product) s += (product.price + sumAddOns(l.addOnIds)) * l.quantity;
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
    updateAddOns,
    clear,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
