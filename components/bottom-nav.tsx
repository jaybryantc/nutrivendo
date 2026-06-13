"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Icon from "./icon";
import { useCart } from "./cart-provider";
import { navLinks } from "@/lib/data";
import { cn } from "@/lib/cn";
import { logoutAction } from "@/lib/actions/auth";
import type { CurrentUser } from "@/lib/auth";

// Primary destinations surfaced as tabs in the mobile bottom bar.
// Everything else lives in the "More" sheet.
const primaryTabs = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/menu", label: "Menu", icon: "local_drink" },
  { href: "/plans", label: "Plans", icon: "restaurant_menu" },
] as const;

// Links shown in the "More" sheet (the ones not promoted to a tab).
const moreLinks = navLinks.filter(
  (l) => !primaryTabs.some((t) => t.href === l.href)
);

export default function BottomNav({ user }: { user: CurrentUser | null }) {
  const pathname = usePathname();
  const { count, hydrated } = useCart();
  const [moreOpen, setMoreOpen] = useState(false);
  const closeMore = () => setMoreOpen(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  const moreActive = moreLinks.some((l) => isActive(l.href)) || isActive("/account") || isActive("/orders");

  const tabClass = (active: boolean) =>
    cn(
      "flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[11px] font-medium transition-colors",
      active ? "text-primary" : "text-on-surface-variant"
    );

  return (
    <>
      {/* Backdrop + sheet for the "More" menu */}
      {moreOpen && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="More menu">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMoreOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 rounded-t-2xl border-t border-outline-variant bg-background pb-[env(safe-area-inset-bottom)] shadow-2xl">
            <div className="mx-auto max-w-7xl px-4 pt-3 pb-4">
              <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-outline-variant" />

              {user && (
                <div className="mb-2 px-1">
                  <p className="font-semibold">
                    {user.first_name} {user.last_name}
                  </p>
                  <p className="text-xs text-muted">{user.email}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-1">
                {moreLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMore}
                    className={cn(
                      "rounded-xl px-3 py-3 text-base",
                      isActive(link.href)
                        ? "bg-brand-50 text-brand-700 font-semibold"
                        : "text-foreground/80 hover:bg-surface"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="mt-3 border-t border-outline-variant pt-3">
                {user ? (
                  <div className="flex flex-col gap-1">
                    <Link
                      href="/orders"
                      onClick={closeMore}
                      className="rounded-xl px-3 py-3 text-base text-foreground/80 hover:bg-surface"
                    >
                      My orders
                    </Link>
                    <Link
                      href="/account"
                      onClick={closeMore}
                      className="rounded-xl px-3 py-3 text-base text-foreground/80 hover:bg-surface"
                    >
                      Account
                    </Link>
                    <form action={logoutAction}>
                      <button
                        type="submit"
                        className="w-full rounded-xl px-3 py-3 text-left text-base text-foreground/80 hover:bg-surface"
                      >
                        Log out
                      </button>
                    </form>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Link
                      href="/login"
                      onClick={closeMore}
                      className="inline-flex h-11 flex-1 items-center justify-center rounded-full border border-outline-variant text-sm font-medium"
                    >
                      Log in
                    </Link>
                    <Link
                      href="/register"
                      onClick={closeMore}
                      className="inline-flex h-11 flex-1 items-center justify-center rounded-full bg-primary text-sm font-semibold text-on-primary"
                    >
                      Get started
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fixed bottom tab bar (mobile only) */}
      <nav
        aria-label="Primary"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-outline-variant bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
      >
        <div className="mx-auto flex max-w-7xl items-stretch">
          {primaryTabs.map((tab) => {
            const active = isActive(tab.href);
            return (
              <Link key={tab.href} href={tab.href} className={tabClass(active)}>
                <Icon name={tab.icon} size={24} filled={active} />
                {tab.label}
              </Link>
            );
          })}

          <Link href="/cart" className={tabClass(isActive("/cart"))}>
            <span className="relative inline-flex">
              <Icon name="shopping_cart" size={24} filled={isActive("/cart")} />
              {hydrated && count > 0 && (
                <span className="absolute -top-1.5 -right-2 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-on-primary">
                  {count}
                </span>
              )}
            </span>
            Cart
          </Link>

          <button
            type="button"
            onClick={() => setMoreOpen((v) => !v)}
            aria-expanded={moreOpen}
            aria-label="More"
            className={tabClass(moreActive || moreOpen)}
          >
            <Icon name="menu" size={24} />
            More
          </button>
        </div>
      </nav>
    </>
  );
}
