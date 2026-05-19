"use client";

import Link from "next/link";
import { useState } from "react";
import AuthShell from "@/components/auth-shell";
import { Button, Input, Label } from "@/components/ui";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);

  return (
    <AuthShell
      title="Reset your password"
      subtitle={
        sent
          ? "Check your inbox. The link expires in 30 minutes."
          : "Enter your email and we'll send a reset link."
      }
      footer={
        <>
          Remembered it?{" "}
          <Link href="/login" className="font-medium text-brand-700 hover:text-brand-800">
            Back to sign in
          </Link>
        </>
      }
    >
      {sent ? (
        <div className="rounded-xl bg-brand-50 px-4 py-3 text-sm text-brand-800">
          We sent a reset link to your email.
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
          className="space-y-4"
        >
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required placeholder="you@example.com" />
          </div>
          <Button type="submit" size="lg" className="w-full">
            Send reset link
          </Button>
        </form>
      )}
    </AuthShell>
  );
}
