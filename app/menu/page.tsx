"use client";

import { useState } from "react";
import { Container, Section, Eyebrow } from "@/components/ui";
import { products } from "@/lib/data";
import { cn } from "@/lib/cn";
import ProductCard from "@/components/product-card";

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
      <Section className="pb-0 lg:pb-0 lg:pt-12">
        <Container>
          <Eyebrow>The menu</Eyebrow>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            Fresh Smoothies and Healthy Drinks,{" "}Available Anytime
          </h1>
          <p className="mt-4 text-muted max-w-2xl">
            Discover convenient, fresh, and functional beverages designed to 
            support energy, wellness, and everyday nutrition.
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
                    ? "bg-primary text-on-primary"
                    : "bg-surface-container-low text-on-surface-variant hover:bg-secondary-container hover:text-on-secondary-container"
                )}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-5">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
