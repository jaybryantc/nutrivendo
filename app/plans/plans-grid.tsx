"use client";

import { useActionState } from "react";
import { Card } from "@/components/ui";
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
        "relative h-full " +
        (plan.highlight
          ? "border-brand-500 ring-2 ring-brand-500/30"
          : "")
      }
    >
      {plan.highlight && (
        <span className="absolute -top-3 right-6 rounded-full bg-brand-500 px-3 py-1 text-xs font-medium text-white">
          Most popular
        </span>
      )}
      <p className="text-sm text-muted">{plan.tagline}</p>
      <h2 className="mt-1 text-2xl font-semibold">{plan.name}</h2>
      <p className="mt-3">
        <span className="text-4xl font-semibold">${plan.monthly}</span>
        <span className="text-muted text-sm"> /mo</span>
      </p>
      <p className="mt-1 text-xs text-brand-700">
        {isUnlimited(plan.monthlyQuota)
          ? "Unlimited drinks"
          : `${plan.monthlyQuota} drinks per month`}
      </p>
      <ul className="mt-5 space-y-2.5 text-sm">
        {plan.features.map((f) => (
          <li key={f} className="flex gap-2">
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 flex-none text-brand-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12l5 5L20 7" />
            </svg>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      {isCurrent ? (
        <span className="mt-8 inline-flex h-11 w-full items-center justify-center rounded-full bg-brand-100 px-5 text-sm font-medium text-brand-800">
          Current plan
        </span>
      ) : (
        <form action={formAction} className="mt-8">
          <input type="hidden" name="planId" value={plan.id} />
          <button
            type="submit"
            disabled={downgradeBlocked}
            className={
              "inline-flex h-11 w-full items-center justify-center rounded-full px-5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 " +
              (plan.highlight
                ? "bg-brand-500 text-white hover:bg-brand-600 disabled:hover:bg-brand-500"
                : "border border-border bg-white text-foreground hover:bg-surface disabled:hover:bg-white")
            }
          >
            {ctaLabel}
          </button>
        </form>
      )}

      {downgradeBlocked && (
        <p className="mt-3 text-center text-xs text-muted">
          You've used {usedThisMonth} drink
          {usedThisMonth === 1 ? "" : "s"} this month — downgrade available on{" "}
          {nextResetLabel}.
        </p>
      )}
    </Card>
  );
}
