import Link from "next/link";
import type { ReactNode } from "react";

export default function AuthShell({
  title,
  subtitle,
  footer,
  children,
}: {
  title: string;
  subtitle?: string;
  footer?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="min-h-[calc(100vh-8rem)] grid place-items-center bg-gradient-to-b from-brand-50 to-background py-16">
      <div className="w-full max-w-md px-4">
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold"
          >
            <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-50 ring-1 ring-brand-100">
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 text-brand-500"
                fill="currentColor"
                aria-hidden
              >
                <path d="M12 2c3.5 4.8 6 8.4 6 12a6 6 0 1 1-12 0c0-3.6 2.5-7.2 6-12z" />
              </svg>
            </span>
            Nutri<span className="text-brand-600">Vendo</span>
          </Link>
        </div>
        <div className="mt-8 rounded-3xl border border-border bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-muted">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </div>
        {footer && (
          <p className="mt-6 text-center text-sm text-muted">{footer}</p>
        )}
      </div>
    </section>
  );
}
