import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Container, Section, Eyebrow, Card } from "@/components/ui";
import { getCurrentUser } from "@/lib/auth";
import { getOrderById, getOrderItems } from "@/lib/db";
import { getPlan, locations } from "@/lib/data";
import { qrToSvg } from "@/lib/qr";
import { getActiveSubscription } from "@/lib/db";

export const metadata = { title: "Order detail" };

/** Render the stored add-ons JSON (`[{ name, price }]`) as a comma list. */
function parseAddOnNames(addons: string | null): string {
  if (!addons) return "";
  try {
    const parsed: unknown = JSON.parse(addons);
    if (!Array.isArray(parsed)) return "";
    return parsed
      .map((a) =>
        a && typeof a === "object" && typeof (a as { name?: unknown }).name === "string"
          ? (a as { name: string }).name
          : null
      )
      .filter(Boolean)
      .join(", ");
  } catch {
    return "";
  }
}

export default async function OrderDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ placed?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) {
    const { id } = await params;
    redirect(`/login?next=/orders/${id}`);
  }

  const { id } = await params;
  const { placed } = await searchParams;

  const order = await getOrderById(id);
  if (!order || order.user_id !== user.id) notFound();

  const items = await getOrderItems(order.id);
  const location = locations.find((l) => l.id === order.location_id);
  const date = new Date(order.created_at);
  const qrSvg = await qrToSvg(order.pickup_code);

  let paymentLabel = "Card";
  if (order.paid_with === "plan") {
    // Resolve the plan name from the user's currently active subscription
    // (best-effort — order's subscription_id ties back to a SubscriptionRow
    // but we don't expose its plan_id directly here without an extra query).
    const sub = await getActiveSubscription(user.id);
    const planMeta = sub ? getPlan(sub.plan_id) : null;
    paymentLabel = planMeta ? `${planMeta.name} plan` : "Plan";
  } else if (order.card_last4) {
    paymentLabel = `Card •••• ${order.card_last4}`;
  }

  return (
    <Section>
      <Container>
        <Eyebrow>{placed ? "Order placed" : "Order detail"}</Eyebrow>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">
          {placed ? "You're all set." : "Order summary"}
        </h1>
        {placed && (
          <p className="mt-4 text-muted max-w-xl">
            Show this pickup code at the machine to release your drinks.
          </p>
        )}

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Card className="bg-gradient-to-br from-brand-50 to-white">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-brand-700">
                  Pickup code
                </p>
                <p className="mt-2 text-5xl font-semibold tracking-[0.3em] text-brand-700">
                  {order.pickup_code}
                </p>
                <p className="mt-3 text-sm text-muted max-w-xs">
                  Scan the QR or punch in the code at the machine.
                </p>
              </div>
              <div
                role="img"
                aria-label={`QR code containing pickup code ${order.pickup_code}`}
                className="h-36 w-36 sm:h-40 sm:w-40 flex-none rounded-2xl bg-white p-3 shadow-sm ring-1 ring-border [&>svg]:h-full [&>svg]:w-full"
                dangerouslySetInnerHTML={{ __html: qrSvg }}
              />
            </div>
            <div className="mt-6 border-t border-border pt-5">
              <p className="text-xs font-medium uppercase tracking-wide text-muted">
                Pickup at
              </p>
              <p className="mt-1 font-semibold">
                {location?.name ?? order.location_id}
              </p>
              {location && (
                <p className="text-sm text-muted">
                  {location.address}, {location.city} · {location.hours}
                </p>
              )}
            </div>
          </Card>

          <Card>
            <h2 className="font-semibold">Items</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {items.map((i) => {
                const addOnNames = parseAddOnNames(i.addons);
                return (
                  <li
                    key={i.id}
                    className="flex items-start justify-between gap-3"
                  >
                    <span className="min-w-0">
                      {i.product_name}{" "}
                      <span className="text-muted">× {i.quantity}</span>
                      {addOnNames && (
                        <span className="block text-xs text-muted">
                          + {addOnNames}
                        </span>
                      )}
                    </span>
                    <span className="font-medium">
                      ${((i.unit_price_cents * i.quantity) / 100).toFixed(2)}
                    </span>
                  </li>
                );
              })}
            </ul>
            <dl className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">Subtotal</dt>
                <dd>${(order.subtotal_cents / 100).toFixed(2)}</dd>
              </div>
              {order.paid_with === "plan" && (
                <div className="flex justify-between text-brand-700">
                  <dt>Covered by plan</dt>
                  <dd>−${(order.subtotal_cents / 100).toFixed(2)}</dd>
                </div>
              )}
              <div className="flex justify-between border-t border-border pt-3 font-semibold">
                <dt>{order.paid_with === "plan" ? "Charged" : "Total"}</dt>
                <dd>
                  {order.paid_with === "plan"
                    ? "$0.00"
                    : `$${(order.subtotal_cents / 100).toFixed(2)}`}
                </dd>
              </div>
              <div className="flex justify-between border-t border-border pt-3">
                <dt className="text-muted">Paid with</dt>
                <dd>{paymentLabel}</dd>
              </div>
            </dl>
            <p className="mt-5 text-xs text-muted">
              Placed{" "}
              {date.toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}{" "}
              at{" "}
              {date.toLocaleTimeString(undefined, {
                hour: "numeric",
                minute: "2-digit",
              })}
              .
            </p>
          </Card>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/menu"
            className="inline-flex h-11 items-center rounded-full bg-brand-500 px-5 text-sm font-medium text-white hover:bg-brand-600"
          >
            Order again
          </Link>
          <Link
            href="/orders"
            className="inline-flex h-11 items-center rounded-full border border-border bg-white px-5 text-sm font-medium text-foreground hover:bg-surface"
          >
            All orders
          </Link>
        </div>
      </Container>
    </Section>
  );
}
