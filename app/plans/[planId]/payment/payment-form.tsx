"use client";

import { useActionState } from "react";
import { Card, Input, Label } from "@/components/ui";
import {
  confirmSubscriptionPaymentAction,
  type SubscribeFormState,
} from "@/lib/actions/subscriptions";

type PlanSummary = {
  id: string;
  name: string;
  monthly: number;
};

export default function SubscriptionPaymentForm({ plan }: { plan: PlanSummary }) {
  const action = confirmSubscriptionPaymentAction.bind(null, plan.id);
  const [state, formAction, pending] = useActionState<SubscribeFormState, FormData>(
    action,
    {}
  );

  return (
    <form
      action={formAction}
      className="grid gap-10 lg:grid-cols-[1.4fr_1fr]"
    >
      <div className="space-y-10">
        <section>
          <h2 className="text-lg font-semibold">Card details</h2>
          <p className="mt-1 text-sm text-muted">
            Your card will be charged ${plan.monthly.toFixed(2)} today and each
            month until you cancel.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="cardName">Name on card</Label>
              <Input
                id="cardName"
                name="cardName"
                placeholder="Jane Sipper"
                autoComplete="cc-name"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="cardNumber">Card number</Label>
              <Input
                id="cardNumber"
                name="cardNumber"
                inputMode="numeric"
                placeholder="4242 4242 4242 4242"
                autoComplete="cc-number"
                required
                onInput={(e) => {
                  const v = e.currentTarget.value
                    .replace(/\D/g, "")
                    .slice(0, 19);
                  e.currentTarget.value =
                    v.match(/.{1,4}/g)?.join(" ") ?? v;
                }}
              />
            </div>
            <div>
              <Label htmlFor="cardExp">Expiry (MM/YY)</Label>
              <Input
                id="cardExp"
                name="cardExp"
                placeholder="12/30"
                autoComplete="cc-exp"
                required
                onInput={(e) => {
                  const digits = e.currentTarget.value
                    .replace(/\D/g, "")
                    .slice(0, 4);
                  e.currentTarget.value =
                    digits.length > 2
                      ? `${digits.slice(0, 2)}/${digits.slice(2)}`
                      : digits;
                }}
              />
            </div>
            <div>
              <Label htmlFor="cardCvc">CVC</Label>
              <Input
                id="cardCvc"
                name="cardCvc"
                inputMode="numeric"
                placeholder="123"
                autoComplete="cc-csc"
                required
                onInput={(e) => {
                  e.currentTarget.value = e.currentTarget.value
                    .replace(/\D/g, "")
                    .slice(0, 4);
                }}
              />
            </div>
            <p className="sm:col-span-2 text-xs text-muted">
              Demo only — no real charge. Any 13-19 digit number works.
            </p>
          </div>
        </section>
      </div>

      <Card className="h-fit lg:sticky lg:top-20">
        <h2 className="font-semibold">Subscription summary</h2>
        <dl className="mt-5 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">Plan</dt>
            <dd className="font-medium">{plan.name}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Billed</dt>
            <dd>${plan.monthly.toFixed(2)} / month</dd>
          </div>
          <div className="flex justify-between border-t border-border pt-3 font-semibold">
            <dt>Due today</dt>
            <dd>${plan.monthly.toFixed(2)}</dd>
          </div>
        </dl>

        {state.error && (
          <div
            role="alert"
            className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {state.error}
          </div>
        )}

        <button
          type="submit"
          disabled={pending}
          className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-brand-500 px-5 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50"
        >
          {pending
            ? "Processing…"
            : `Pay $${plan.monthly.toFixed(2)} & subscribe`}
        </button>
        <p className="mt-3 text-center text-xs text-muted">
          Demo — no real payment is collected.
        </p>
      </Card>
    </form>
  );
}
