"use client";

import { useState } from "react";
import { useCart } from "./cart-provider";
import type { Product } from "@/lib/data";

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <button
      type="button"
      onClick={() => {
        addItem(product.id, 1);
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1200);
      }}
      className={
        "mt-4 inline-flex h-10 w-full items-center justify-center rounded-full px-4 text-sm font-medium transition-colors " +
        (added
          ? "bg-brand-700 text-white"
          : "bg-brand-500 text-white hover:bg-brand-600")
      }
      aria-live="polite"
    >
      {added ? "Added ✓" : `Add to cart · $${product.price.toFixed(2)}`}
    </button>
  );
}
