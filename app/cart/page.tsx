"use client";

import Link from "next/link";
import { Container, Section, Eyebrow, Card } from "@/components/ui";
import { useCart } from "@/components/cart-provider";
import { products } from "@/lib/data";

export default function CartPage() {
  const { lines, hydrated, subtotal, updateQty, removeItem } = useCart();

  if (!hydrated) {
    return (
      <Section>
        <Container>
          <Eyebrow>Cart</Eyebrow>
          <p className="mt-4 text-muted">Loading your cart…</p>
        </Container>
      </Section>
    );
  }

  if (lines.length === 0) {
    return (
      <Section>
        <Container>
          <Eyebrow>Cart</Eyebrow>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">
            Your cart is empty.
          </h1>
          <p className="mt-4 text-muted max-w-xl">
            Add a smoothie, shake, or juice from the menu to get started.
          </p>
          <Link
            href="/menu"
            className="mt-8 inline-flex h-11 items-center rounded-full bg-brand-500 px-5 text-sm font-medium text-white hover:bg-brand-600"
          >
            Browse the menu
          </Link>
        </Container>
      </Section>
    );
  }

  return (
    <Section>
      <Container>
        <Eyebrow>Cart</Eyebrow>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">
          Review your order
        </h1>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.5fr_1fr]">
          <ul className="space-y-3">
            {lines.map((line) => {
              const product = products.find((p) => p.id === line.productId);
              if (!product) return null;
              const lineTotal = product.price * line.quantity;
              return (
                <li
                  key={line.productId}
                  className="flex gap-4 rounded-2xl border border-border bg-white p-4 shadow-sm"
                >
                  <div className="h-20 w-20 flex-none overflow-hidden rounded-xl bg-brand-100/40">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold">{product.name}</p>
                        <p className="text-xs uppercase tracking-wide text-muted">
                          {product.category}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-brand-700">
                        ${lineTotal.toFixed(2)}
                      </p>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="inline-flex items-center rounded-full border border-border">
                        <button
                          type="button"
                          onClick={() => updateQty(line.productId, line.quantity - 1)}
                          aria-label="Decrease quantity"
                          className="h-9 w-9 text-foreground/70 hover:text-foreground"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-sm font-medium">
                          {line.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQty(line.productId, line.quantity + 1)}
                          aria-label="Increase quantity"
                          className="h-9 w-9 text-foreground/70 hover:text-foreground"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(line.productId)}
                        className="text-sm text-muted hover:text-foreground"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <Card>
            <h2 className="font-semibold">Order summary</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">Subtotal</dt>
                <dd>${subtotal.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Pickup fee</dt>
                <dd>$0.00</dd>
              </div>
              <div className="flex justify-between border-t border-border pt-3 font-semibold">
                <dt>Total</dt>
                <dd>${subtotal.toFixed(2)}</dd>
              </div>
            </dl>
            <Link
              href="/checkout"
              className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-full bg-brand-500 px-5 text-sm font-medium text-white hover:bg-brand-600"
            >
              Continue to checkout
            </Link>
            <p className="mt-3 text-center text-xs text-muted">
              You'll pick a pickup location next.
            </p>
          </Card>
        </div>
      </Container>
    </Section>
  );
}
