"use client";

import { useState } from "react";
import Link from "next/link";
import { Container, Section, Eyebrow, Card } from "@/components/ui";
import { useCart, lineKey, type CartLine } from "@/components/cart-provider";
import { products, getAddOn, sumAddOns } from "@/lib/data";
import AddOnPicker from "@/components/add-on-picker";

export default function CartPage() {
  const { lines, hydrated, subtotal } = useCart();

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
            {lines.map((line) => (
              <CartLineRow
                key={lineKey(line.productId, line.addOnIds)}
                line={line}
              />
            ))}
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

function CartLineRow({ line }: { line: CartLine }) {
  const { updateQty, removeItem, updateAddOns } = useCart();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<string[]>(line.addOnIds);

  const product = products.find((p) => p.id === line.productId);
  if (!product) return null;

  const key = lineKey(line.productId, line.addOnIds);
  const unitPrice = product.price + sumAddOns(line.addOnIds);
  const lineTotal = unitPrice * line.quantity;
  const draftUnitPrice = product.price + sumAddOns(draft);

  const openEditor = () => {
    setDraft(line.addOnIds);
    setEditing(true);
  };

  const toggleDraft = (id: string) =>
    setDraft((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const save = () => {
    updateAddOns(key, draft);
    setEditing(false);
  };

  return (
    <li className="flex gap-4 rounded-2xl border border-border bg-white p-4 shadow-sm">
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
            {line.addOnIds.length > 0 && (
              <p className="mt-1 text-xs text-muted">
                +{" "}
                {line.addOnIds
                  .map((id) => getAddOn(id)?.name)
                  .filter(Boolean)
                  .join(", ")}
              </p>
            )}
          </div>
          <p className="text-sm font-semibold text-brand-700">
            ${lineTotal.toFixed(2)}
          </p>
        </div>

        {editing && (
          <div className="mt-3">
            <AddOnPicker selected={draft} onToggle={toggleDraft} />
            <div className="mt-3 flex items-center justify-between gap-3">
              <span className="text-xs text-muted">
                ${draftUnitPrice.toFixed(2)} each
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="h-9 rounded-full px-4 text-sm font-medium text-muted hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={save}
                  className="h-9 rounded-full bg-brand-500 px-4 text-sm font-medium text-white hover:bg-brand-600"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="inline-flex items-center rounded-full border border-border">
            <button
              type="button"
              onClick={() => updateQty(key, line.quantity - 1)}
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
              onClick={() => updateQty(key, line.quantity + 1)}
              aria-label="Increase quantity"
              className="h-9 w-9 text-foreground/70 hover:text-foreground"
            >
              +
            </button>
          </div>
          <div className="flex items-center gap-4">
            {!editing && (
              <button
                type="button"
                onClick={openEditor}
                className="text-sm text-brand-700 hover:text-brand-800"
              >
                Customize
              </button>
            )}
            <button
              type="button"
              onClick={() => removeItem(key)}
              className="text-sm text-muted hover:text-foreground"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}
