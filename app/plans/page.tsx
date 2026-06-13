import { Container, Section, Eyebrow, Card } from "@/components/ui";
import { getPlan, isUnlimited } from "@/lib/data";
import { getCurrentUser } from "@/lib/auth";
import { getActiveSubscription, getPlanUsageThisMonth } from "@/lib/db";
import PlansGrid from "./plans-grid";

const faqs = [
  {
    q: "Can I cancel anytime?",
    a: "Yes. Cancel in one tap from your account. We don't do dark patterns.",
  },
  {
    q: "Do unused drinks roll over?",
    a: "Starter rolls over up to 2 drinks each month. Fuel rolls over up to 5. Athlete is fair-use and uncapped.",
  },
  {
    q: "Can I use my plan at any machine?",
    a: "Yes — your plan works at every NutriVendo machine, and we add new locations regularly.",
  },
  {
    q: "Can I gift a plan?",
    a: "We're rolling out gift plans soon. Drop us a note via Contact and we'll let you know first.",
  },
];

function getNextResetLabel(now: Date = new Date()): string {
  const next = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));
  return next.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
  });
}

export default async function PlansPage() {
  const user = await getCurrentUser();
  const activeSub = user ? await getActiveSubscription(user.id) : null;
  const currentPlan = activeSub ? getPlan(activeSub.plan_id) : null;
  const used = user ? await getPlanUsageThisMonth(user.id) : 0;
  const currentTier = currentPlan?.tier ?? 0;

  return (
    <>
      <Section className="pb-0 lg:pb-0 lg:pt-12">
        <Container>
          <Eyebrow>Plans</Eyebrow>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl max-w-3xl">
            Pick the plan that matches your week.
          </h1>
          <p className="mt-4 text-muted max-w-2xl">
            All plans work at every NutriVendo machine. Cancel anytime.
          </p>
          {currentPlan && (
            <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-secondary-container px-3 py-1.5 text-sm text-on-secondary-container">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span>
                You're on{" "}
                <span className="font-semibold">{currentPlan.name}</span> ·{" "}
                {isUnlimited(currentPlan.monthlyQuota)
                  ? `${used} used this month · Unlimited`
                  : `${used} of ${currentPlan.monthlyQuota} drinks used this month`}
              </span>
            </div>
          )}
        </Container>
      </Section>

      <Section className="lg:pt-12">
        <Container>
          <PlansGrid
            currentPlanId={currentPlan?.id ?? null}
            currentTier={currentTier}
            usedThisMonth={used}
            nextResetLabel={getNextResetLabel()}
          />
        </Container>
      </Section>

      <Section className="bg-surface">
        <Container>
          <div className="max-w-2xl">
            <Eyebrow>FAQ</Eyebrow>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Questions, briefly answered.
            </h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {faqs.map((f) => (
              <Card key={f.q}>
                <h3 className="font-semibold">{f.q}</h3>
                <p className="mt-2 text-sm text-muted">{f.a}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
