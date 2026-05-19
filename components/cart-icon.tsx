"use client";

import Link from "next/link";
import { useCart } from "./cart-provider";

export default function CartIcon({ className = "" }: { className?: string }) {
  const { count, hydrated } = useCart();

  return (
    <Link
      href="/cart"
      aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}
      className={
        "relative inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground/80 hover:bg-surface " +
        className
      }
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h2l2.4 11.2A2 2 0 009.36 17H18a2 2 0 002-1.6l1.5-7.4H6" />
        <circle cx="10" cy="20" r="1.5" />
        <circle cx="18" cy="20" r="1.5" />
      </svg>
      {hydrated && count > 0 && (
        <span className="absolute -top-1 -right-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-500 px-1 text-[11px] font-semibold text-white">
          {count}
        </span>
      )}
    </Link>
  );
}
