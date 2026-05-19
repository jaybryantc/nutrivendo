"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import {
  cancelActiveSubscription,
  getActiveSubscription,
  getPlanUsageThisMonth,
  upsertSubscriptionTxn,
} from "@/lib/db";
import { getPlan } from "@/lib/data";
import { validateCard } from "@/lib/payments";

export type SubscribeFormState = { error?: string };

export async function subscribeAction(
  _prev: SubscribeFormState,
  formData: FormData
): Promise<SubscribeFormState> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?next=/plans");
  }

  const planId = String(formData.get("planId") ?? "");
  const newPlan = getPlan(planId);
  if (!newPlan) {
    return { error: "That plan doesn't exist." };
  }

  const currentSub = getActiveSubscription(user.id);
  const currentPlan = currentSub ? getPlan(currentSub.plan_id) : null;
  const currentTier = currentPlan?.tier ?? 0;

  if (currentSub && currentPlan && currentPlan.id === newPlan.id) {
    // Idempotent — treat as success.
    redirect("/account?subscribed=1");
  }

  if (newPlan.tier < currentTier) {
    const used = getPlanUsageThisMonth(user.id);
    if (used > 0) {
      return {
        error: `You've used ${used} drink${used === 1 ? "" : "s"} on ${currentPlan?.name ?? "your current plan"} this month — downgrade available on the 1st of next month.`,
      };
    }
  }

  if (!currentSub) {
    redirect(`/plans/${newPlan.id}/payment`);
  }

  upsertSubscriptionTxn(user.id, newPlan.id);
  revalidatePath("/account");
  revalidatePath("/plans");
  redirect("/account?subscribed=1");
}

export async function confirmSubscriptionPaymentAction(
  planId: string,
  _prev: SubscribeFormState,
  formData: FormData
): Promise<SubscribeFormState> {
  const user = await getCurrentUser();
  if (!user) {
    redirect(`/login?next=/plans/${planId}/payment`);
  }

  const newPlan = getPlan(planId);
  if (!newPlan) {
    redirect("/plans");
  }

  if (getActiveSubscription(user.id)) {
    redirect("/account?subscribed=1");
  }

  const card = validateCard(formData);
  if (!card.ok) {
    return { error: card.error };
  }

  upsertSubscriptionTxn(user.id, newPlan.id);
  revalidatePath("/account");
  revalidatePath("/plans");
  redirect("/account?subscribed=1");
}

export async function cancelSubscriptionAction(): Promise<void> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?next=/account");
  }
  cancelActiveSubscription(user.id);
  revalidatePath("/account");
  revalidatePath("/plans");
  redirect("/account?cancelled=1");
}
