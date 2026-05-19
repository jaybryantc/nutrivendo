"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import {
  getActiveSubscription,
  getPlanUsageThisMonth,
  insertOrderTxn,
} from "@/lib/db";
import { getPlan, locations, products } from "@/lib/data";
import { validateCard } from "@/lib/payments";

export type CheckoutFormState = { error?: string };

const PICKUP_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function generatePickupCode(): string {
  let out = "";
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  for (const b of bytes) out += PICKUP_ALPHABET[b % PICKUP_ALPHABET.length];
  return out;
}

function toCents(dollars: number): number {
  return Math.round(dollars * 100);
}

type CartLine = { productId: string; quantity: number };

function parseCart(raw: FormDataEntryValue | null): CartLine[] {
  if (typeof raw !== "string" || !raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const lines: CartLine[] = [];
    for (const entry of parsed) {
      if (
        entry &&
        typeof entry === "object" &&
        "productId" in entry &&
        "quantity" in entry &&
        typeof (entry as Record<string, unknown>).productId === "string" &&
        typeof (entry as Record<string, unknown>).quantity === "number"
      ) {
        const q = Math.max(
          0,
          Math.min(20, Math.floor((entry as { quantity: number }).quantity))
        );
        if (q > 0) {
          lines.push({
            productId: (entry as { productId: string }).productId,
            quantity: q,
          });
        }
      }
    }
    return lines;
  } catch {
    return [];
  }
}

export async function placeOrderAction(
  _prev: CheckoutFormState,
  formData: FormData
): Promise<CheckoutFormState> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?next=/checkout");
  }

  const locationId = String(formData.get("locationId") ?? "");
  const cartLines = parseCart(formData.get("cart"));
  const paymentMethodRaw = String(formData.get("paymentMethod") ?? "");
  const paymentMethod: "plan" | "card" =
    paymentMethodRaw === "plan" ? "plan" : "card";

  const location = locations.find((l) => l.id === locationId);
  if (!location) {
    return { error: "Please choose a pickup location." };
  }
  if (cartLines.length === 0) {
    return { error: "Your cart is empty." };
  }

  const items = cartLines
    .map((line) => {
      const product = products.find((p) => p.id === line.productId);
      if (!product) return null;
      return {
        product_id: product.id,
        product_name: product.name,
        unit_price_cents: toCents(product.price),
        quantity: line.quantity,
      };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  if (items.length === 0) {
    return { error: "We couldn't price the items in your cart." };
  }

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotalCents = items.reduce(
    (sum, i) => sum + i.unit_price_cents * i.quantity,
    0
  );

  let paid_with: "plan" | "card";
  let card_last4: string | null = null;
  let subscription_id: string | null = null;

  if (paymentMethod === "plan") {
    const sub = getActiveSubscription(user.id);
    const planMeta = sub ? getPlan(sub.plan_id) : null;
    if (!sub || !planMeta || sub.status !== "active") {
      return {
        error: "You don't have an active plan. Please pay by card.",
      };
    }
    const used = getPlanUsageThisMonth(user.id);
    const remaining = planMeta.monthlyQuota - used;
    if (cartCount > remaining) {
      return {
        error:
          remaining > 0
            ? `Your ${planMeta.name} plan only has ${remaining} drink${remaining === 1 ? "" : "s"} left this month. Please pay by card.`
            : `Your ${planMeta.name} plan has no drinks left this month. Please pay by card.`,
      };
    }
    paid_with = "plan";
    subscription_id = sub.id;
  } else {
    const v = validateCard(formData);
    if (!v.ok) return { error: v.error };
    paid_with = "card";
    card_last4 = v.last4;
  }

  const orderId = crypto.randomUUID();
  insertOrderTxn(
    {
      id: orderId,
      user_id: user.id,
      location_id: location.id,
      pickup_code: generatePickupCode(),
      subtotal_cents: subtotalCents,
      status: "placed",
      created_at: new Date().toISOString(),
      paid_with,
      card_last4,
      subscription_id,
    },
    items
  );

  revalidatePath("/orders");
  revalidatePath("/account");
  redirect(`/orders/${orderId}?placed=1`);
}
