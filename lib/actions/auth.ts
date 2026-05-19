"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  clearSessionCookie,
  hashPassword,
  setSessionCookie,
  verifyPassword,
} from "@/lib/auth";
import { createUser, getUserByEmail } from "@/lib/db";

export type AuthFormState = { error?: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function safeNext(raw: FormDataEntryValue | null, fallback: string): string {
  if (typeof raw !== "string") return fallback;
  if (!raw.startsWith("/") || raw.startsWith("//")) return fallback;
  return raw;
}

export async function registerAction(
  _prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const firstName = String(formData.get("first") ?? "").trim();
  const lastName = String(formData.get("last") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = safeNext(formData.get("next"), "/menu");

  if (!firstName || !lastName) {
    return { error: "Please enter your first and last name." };
  }
  if (!EMAIL_RE.test(email)) {
    return { error: "That email doesn't look right." };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  if (getUserByEmail(email)) {
    return { error: "An account with that email already exists." };
  }

  const password_hash = await hashPassword(password);
  const id = crypto.randomUUID();
  createUser({ id, email, password_hash, first_name: firstName, last_name: lastName });

  await setSessionCookie(id);
  revalidatePath("/", "layout");
  redirect(next);
}

export async function loginAction(
  _prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = safeNext(formData.get("next"), "/menu");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  const user = getUserByEmail(email);
  if (!user || !(await verifyPassword(password, user.password_hash))) {
    return { error: "Invalid email or password." };
  }

  await setSessionCookie(user.id);
  revalidatePath("/", "layout");
  redirect(next);
}

export async function logoutAction(): Promise<void> {
  await clearSessionCookie();
  revalidatePath("/", "layout");
  redirect("/");
}
