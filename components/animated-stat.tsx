"use client";

import { useEffect, useRef, useState } from "react";

const DURATION_MS = 1200;

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export default function AnimatedStat({
  value,
  suffix = "",
  label,
}: {
  value: number;
  suffix?: string;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced || typeof IntersectionObserver === "undefined") {
      setDisplay(value);
      setStarted(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
          const start = performance.now();
          const animate = (now: number) => {
            const t = Math.min(1, (now - start) / DURATION_MS);
            setDisplay(Math.round(easeOutCubic(t) * value));
            if (t < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value, started]);

  return (
    <div ref={ref}>
      <p
        className="text-2xl font-semibold text-foreground tabular-nums"
        aria-label={`${value}${suffix} ${label}`}
      >
        {display}
        {suffix}
      </p>
      <p className="text-xs text-muted">{label}</p>
    </div>
  );
}
