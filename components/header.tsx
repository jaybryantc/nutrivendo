"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Logo from "./logo";
import CartIcon from "./cart-icon";
import UserMenu from "./user-menu";
import { navLinks } from "@/lib/data";
import { cn } from "@/lib/cn";
import { logoutAction } from "@/lib/actions/auth";
import type { CurrentUser } from "@/lib/auth";

export default function Header({ user }: { user: CurrentUser | null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-outline-variant bg-background/80 shadow-sm backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        {/* Full horizontal nav — desktop only */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm transition-colors",
                  active
                    ? "text-primary font-bold border-b-2 border-primary py-1"
                    : "text-on-surface-variant hover:text-primary"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop actions */}
        <div className="hidden lg:flex items-center gap-3">
          {user ? (
            <>
              <CartIcon />
              <UserMenu user={user} />
            </>
          ) : (
            <>
              <CartIcon />
              <Link
                href="/login"
                className="focus-ring rounded-full px-2 py-1 text-sm text-foreground/70 hover:text-foreground"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="focus-ring inline-flex h-10 items-center rounded-full bg-primary px-5 text-sm font-semibold text-on-primary shadow-sm hover:bg-brand-700 transition-colors"
              >
                Get started
              </Link>
            </>
          )}
        </div>

        {/* Tablet hamburger (md → <lg) */}
        <div className="hidden md:flex lg:hidden items-center gap-1">
          <CartIcon />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground/70 hover:bg-surface"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Phones: navigation lives in the fixed bottom bar (see BottomNav). */}
        <div className="md:hidden flex items-center gap-2">
          <CartIcon />
          {!user && (
            <Link
              href="/login"
              className="focus-ring rounded-full px-3 py-1 text-sm font-medium text-foreground/70 hover:text-foreground"
            >
              Log in
            </Link>
          )}
        </div>
      </div>

      {/* Tablet drawer */}
      {open && (
        <div className="hidden md:block lg:hidden border-t border-border bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "px-3 py-2 rounded-md text-base",
                  pathname === link.href
                    ? "bg-brand-50 text-brand-700"
                    : "text-foreground/80 hover:bg-surface"
                )}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <div className="mt-2 border-t border-border pt-3 flex flex-col gap-1">
                <div className="px-3 py-2 text-sm">
                  <p className="font-medium">
                    {user.first_name} {user.last_name}
                  </p>
                  <p className="text-xs text-muted">{user.email}</p>
                </div>
                <Link
                  href="/orders"
                  onClick={() => setOpen(false)}
                  className="px-3 py-2 rounded-md text-base text-foreground/80 hover:bg-surface"
                >
                  My orders
                </Link>
                <Link
                  href="/account"
                  onClick={() => setOpen(false)}
                  className="px-3 py-2 rounded-md text-base text-foreground/80 hover:bg-surface"
                >
                  Account
                </Link>
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="w-full text-left px-3 py-2 rounded-md text-base text-foreground/80 hover:bg-surface"
                  >
                    Log out
                  </button>
                </form>
              </div>
            ) : (
              <div className="mt-2 flex items-center gap-3 border-t border-border pt-3">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="flex-1 inline-flex h-10 items-center justify-center rounded-full border border-border text-sm font-medium"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className="flex-1 inline-flex h-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-on-primary"
                >
                  Get started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
