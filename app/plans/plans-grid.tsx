"use client";

import { useActionState } from "react";
import { Card, Button } from "@/components/ui";
import Icon from "@/components/icon";
import { plans, isUnlimited, type Plan } from "@/lib/data";
import {
  subscribeAction,
  type SubscribeFormState,
} from "@/lib/actions/subscriptions";

export default function PlansGrid({
  currentPlanId,
  currentTier,
  usedThisMonth,
  nextResetLabel,
}: {
  currentPlanId: string | null;
  currentTier: number;
  usedThisMonth: number;
  nextResetLabel: string;
}) {
  const [state, formAction] = useActionState<SubscribeFormState, FormData>(
    subscribeAction,
    {}
  );

  return (
    <>
      {state.error && (
        <div
          role="alert"
          className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {state.error}
        </div>
      )}
      <div className="grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            currentPlanId={currentPlanId}
            currentTier={currentTier}
            usedThisMonth={usedThisMonth}
            nextResetLabel={nextResetLabel}
            formAction={formAction}
          />
        ))}
      </div>
    </>
  );
}

function PlanCard({
  plan,
  currentPlanId,
  currentTier,
  usedThisMonth,
  nextResetLabel,
  formAction,
}: {
  plan: Plan;
  currentPlanId: string | null;
  currentTier: number;
  usedThisMonth: number;
  nextResetLabel: string;
  formAction: (formData: FormData) => void;
}) {
  const isCurrent = currentPlanId === plan.id;
  const isDowngrade = plan.tier < currentTier;
  const downgradeBlocked = isDowngrade && usedThisMonth > 0;
  const ctaLabel = isCurrent
    ? "Current plan"
    : currentPlanId
      ? `Switch to ${plan.name}`
      : plan.cta;

  return (
    <Card
      className={
        "relative h-full transition-all " +
        (plan.highlight
          ? "bg-primary-container text-on-primary-container shadow-xl lg:scale-[1.04]"
          : "")
      }
    >
      {plan.highlight && (
        <span className="absolute -top-3 right-6 rounded-full bg-primary px-3 py-1 text-xs font-medium text-on-primary">
          Most popular
        </span>
      )}
      <p
        className={
          "text-sm " + (plan.highlight ? "text-on-primary-container/80" : "text-muted")
        }
      >
        {plan.tagline}
      </p>
      <h2 className="mt-1 text-2xl font-bold tracking-tight">{plan.name}</h2>
      <p className="mt-3">
        <span className="text-4xl font-bold">${plan.monthly}</span>
        <span
          className={
            "text-sm " +
            (plan.highlight ? "text-on-primary-container/80" : "text-muted")
          }
        >
          {" "}
          /mo
        </span>
      </p>
      <p
        className={
          "mt-1 text-xs " +
          (plan.highlight ? "text-on-primary-container/80" : "text-primary")
        }
      >
        {isUnlimited(plan.monthlyQuota)
          ? "Unlimited drinks"
          : `${plan.monthlyQuota} drinks per month`}
      </p>
      <ul className="mt-5 space-y-2.5 text-sm">
        {plan.features.map((f) => (
          <li key={f} className="flex gap-2">
            <Icon
              name="check_circle"
              size={20}
              className={
                "flex-none " +
                (plan.highlight ? "text-on-primary-container" : "text-primary")
              }
            />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      {isCurrent ? (
        <span className="mt-8 inline-flex h-11 w-full items-center justify-center rounded-full bg-secondary-container px-5 text-sm font-medium text-on-secondary-container">
          Current plan
        </span>
      ) : (
        <form action={formAction} className="mt-8">
          <input type="hidden" name="planId" value={plan.id} />
          <Button
            type="submit"
            disabled={downgradeBlocked}
            variant={plan.highlight ? "primary" : "secondary"}
            className="w-full"
          >
            {ctaLabel}
          </Button>
        </form>
      )}

      {downgradeBlocked && (
        <p
          className={
            "mt-3 text-center text-xs " +
            (plan.highlight ? "text-on-primary-container/80" : "text-muted")
          }
        >
          You've used {usedThisMonth} drink
          {usedThisMonth === 1 ? "" : "s"} this month — downgrade available on{" "}
          {nextResetLabel}.
        </p>
      )}
    </Card>
  );
}
