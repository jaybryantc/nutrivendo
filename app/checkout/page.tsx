import { redirect } from "next/navigation";
import { Container, Section, Eyebrow } from "@/components/ui";
import CheckoutForm from "./checkout-form";
import { getCurrentUser } from "@/lib/auth";
import { getActiveSubscription, getPlanUsageThisMonth } from "@/lib/db";
import { getPlan } from "@/lib/data";

export const metadata = { title: "Checkout" };

export default async function CheckoutPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/checkout");

  const sub = getActiveSubscription(user.id);
  const planMeta = sub ? getPlan(sub.plan_id) : null;
  const used = sub ? getPlanUsageThisMonth(user.id) : 0;
  const remaining = planMeta ? Math.max(0, planMeta.monthlyQuota - used) : 0;

  return (
    <Section>
      <Container>
        <Eyebrow>Checkout</Eyebrow>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">
          One step away.
        </h1>
        <p className="mt-4 text-muted max-w-2xl">
          Pick where you'd like to grab your order, then choose how to pay.
        </p>
        <div className="mt-10">
          <CheckoutForm
            plan={
              planMeta
                ? {
                    id: planMeta.id,
                    name: planMeta.name,
                    monthlyQuota: planMeta.monthlyQuota,
                    used,
                    remaining,
                  }
                : null
            }
          />
        </div>
      </Container>
    </Section>
  );
}
