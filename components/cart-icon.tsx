"use client";

import Link from "next/link";
import { useCart } from "./cart-provider";
import Icon from "./icon";

export default function CartIcon({ className = "" }: { className?: string }) {
  const { count, hydrated } = useCart();

  return (
    <Link
      href="/cart"
      aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}
      className={
        "relative inline-flex h-10 w-10 items-center justify-center rounded-full text-primary hover:bg-surface-container-low transition-colors " +
        className
      }
    >
      <Icon name="shopping_cart" size={22} />
      {hydrated && count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-semibold text-on-primary">
          {count}
        </span>
      )}
    </Link>
  );
}
