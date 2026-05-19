import Link from "next/link";
import { redirect } from "next/navigation";
import { Container, Section, Eyebrow, Card } from "@/components/ui";
import { getCurrentUser } from "@/lib/auth";
import {
  getActiveSubscription,
  getOrdersForUser,
  getPlanUsageThisMonth,
} from "@/lib/db";
import { getPlan, isUnlimited } from "@/lib/data";
import { cancelSubscriptionAction } from "@/lib/actions/subscriptions";
import { logoutAction } from "@/lib/actions/auth";

function getNextResetLabel(now: Date = new Date()): string {
  const next = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1)
  );
  return next.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
  });
}

export const metadata = { title: "Account" };

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ subscribed?: string; cancelled?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/account");

  const sub = await getActiveSubscription(user.id);
  const orders = await getOrdersForUser(user.id);
  const params = await searchParams;
  const plan = sub ? getPlan(sub.plan_id) : null;
  const used = sub ? await getPlanUsageThisMonth(user.id) : 0;
  const usagePct =
    plan && !isUnlimited(plan.monthlyQuota)
      ? Math.min(100, Math.round((used / plan.monthlyQuota) * 100))
      : null;

  return (
    <Section>
      <Container>
        <Eyebrow>Account</Eyebrow>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">
          {user.first_name}'s account
        </h1>

        {params.subscribed && (
          <div
            role="status"
            className="mt-6 rounded-xl bg-brand-50 px-4 py-3 text-sm text-brand-800"
          >
            Subscription updated. Welcome aboard.
          </div>
        )}
        {params.cancelled && (
          <div
            role="status"
            className="mt-6 rounded-xl bg-brand-50 px-4 py-3 text-sm text-brand-800"
          >
            Subscription cancelled. You can re-subscribe anytime.
          </div>
        )}

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <Card>
            <h2 className="font-semibold">Profile</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">Name</dt>
                <dd>
                  {user.first_name} {user.last_name}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Email</dt>
                <dd>{user.email}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Member since</dt>
                <dd>
                  {new Date(user.created_at).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </dd>
              </div>
            </dl>
            <form action={logoutAction} className="mt-6">
              <button
                type="submit"
                className="inline-flex h-10 items-center rounded-full border border-border bg-white px-4 text-sm font-medium hover:bg-surface"
              >
                Log out
              </button>
            </form>
          </Card>

          <Card>
            <h2 className="font-semibold">Subscription</h2>
            {sub && plan ? (
              <>
                <div className="mt-4 rounded-xl bg-brand-50 px-4 py-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-brand-700">
                    Active plan
                  </p>
                  <p className="mt-1 text-2xl font-semibold">{plan.name}</p>
                  <p className="text-sm text-brand-800">
                    ${plan.monthly}/mo · Started{" "}
                    {new Date(sub.started_at).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>

                <div className="mt-5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">This month</span>
                    <span className="text-muted">
                      {isUnlimited(plan.monthlyQuota)
                        ? `${used} used · Unlimited`
                        : `${used} of ${plan.monthlyQuota} drinks`}
                    </span>
                  </div>
                  {usagePct !== null && (
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-brand-50">
                      <div
                        className="h-full rounded-full bg-brand-500 transition-all"
                        style={{ width: `${usagePct}%` }}
                        aria-hidden
                      />
                    </div>
                  )}
                  <p className="mt-2 text-xs text-muted">
                    Resets on {getNextResetLabel()}.
                  </p>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <Link
                    href="/plans"
                    className="inline-flex h-10 items-center rounded-full bg-brand-500 px-4 text-sm font-medium text-white hover:bg-brand-600"
                  >
                    Change plan
                  </Link>
                  <form action={cancelSubscriptionAction}>
                    <button
                      type="submit"
                      className="inline-flex h-10 items-center rounded-full border border-border bg-white px-4 text-sm font-medium text-foreground hover:bg-surface"
                    >
                      Cancel subscription
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <>
                <p className="mt-3 text-sm text-muted">
                  You're not on a plan right now. Pick one and start saving on
                  every sip.
                </p>
                <Link
                  href="/plans"
                  className="mt-5 inline-flex h-10 items-center rounded-full bg-brand-500 px-4 text-sm font-medium text-white hover:bg-brand-600"
                >
                  Browse plans
                </Link>
              </>
            )}
          </Card>
        </div>

        <Card className="mt-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-semibold">Recent orders</h2>
            <Link
              href="/orders"
              className="text-sm font-medium text-brand-700 hover:text-brand-800"
            >
              See all →
            </Link>
          </div>
          {orders.length === 0 ? (
            <p className="mt-3 text-sm text-muted">
              You haven't placed an order yet.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-border">
              {orders.slice(0, 3).map((o) => (
                <li key={o.id}>
                  <Link
                    href={`/orders/${o.id}`}
                    className="flex items-center justify-between py-3 text-sm hover:text-brand-700"
                  >
                    <span>
                      <span className="font-medium">{o.pickup_code}</span>{" "}
                      <span className="text-muted">·</span>{" "}
                      <span className="text-muted">
                        {new Date(o.created_at).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </span>
                    <span className="font-medium">
                      ${(o.subtotal_cents / 100).toFixed(2)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </Container>
    </Section>
  );
}
