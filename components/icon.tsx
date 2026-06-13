import { cn } from "@/lib/cn";

/**
 * Material Symbols Outlined icon.
 * The icon font is loaded in app/layout.tsx and styled in globals.css.
 */
export default function Icon({
  name,
  size = 24,
  filled = false,
  className = "",
  ...rest
}: {
  name: string;
  size?: number;
  filled?: boolean;
  className?: string;
} & Omit<React.HTMLAttributes<HTMLSpanElement>, "children">) {
  return (
    <span
      aria-hidden
      className={cn("material-symbols-outlined", filled && "filled", className)}
      style={{ fontSize: size, ...((rest.style as object) ?? {}) }}
      {...rest}
    >
      {name}
    </span>
  );
}
