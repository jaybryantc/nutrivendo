"use client";

import { useState } from "react";
import { Container, Section, Eyebrow } from "@/components/ui";
import { products, type Product } from "@/lib/data";
import { cn } from "@/lib/cn";
import AddToCartButton from "@/components/add-to-cart-button";

const categories = ["All", "Smoothies", "Shakes", "Juices"] as const;
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
            category to filter, then find your favorite at the closest machine.
          </p>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={cn(
                  "h-10 rounded-full px-5 text-sm font-medium transition-colors",
                  active === c
                    ? "bg-brand-500 text-white"
                    : "bg-white text-foreground border border-border hover:bg-surface"
                )}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="aspect-[4/3] bg-brand-100/40">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-semibold">{p.name}</h3>
          <span className="text-sm font-semibold text-brand-700">
            ${p.price.toFixed(2)}
          </span>
        </div>
        <p className="mt-1 text-xs uppercase tracking-wide text-muted">
          {p.category}
        </p>
        <p className="mt-3 text-sm text-muted">{p.description}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {p.tags.map((t) => (
            <span
              key={t}
              className="rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-medium text-brand-700"
            >
              {t}
            </span>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-4 border-t border-border pt-4 text-xs text-muted">
          <span>{p.calories} cal</span>
          <span>{p.protein}g protein</span>
        </div>
        <AddToCartButton product={p} />
      </div>
    </article>
  );
}
