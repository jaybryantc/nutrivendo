import Link from "next/link";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2 font-semibold text-foreground ${className}`}
      aria-label="NutriVendo home"
    >
      <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-50 ring-1 ring-brand-100">
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5 text-brand-500"
          fill="currentColor"
          aria-hidden
        >
          <path d="M12 2c3.5 4.8 6 8.4 6 12a6 6 0 1 1-12 0c0-3.6 2.5-7.2 6-12z" />
        </svg>
      </span>
      <span className="text-lg tracking-tight">
        Nutri<span className="text-brand-600">Vendo</span>
      </span>
    </Link>
  );
}
