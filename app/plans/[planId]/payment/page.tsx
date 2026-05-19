import { redirect } from "next/navigation";
import { Container, Section, Eyebrow } from "@/components/ui";
import { getCurrentUser } from "@/lib/auth";
import { getActiveSubscription } from "@/lib/db";
import { getPlan } from "@/lib/data";
import SubscriptionPaymentForm from "./payment-form";

export const metadata = { title: "Subscription payment" };

export default async function SubscriptionPaymentPage({
  params,
}: {
  params: Promise<{ planId: string }>;
}) {
  const { planId } = await params;
  const plan = getPlan(planId);
  if (!plan) redirect("/plans");

  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=/plans/${planId}/payment`);

  if (await getActiveSubscription(user.id)) {
    redirect("/plans");
  }

  return (
    <Section>
      <Container>
        <Eyebrow>Subscription payment</Eyebrow>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">
          Confirm your {plan.name} plan.
        </h1>
        <p className="mt-4 text-muted max-w-2xl">
          One last step — add a card to start your subscription. You can cancel
          anytime from your account.
        </p>
        <div className="mt-10">
          <SubscriptionPaymentForm
            plan={{ id: plan.id, name: plan.name, monthly: plan.monthly }}
          />
        </div>
      </Container>
    </Section>
  );
}
