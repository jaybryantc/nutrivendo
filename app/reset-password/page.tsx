"use client";

import Link from "next/link";
import { useState } from "react";
import AuthShell from "@/components/auth-shell";
import { Button, Input, Label } from "@/components/ui";

export default function ResetPasswordPage() {
  const [done, setDone] = useState(false);

  return (
    <AuthShell
      title="Choose a new password"
      subtitle={
        done
          ? "All set. You can now sign in with your new password."
          : "Pick something memorable. At least 8 characters."
      }
      footer={
        done ? (
          <Link href="/login" className="font-medium text-primary hover:text-brand-700">
            Sign in
          </Link>
        ) : null
      }
    >
      {done ? (
        <div className="rounded-xl bg-primary-container px-4 py-3 text-sm text-on-primary-container">
          Password updated successfully.
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setDone(true);
          }}
          className="space-y-4"
        >
          <div>
            <Label htmlFor="password">New password</Label>
            <Input id="password" type="password" required placeholder="At least 8 characters" />
          </div>
          <div>
            <Label htmlFor="confirm">Confirm new password</Label>
            <Input id="confirm" type="password" required placeholder="Re-enter your new password" />
          </div>
          <Button type="submit" size="lg" className="w-full">
            Update password
          </Button>
        </form>
      )}
    </AuthShell>
  );
}
