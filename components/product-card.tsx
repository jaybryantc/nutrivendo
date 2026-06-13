"use client";

import { useState } from "react";
import { sumAddOns, type Product } from "@/lib/data";
import CustomizeModal from "@/components/customize-modal";

export default function ProductCard({ product: p }: { product: Product }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  return (
    <article className="product-card-shadow group flex h-full flex-col overflow-hidden rounded-xl bg-surface-container-lowest">
      <div className="aspect-[4/3] overflow-hidden bg-leaf-tray">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={p.image}
          alt={p.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-3 sm:p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="min-w-0 text-sm font-semibold sm:text-base sm:line-clamp-2 sm:min-h-[3rem]">{p.name}</h3>
          <span className="shrink-0 text-base font-bold text-primary">
            ${p.price.toFixed(2)}
          </span>
        </div>
        <p className="mt-1 text-xs uppercase tracking-wide text-on-surface-variant">
          {p.category}
        </p>
        <p className="mt-2 text-xs text-on-surface-variant line-clamp-2 sm:mt-3 sm:text-sm sm:line-clamp-2 sm:min-h-[2.5rem]">
          {p.description}
        </p>
        <div className="mt-3 mb-4 flex flex-wrap gap-1.5">
          {p.tags.map((t) => (
            <span
              key={t}
              className="rounded-full bg-secondary-container px-2.5 py-1 text-[11px] font-medium text-on-secondary-container"
            >
              {t}
            </span>
          ))}
        </div>
        <div className="mt-auto flex items-center gap-3 border-t border-outline-variant pt-4 text-xs text-on-surface-variant">
          <span>{p.calories} cal</span>
          <span>{p.protein}g protein</span>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="focus-ring mt-4 inline-flex h-11 w-full items-center justify-center rounded-full bg-primary px-4 text-sm font-medium text-on-primary transition-colors hover:bg-brand-700"
        >
          Add to cart · ${(p.price + sumAddOns(selected)).toFixed(2)}
        </button>
      </div>

      <CustomizeModal
        product={p}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        selected={selected}
        onToggle={toggle}
      />
    </article>
  );
}
