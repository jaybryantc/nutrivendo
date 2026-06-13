"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { logoutAction } from "@/lib/actions/auth";
import type { CurrentUser } from "@/lib/auth";

export default function UserMenu({ user }: { user: CurrentUser }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const initials = (user.first_name.charAt(0) + user.last_name.charAt(0)).toUpperCase();

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-10 items-center gap-2 rounded-full border border-outline-variant bg-surface-container-lowest pl-1.5 pr-3 hover:bg-surface-container-low"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="grid h-7 w-7 place-items-center rounded-full bg-primary-container text-xs font-semibold text-on-primary-container">
          {initials || "U"}
        </span>
        <span className="text-sm font-medium hidden sm:inline">
          {user.first_name}
        </span>
        <svg viewBox="0 0 24 24" className="h-4 w-4 text-on-surface-variant" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest shadow-lg"
        >
          <div className="px-4 py-3 border-b border-outline-variant">
            <p className="text-sm font-medium">
              {user.first_name} {user.last_name}
            </p>
            <p className="text-xs text-on-surface-variant truncate">{user.email}</p>
          </div>
          <Link
            href="/orders"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-sm hover:bg-surface-container-low"
          >
            My orders
          </Link>
          <Link
            href="/account"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-sm hover:bg-surface-container-low"
          >
            Account
          </Link>
          <form action={logoutAction} className="border-t border-outline-variant">
            <button
              type="submit"
              role="menuitem"
              className="w-full text-left px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container-low"
            >
              Log out
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
