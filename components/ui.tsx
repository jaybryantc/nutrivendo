import { cn } from "@/lib/cn";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </div>
  );
}

export function Section({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("py-16 sm:py-20 lg:py-24", className)}>
      {children}
    </section>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
      {children}
    </p>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "product-card-shadow rounded-xl bg-surface-container-lowest p-6",
        className
      )}
    >
      {children}
    </div>
  );
}

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-on-primary hover:bg-brand-700 shadow-sm focus-visible:ring-primary/40",
  secondary:
    "bg-transparent text-primary border-2 border-primary hover:bg-brand-50 focus-visible:ring-primary/30",
  ghost:
    "bg-transparent text-primary hover:bg-brand-50 focus-visible:ring-primary/30",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm rounded-full",
  md: "h-11 px-5 text-sm rounded-full",
  lg: "h-12 px-8 text-base rounded-full",
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...rest
}: ComponentPropsWithoutRef<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50 disabled:pointer-events-none",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...rest}
    />
  );
}

export function Input({
  className = "",
  ...rest
}: ComponentPropsWithoutRef<"input">) {
  return (
    <input
      className={cn(
        "w-full h-11 rounded-lg border border-outline-variant bg-surface-container-low px-4 text-sm placeholder:text-muted focus:border-primary focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/20",
        className
      )}
      {...rest}
    />
  );
}

export function Textarea({
  className = "",
  ...rest
}: ComponentPropsWithoutRef<"textarea">) {
  return (
    <textarea
      className={cn(
        "w-full rounded-lg border border-outline-variant bg-surface-container-low px-4 py-3 text-sm placeholder:text-muted focus:border-primary focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/20",
        className
      )}
      {...rest}
    />
  );
}

export function Label({
  children,
  htmlFor,
  className = "",
}: {
  children: ReactNode;
  htmlFor?: string;
  className?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        "block text-sm font-medium text-foreground mb-1.5",
        className
      )}
    >
      {children}
    </label>
  );
}
