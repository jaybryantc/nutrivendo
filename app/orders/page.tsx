import Link from "next/link";
import { Container, Section, Eyebrow, Card } from "@/components/ui";
import { getCurrentUser } from "@/lib/auth";
import { getOrderItems, getOrdersForUser } from "@/lib/db";
import { locations } from "@/lib/data";
import { redirect } from "next/navigation";

export const metadata = { title: "My orders" };

export default async function OrdersPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/orders");

  const orders = await getOrdersForUser(user.id);
  const itemCounts = await Promise.all(
    orders.map(async (o) =>
      (await getOrderItems(o.id)).reduce((s, i) => s + i.quantity, 0)
    )
  );

  if (orders.length === 0) {
    return (
      <Section>
        <Container>
          <Eyebrow>My orders</Eyebrow>
          <h1 className="mt-4 text-4xl font-bold tracking-tight">
            No orders yet.
          </h1>
          <p className="mt-4 text-on-surface-variant max-w-xl">
            Once you place an order, it'll show up here with the pickup code.
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
        <Eyebrow>My orders</Eyebrow>
        <h1 className="mt-4 text-4xl font-bold tracking-tight">
          Your order history
        </h1>

        <div className="mt-10 space-y-4">
          {orders.map((o, idx) => {
            const location = locations.find((l) => l.id === o.location_id);
            const itemCount = itemCounts[idx];
            const date = new Date(o.created_at);
            return (
              <Link
                key={o.id}
                href={`/orders/${o.id}`}
                className="block"
              >
                <Card className="transition-shadow hover:shadow-md">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-primary">
                        Pickup code · {o.pickup_code}
                      </p>
                      <p className="mt-1 font-semibold">
                        {location?.name ?? o.location_id}
                      </p>
                      <p className="text-sm text-on-surface-variant">
                        {date.toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}{" "}
                        ·{" "}
                        {date.toLocaleTimeString(undefined, {
                          hour: "numeric",
                          minute: "2-digit",
                        })}{" "}
                        · {itemCount} item{itemCount === 1 ? "" : "s"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold">
                        ${(o.subtotal_cents / 100).toFixed(2)}
                      </p>
                      <span className="mt-1 inline-flex rounded-full bg-secondary-container px-2.5 py-1 text-[11px] font-medium text-on-secondary-container capitalize">
                        {o.status}
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
