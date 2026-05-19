"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import AuthShell from "@/components/auth-shell";
import { Button, Input, Label } from "@/components/ui";
import { loginAction, type AuthFormState } from "@/lib/actions/auth";

export default function LoginPage() {
  const params = useSearchParams();
  const next = params.get("next") ?? "/menu";
  const [state, formAction, pending] = useActionState<AuthFormState, FormData>(
    loginAction,
    {}
  );

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to manage your plan, drinks, and orders."
      footer={
        <>
          Don't have an account?{" "}
          <Link
            href={`/register${next !== "/menu" ? `?next=${encodeURIComponent(next)}` : ""}`}
            className="font-medium text-brand-700 hover:text-brand-800"
          >
            Create one
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
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
          />
        </div>
        <div>
          <div className="flex items-baseline justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/forgot-password"
              className="text-xs text-brand-700 hover:text-brand-800"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            placeholder="••••••••"
          />
        </div>
        <Button type="submit" size="lg" className="w-full" disabled={pending}>
          {pending ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </AuthShell>
  );
}
