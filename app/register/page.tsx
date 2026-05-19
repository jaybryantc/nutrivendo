"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import AuthShell from "@/components/auth-shell";
import { Button, Input, Label } from "@/components/ui";
import { registerAction, type AuthFormState } from "@/lib/actions/auth";

export default function RegisterPage() {
  const params = useSearchParams();
  const next = params.get("next") ?? "/menu";
  const [state, formAction, pending] = useActionState<AuthFormState, FormData>(
    registerAction,
    {}
  );

  return (
    <AuthShell
      title="Create your NutriVendo account"
      subtitle="Free to join. Plans start whenever you're ready."
      footer={
        <>
          Already have an account?{" "}
          <Link
            href={`/login${next !== "/menu" ? `?next=${encodeURIComponent(next)}` : ""}`}
            className="font-medium text-brand-700 hover:text-brand-800"
          >
            Sign in
          </Link>
        </>
      }
    >
      <form action={formAction} className="space-y-4">
        <input type="hidden" name="next" value={next} />
        {state.error && (
          <div
            role="alert"
            className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {state.error}
          </div>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="first">First name</Label>
            <Input id="first" name="first" autoComplete="given-name" required placeholder="Jane" />
          </div>
          <div>
            <Label htmlFor="last">Last name</Label>
            <Input id="last" name="last" autoComplete="family-name" required placeholder="Sipper" />
          </div>
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" autoComplete="email" required placeholder="you@example.com" />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            placeholder="At least 8 characters"
          />
        </div>
        <p className="text-xs text-muted">
          By creating an account you agree to our{" "}
          <Link href="#" className="underline">Terms</Link> and{" "}
          <Link href="#" className="underline">Privacy Policy</Link>.
        </p>
        <Button type="submit" size="lg" className="w-full" disabled={pending}>
          {pending ? "Creating account…" : "Create account"}
        </Button>
      </form>
    </AuthShell>
  );
}
