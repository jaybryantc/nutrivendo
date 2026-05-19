"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function StickyMobileCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > window.innerHeight * 0.6);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden={!visible}
      className={
        "lg:hidden fixed inset-x-0 bottom-0 z-40 px-4 pt-3 transition-transform duration-300 " +
        "pb-[max(env(safe-area-inset-bottom),12px)] " +
        (visible ? "translate-y-0" : "translate-y-full")
      }
    >
      <div className="mx-auto flex max-w-md items-center gap-2 rounded-full border border-border bg-white/95 p-1.5 shadow-xl backdrop-blur">
        <Link
          href="/locations"
          className="focus-ring flex-1 inline-flex h-11 items-center justify-center rounded-full bg-brand-600 px-4 text-sm font-medium text-white hover:bg-brand-700 transition-colors"
        >
          Find a machine
        </Link>
        <Link
          href="/menu"
          className="focus-ring inline-flex h-11 items-center justify-center rounded-full px-4 text-sm font-medium text-foreground hover:bg-surface transition-colors"
        >
          Menu
        </Link>
      </div>
    </div>
  );
}
