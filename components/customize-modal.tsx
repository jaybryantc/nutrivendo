"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Icon from "./icon";
import AddOnPicker from "./add-on-picker";
import AddToCartButton from "./add-to-cart-button";
import { sumAddOns, type Product } from "@/lib/data";

/**
 * Modal for customizing a menu item with add-ons. Rendered through a portal to
 * document.body so it isn't clipped by the product card's overflow-hidden.
 *
 * Two modes:
 * - Add (default): the footer adds a new line to the cart.
 * - Edit: pass `onSave`, and the footer becomes a "Save changes" button that
 *   the caller wires to `updateAddOns` for an existing cart line.
 */
export default function CustomizeModal({
  product,
  open,
  onClose,
  selected,
  onToggle,
  onSave,
}: {
  product: Product;
  open: boolean;
  onClose: () => void;
  selected: string[];
  onToggle: (id: string) => void;
  onSave?: () => void;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onEsc);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onEsc);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center sm:p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Customize ${product.name}`}
        className="product-card-shadow flex max-h-[85vh] w-full flex-col rounded-t-2xl bg-surface-container-lowest sm:max-w-md sm:rounded-2xl"
      >
        <div className="flex items-start justify-between gap-3 border-b border-outline-variant p-5">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold">{product.name}</h2>
            <p className="mt-0.5 text-sm text-on-surface-variant">
              Base ${product.price.toFixed(2)} · customize your add-ons
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="focus-ring -mr-1 -mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full text-on-surface-variant hover:bg-surface-container-low"
          >
            <Icon name="close" size={22} />
          </button>
        </div>

        <div className="overflow-y-auto p-5">
          <AddOnPicker selected={selected} onToggle={onToggle} />
        </div>

        <div className="border-t border-outline-variant p-5 pt-4">
          {selected.length > 0 && (
            <p className="mb-1 text-xs text-on-surface-variant">
              {selected.length} add-on{selected.length === 1 ? "" : "s"} · +$
              {sumAddOns(selected).toFixed(2)}
            </p>
          )}
          {onSave ? (
            <button
              type="button"
              onClick={onSave}
              className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-full bg-primary px-4 text-sm font-medium text-on-primary transition-colors hover:bg-brand-700"
            >
              Save changes · ${(product.price + sumAddOns(selected)).toFixed(2)}
            </button>
          ) : (
            <AddToCartButton
              product={product}
              addOnIds={selected}
              onAdded={onClose}
            />
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
