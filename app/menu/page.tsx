"use client";

import { useState } from "react";
import { Container, Section, Eyebrow } from "@/components/ui";
import { products, type Product } from "@/lib/data";
import { cn } from "@/lib/cn";
import AddToCartButton from "@/components/add-to-cart-button";
import AddOnPicker from "@/components/add-on-picker";

const categories = [
  "All",
  "Smoothies",
  "Protein Shakes",
  "Detox Juices",
  "Functional Wellness Drinks",
] as const;
type Category = (typeof categories)[number];

export default function MenuPage() {
  const [active, setActive] = useState<Category>("All");
  const filtered =
    active === "All" ? products : products.filter((p) => p.category === active);

  return (
    <>
      <Section className="pb-0">
        <Container>
          <Eyebrow>The menu</Eyebrow>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            Fresh blends, every weekday.
          </h1>
          <p className="mt-4 text-muted max-w-2xl">
            Made with real fruit, leafy greens, and clean protein. Tap the
            category to filter, then customize with add-ons before you add to
            cart.
          </p>
        </Container>
      </Section>

      <Section className="pt-8 sm:pt-0">
        <Container>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={cn(
                  "focus-ring h-10 rounded-full px-4 text-sm font-medium transition-colors sm:px-5",
                  active === c
                    ? "bg-brand-500 text-white"
                    : "bg-white text-foreground border border-border hover:bg-surface"
                )}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}

function ProductCard({ product: p }: { product: Product }) {
  const [customizing, setCustomizing] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="aspect-[4/3] bg-brand-100/40">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
      </div>
      <div className="p-3 sm:p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="min-w-0 text-sm font-semibold sm:text-base">{p.name}</h3>
          <span className="shrink-0 text-sm font-semibold text-brand-700">
            ${p.price.toFixed(2)}
          </span>
        </div>
        <p className="mt-1 text-xs uppercase tracking-wide text-muted">
          {p.category}
        </p>
        <p className="mt-2 text-xs text-muted line-clamp-2 sm:mt-3 sm:text-sm sm:line-clamp-none">
          {p.description}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {p.tags.map((t) => (
            <span
              key={t}
              className="rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-medium text-brand-700"
            >
              {t}
            </span>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-3 border-t border-border pt-4 text-xs text-muted">
          <span>{p.calories} cal</span>
          <span>{p.protein}g protein</span>
        </div>

        <button
          type="button"
          onClick={() => setCustomizing((v) => !v)}
          aria-expanded={customizing}
          className="focus-ring mt-4 inline-flex w-full items-center justify-between rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-surface"
        >
          <span>
            Customize
            {selected.length > 0 ? ` · ${selected.length} add-on${selected.length === 1 ? "" : "s"}` : ""}
          </span>
          <span aria-hidden className="text-muted">
            {customizing ? "−" : "+"}
          </span>
        </button>

        {customizing && (
          <div className="mt-3">
            <AddOnPicker selected={selected} onToggle={toggle} />
          </div>
        )}

        <AddToCartButton product={p} addOnIds={selected} />
      </div>
    </article>
  );
}
