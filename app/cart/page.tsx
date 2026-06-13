"use client";

import { useState } from "react";
import Link from "next/link";
import { Container, Section, Eyebrow, Card } from "@/components/ui";
import { useCart, lineKey, type CartLine } from "@/components/cart-provider";
import { products, getAddOn, sumAddOns } from "@/lib/data";
import CustomizeModal from "@/components/customize-modal";
import Icon from "@/components/icon";

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
          <span className="mb-6 grid h-16 w-16 place-items-center rounded-full bg-secondary-container text-on-secondary-container">
            <Icon name="shopping_cart" size={28} />
          </span>
          <Eyebrow>Cart</Eyebrow>
          <h1 className="mt-4 text-4xl font-bold tracking-tight">
            Your cart is empty.
          </h1>
          <p className="mt-4 text-on-surface-variant max-w-xl">
            Add a smoothie, shake, or juice from the menu to get started.
          </p>
          <Link
            href="/menu"
            className="mt-8 inline-flex h-11 items-center rounded-full bg-primary px-5 text-sm font-medium text-on-primary hover:bg-brand-700"
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
        <h1 className="mt-4 text-4xl font-bold tracking-tight">
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
            <h2 className="font-bold tracking-tight">Order summary</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-on-surface-variant">Subtotal</dt>
                <dd className="text-on-surface-variant">${subtotal.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-on-surface-variant">Pickup fee</dt>
                <dd className="text-on-surface-variant">$0.00</dd>
              </div>
              <div className="flex justify-between border-t border-outline-variant pt-3 font-bold">
                <dt>Total</dt>
                <dd className="text-primary">${subtotal.toFixed(2)}</dd>
              </div>
            </dl>
            <Link
              href="/checkout"
              className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-full bg-primary px-5 text-sm font-medium text-on-primary hover:bg-brand-700"
            >
              Continue to checkout
            </Link>
            <p className="mt-3 text-center text-xs text-on-surface-variant">
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
    <li className="product-card-shadow flex gap-4 rounded-xl bg-surface-container-lowest p-4">
      <div className="h-20 w-20 flex-none overflow-hidden rounded-xl bg-secondary-container">
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
            <p className="text-xs uppercase tracking-wide text-on-surface-variant">
              {product.category}
            </p>
            {line.addOnIds.length > 0 && (
              <p className="mt-1 text-xs text-on-surface-variant">
                +{" "}
                {line.addOnIds
                  .map((id) => getAddOn(id)?.name)
                  .filter(Boolean)
                  .join(", ")}
              </p>
            )}
          </div>
          <p className="text-sm font-semibold text-primary">
            ${lineTotal.toFixed(2)}
          </p>
        </div>

        <CustomizeModal
          product={product}
          open={editing}
          onClose={() => setEditing(false)}
          selected={draft}
          onToggle={toggleDraft}
          onSave={save}
        />

        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="inline-flex items-center gap-2">
            <button
              type="button"
              onClick={() => updateQty(key, line.quantity - 1)}
              aria-label="Decrease quantity"
              className="grid h-9 w-9 place-items-center rounded-full border border-outline-variant text-on-surface-variant hover:bg-surface-container-low"
            >
              <Icon name="remove" size={18} />
            </button>
            <span className="w-8 text-center text-sm font-medium">
              {line.quantity}
            </span>
            <button
              type="button"
              onClick={() => updateQty(key, line.quantity + 1)}
              aria-label="Increase quantity"
              className="grid h-9 w-9 place-items-center rounded-full border border-outline-variant text-on-surface-variant hover:bg-surface-container-low"
            >
              <Icon name="add" size={18} />
            </button>
          </div>
          <div className="flex items-center gap-4">
            {!editing && (
              <button
                type="button"
                onClick={openEditor}
                className="text-sm text-primary hover:text-brand-700"
              >
                Customize
              </button>
            )}
            <button
              type="button"
              onClick={() => removeItem(key)}
              aria-label="Remove item"
              className="grid h-9 w-9 place-items-center rounded-full border border-outline-variant text-on-surface-variant hover:bg-surface-container-low"
            >
              <Icon name="delete" size={18} />
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}
