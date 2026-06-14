"use client";

import { useActionState, useMemo, useState } from "react";
import { Card, Input, Label } from "@/components/ui";
import { useCart, lineKey, type CartLine } from "@/components/cart-provider";
import {
  locations,
  products,
  isUnlimited,
  getAddOn,
  sumAddOns,
} from "@/lib/data";
import CustomizeModal from "@/components/customize-modal";
import { placeOrderAction, type CheckoutFormState } from "@/lib/actions/orders";

type PlanContext = {
  id: string;
  name: string;
  monthlyQuota: number;
  used: number;
  remaining: number;
} | null;

export default function CheckoutForm({
  plan,
  welcomeDiscount,
}: {
  plan: PlanContext;
  welcomeDiscount: boolean;
}) {
  const { lines, hydrated, subtotal, clear } = useCart();
  const [state, formAction, pending] = useActionState<CheckoutFormState, FormData>(
    placeOrderAction,
    {}
  );
  const [locationId, setLocationId] = useState<string>(locations[0]?.id ?? "");

  const cartCount = useMemo(
    () => lines.reduce((sum, l) => sum + l.quantity, 0),
    [lines]
  );

  // Add-ons aren't covered by a plan — an order with any add-on is card-only.
  const hasAddOns = useMemo(
    () => lines.some((l) => l.addOnIds.length > 0),
    [lines]
  );

  const planCanCover =
    !!plan && plan.remaining >= cartCount && cartCount > 0 && !hasAddOns;
  const [paymentMethod, setPaymentMethod] = useState<"plan" | "card">(
    planCanCover ? "plan" : "card"
  );

  if (!hydrated) {
    return <p className="text-on-surface-variant">Loading…</p>;
  }

  if (lines.length === 0) {
    return (
      <Card>
        <p className="font-semibold">Your cart is empty.</p>
        <p className="mt-2 text-sm text-on-surface-variant">
          Add a drink from the menu before checking out.
        </p>
      </Card>
    );
  }

  const cartSnapshot = JSON.stringify(lines);
  const effectiveMethod = planCanCover ? paymentMethod : "card";
  // The one-time welcome discount is 20% off the single priciest drink (one
  // unit), and only applies to card-paid orders.
  const maxUnit = Math.max(
    0,
    ...lines.map((l) => {
      const p = products.find((p) => p.id === l.productId);
      return p ? p.price + sumAddOns(l.addOnIds) : 0;
    })
  );
  const discount =
    welcomeDiscount && effectiveMethod === "card" ? maxUnit * 0.2 : 0;
  const net = subtotal - discount;
  const tax = net * 0.13;
  const total = net + tax;
  const submitLabel =
    effectiveMethod === "plan"
      ? `Pay with ${plan?.name} plan`
      : `Pay $${total.toFixed(2)}`;

  return (
    <form
      action={(fd) => {
        clear();
        formAction(fd);
      }}
      className="grid gap-10 lg:grid-cols-[1.4fr_1fr]"
    >
      <input type="hidden" name="cart" value={cartSnapshot} />
      <input type="hidden" name="paymentMethod" value={effectiveMethod} />

      <div className="space-y-10">
        {/* Payment method */}
        <section>
          <h2 className="text-lg font-semibold">Payment method</h2>
          <p className="mt-1 text-sm text-on-surface-variant">
            {plan
              ? hasAddOns
                ? "Add-ons aren't covered by your plan — please pay by card."
                : planCanCover
                  ? `Your ${plan.name} plan has ${plan.remaining} drink${plan.remaining === 1 ? "" : "s"} left this month.`
                  : plan.remaining > 0
                    ? `Your cart exceeds your remaining ${plan.remaining} drink${plan.remaining === 1 ? "" : "s"} on ${plan.name} — please pay by card.`
                    : `Your ${plan.name} plan has no drinks left this month — please pay by card.`
              : "No active plan, so card it is."}
          </p>

          <div className="mt-5 space-y-3">
            {planCanCover && plan && (
              <PaymentOption
                checked={paymentMethod === "plan"}
                onSelect={() => setPaymentMethod("plan")}
                title={`${plan.name} plan`}
                subtitle={
                  isUnlimited(plan.monthlyQuota)
                    ? `${plan.used} used this month · Unlimited`
                    : `${plan.remaining} of ${plan.monthlyQuota} drinks left this month`
                }
                badge="Included in plan"
                icon={
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5 text-primary"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 12l5 5L20 7"
                    />
                  </svg>
                }
              />
            )}
            <PaymentOption
              checked={effectiveMethod === "card"}
              onSelect={() => setPaymentMethod("card")}
              title="Credit or debit card"
              subtitle="Pay this order with a card."
              icon={
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5 text-primary"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="6" width="18" height="12" rx="2" />
                  <path d="M3 10h18" />
                </svg>
              }
              disabledForce={!planCanCover}
            />
          </div>

          {effectiveMethod === "card" && (
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label htmlFor="cardName">Name on card</Label>
                <Input
                  id="cardName"
                  name="cardName"
                  placeholder="Jane Sipper"
                  autoComplete="cc-name"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="cardNumber">Card number</Label>
                <Input
                  id="cardNumber"
                  name="cardNumber"
                  inputMode="numeric"
                  placeholder="4242 4242 4242 4242"
                  autoComplete="cc-number"
                  required
                  onInput={(e) => {
                    const v = e.currentTarget.value
                      .replace(/\D/g, "")
                      .slice(0, 19);
                    e.currentTarget.value =
                      v.match(/.{1,4}/g)?.join(" ") ?? v;
                  }}
                />
              </div>
              <div>
                <Label htmlFor="cardExp">Expiry (MM/YY)</Label>
                <Input
                  id="cardExp"
                  name="cardExp"
                  placeholder="12/30"
                  autoComplete="cc-exp"
                  required
                  onInput={(e) => {
                    const digits = e.currentTarget.value
                      .replace(/\D/g, "")
                      .slice(0, 4);
                    e.currentTarget.value =
                      digits.length > 2
                        ? `${digits.slice(0, 2)}/${digits.slice(2)}`
                        : digits;
                  }}
                />
              </div>
              <div>
                <Label htmlFor="cardCvc">CVC</Label>
                <Input
                  id="cardCvc"
                  name="cardCvc"
                  inputMode="numeric"
                  placeholder="123"
                  autoComplete="cc-csc"
                  required
                  onInput={(e) => {
                    e.currentTarget.value = e.currentTarget.value
                      .replace(/\D/g, "")
                      .slice(0, 4);
                  }}
                />
              </div>
              <p className="sm:col-span-2 text-xs text-on-surface-variant">
                Demo only — no real charge. Any 13-19 digit number works.
              </p>
            </div>
          )}
        </section>

        {/* Pickup location */}
        <section>
          <h2 className="text-lg font-semibold">Pickup location</h2>
          <p className="mt-1 text-sm text-on-surface-variant">
            Choose where you'd like to grab your order.
          </p>
          <div className="mt-5 space-y-3">
            {locations.map((loc) => (
              <label
                key={loc.id}
                className={
                  "block cursor-pointer rounded-2xl border bg-white p-5 transition-colors " +
                  (locationId === loc.id
                    ? "border-primary ring-2 ring-primary/30"
                    : "border-outline-variant hover:border-primary/40")
                }
              >
                <input
                  type="radio"
                  name="locationId"
                  value={loc.id}
                  checked={locationId === loc.id}
                  onChange={() => setLocationId(loc.id)}
                  className="sr-only"
                />
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-primary">
                      {loc.type}
                    </p>
                    <p className="mt-1 font-semibold">{loc.name}</p>
                    <p className="text-sm text-on-surface-variant">
                      {loc.address}, {loc.city}
                    </p>
                    <p className="mt-2 text-xs text-on-surface-variant">{loc.hours}</p>
                  </div>
                  <span
                    aria-hidden
                    className={
                      "mt-1 grid h-5 w-5 flex-none place-items-center rounded-full border " +
                      (locationId === loc.id
                        ? "border-primary bg-primary"
                        : "border-outline-variant bg-white")
                    }
                  >
                    {locationId === loc.id && (
                      <span className="h-2 w-2 rounded-full bg-white" />
                    )}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </section>
      </div>

      <Card className="h-fit lg:sticky lg:top-20">
        <h2 className="font-semibold">Order summary</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {lines.map((line) => (
            <SummaryLine
              key={lineKey(line.productId, line.addOnIds)}
              line={line}
            />
          ))}
        </ul>
        <dl className="mt-5 space-y-2 border-t border-outline-variant pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-on-surface-variant">Subtotal</dt>
            <dd>${subtotal.toFixed(2)}</dd>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-primary">
              <dt>First-order discount (20% off one drink)</dt>
              <dd>−${discount.toFixed(2)}</dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt className="text-on-surface-variant">Tax (13%)</dt>
            <dd>${tax.toFixed(2)}</dd>
          </div>
          {effectiveMethod === "plan" && (
            <div className="flex justify-between text-primary">
              <dt>Covered by plan</dt>
              <dd>−${total.toFixed(2)}</dd>
            </div>
          )}
          <div className="flex justify-between border-t border-outline-variant pt-3 font-semibold">
            <dt>Due now</dt>
            <dd>
              {effectiveMethod === "plan"
                ? "$0.00"
                : `$${total.toFixed(2)}`}
            </dd>
          </div>
        </dl>

        {state.error && (
          <div
            role="alert"
            className="mt-4 rounded-xl bg-error-container px-4 py-3 text-sm text-on-error-container"
          >
            {state.error}
          </div>
        )}

        <button
          type="submit"
          disabled={pending}
          className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-primary px-5 text-sm font-medium text-on-primary hover:bg-brand-700 disabled:opacity-50"
        >
          {pending ? "Placing order…" : submitLabel}
        </button>
        <p className="mt-3 text-center text-xs text-on-surface-variant">
          Demo — no real payment is collected.
        </p>
      </Card>
    </form>
  );
}

function SummaryLine({ line }: { line: CartLine }) {
  const { updateAddOns } = useCart();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<string[]>(line.addOnIds);

  const product = products.find((p) => p.id === line.productId);
  if (!product) return null;

  const key = lineKey(line.productId, line.addOnIds);
  const unitPrice = product.price + sumAddOns(line.addOnIds);
  const addOnNames = line.addOnIds
    .map((id) => getAddOn(id)?.name)
    .filter(Boolean)
    .join(", ");

  const openEditor = () => {
    setDraft(line.addOnIds);
    setOpen(true);
  };

  const toggleDraft = (id: string) =>
    setDraft((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const save = () => {
    updateAddOns(key, draft);
    setOpen(false);
  };

  return (
    <li className="flex items-start justify-between gap-3">
      <span className="min-w-0">
        <span className="truncate">
          {product.name}{" "}
          <span className="text-on-surface-variant">× {line.quantity}</span>
        </span>
        {addOnNames && (
          <span className="block text-xs text-on-surface-variant">
            + {addOnNames}
          </span>
        )}
        <button
          type="button"
          onClick={openEditor}
          className="mt-1 block text-xs font-medium text-primary hover:text-brand-700"
        >
          Customize
        </button>
      </span>
      <span className="font-medium">
        ${(unitPrice * line.quantity).toFixed(2)}
      </span>

      <CustomizeModal
        product={product}
        open={open}
        onClose={() => setOpen(false)}
        selected={draft}
        onToggle={toggleDraft}
        onSave={save}
      />
    </li>
  );
}

function PaymentOption({
  checked,
  onSelect,
  title,
  subtitle,
  badge,
  icon,
  disabledForce,
}: {
  checked: boolean;
  onSelect: () => void;
  title: string;
  subtitle: string;
  badge?: string;
  icon: React.ReactNode;
  disabledForce?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => !disabledForce && onSelect()}
      className={
        "block w-full text-left rounded-2xl border bg-white p-4 transition-colors " +
        (checked
          ? "border-primary ring-2 ring-primary/30"
          : "border-outline-variant hover:border-primary/40")
      }
    >
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 flex-none place-items-center rounded-xl bg-secondary-container">
          {icon}
        </span>
        <div className="flex-1">
          <div className="flex items-center justify-between gap-3">
            <p className="font-semibold">{title}</p>
            {badge && (
              <span className="rounded-full bg-secondary-container px-2 py-0.5 text-[11px] font-medium text-primary">
                {badge}
              </span>
            )}
          </div>
          <p className="mt-0.5 text-sm text-on-surface-variant">{subtitle}</p>
        </div>
        <span
          aria-hidden
          className={
            "mt-1 grid h-5 w-5 flex-none place-items-center rounded-full border " +
            (checked
              ? "border-primary bg-primary"
              : "border-outline-variant bg-white")
          }
        >
          {checked && <span className="h-2 w-2 rounded-full bg-white" />}
        </span>
      </div>
    </button>
  );
}
