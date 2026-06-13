import type { ReactNode } from "react";
import Logo from "@/components/logo";

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
    <section className="min-h-[calc(100vh-8rem)] grid place-items-center bg-surface py-16">
      <div className="w-full max-w-md px-4">
        <div className="flex justify-center">
          <Logo className="[&_img]:h-24" />
        </div>
        <div className="mt-8 product-card-shadow rounded-xl bg-surface-container-lowest p-8">
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-on-surface-variant">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </div>
        {footer && (
          <p className="mt-6 text-center text-sm text-on-surface-variant">{footer}</p>
        )}
      </div>
    </section>
  );
}
