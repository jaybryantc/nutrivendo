"use client";

import { useState } from "react";
import { Container, Section, Eyebrow } from "@/components/ui";
import { locations, type Location } from "@/lib/data";
import { cn } from "@/lib/cn";
import LocationsMap from "@/components/locations-map";

const types = ["All", "Gym", "Office", "Campus", "Transit"] as const;
type LocType = (typeof types)[number];

export default function LocationsPage() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<LocType>("All");
  const [activeId, setActiveId] = useState<string | null>(null);

  const filtered = locations.filter((l) => {
    const matchesType = active === "All" || l.type === active;
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      l.name.toLowerCase().includes(q) ||
      l.address.toLowerCase().includes(q) ||
      l.city.toLowerCase().includes(q);
    return matchesType && matchesQuery;
  });

  return (
    <>
      <Section className="pb-0">
        <Container>
          <Eyebrow>Locations</Eyebrow>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            A NutriVendo machine near you.
          </h1>
          <p className="mt-4 text-muted max-w-2xl">
            Search by city, address, or venue. Every machine restocks daily.
          </p>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <svg
                viewBox="0 0 24 24"
                className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.3-4.3" />
              </svg>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by city, address, or venue"
                className="w-full h-12 rounded-full border border-border bg-white pl-11 pr-4 text-sm placeholder:text-muted focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {types.map((t) => (
                <button
                  key={t}
                  onClick={() => setActive(t)}
                  className={cn(
                    "h-10 rounded-full px-4 text-sm font-medium transition-colors",
                    active === t
                      ? "bg-brand-500 text-white"
                      : "bg-white text-foreground border border-border hover:bg-surface"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.2fr]">
            <div className="space-y-3">
              {filtered.length === 0 && (
                <p className="text-muted text-sm">
                  No machines match that search yet. Try a different city.
                </p>
              )}
              {filtered.map((l) => (
                <LocationCard
                  key={l.id}
                  location={l}
                  active={activeId === l.id}
                  onHover={(hovered) => setActiveId(hovered ? l.id : null)}
                />
              ))}
            </div>

            <LocationsMap
              fitBounds
              locations={filtered}
              activeId={activeId}
              onMarkerClick={(id) => {
                setActiveId(id);
                const el = document.getElementById(`loc-${id}`);
                el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
              }}
              className="min-h-[500px] lg:min-h-0 lg:h-full"
            />
          </div>
        </Container>
      </Section>
    </>
  );
}

function LocationCard({
  location: l,
  active,
  onHover,
}: {
  location: Location;
  active: boolean;
  onHover: (hovered: boolean) => void;
}) {
  return (
    <div
      id={`loc-${l.id}`}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      className={cn(
        "rounded-2xl border bg-white p-5 shadow-sm transition-all",
        active
          ? "border-brand-500 ring-2 ring-brand-500/30"
          : "border-border hover:border-brand-200"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-brand-700">
            {l.type}
          </p>
          <h3 className="mt-1 font-semibold">{l.name}</h3>
          <p className="text-sm text-muted">
            {l.address}, {l.city}
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-medium text-brand-700">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
          Open
        </span>
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <p className="text-xs text-muted">{l.hours}</p>
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${l.lat},${l.lng}`}
          target="_blank"
          rel="noreferrer"
          className="text-sm font-medium text-brand-700 hover:text-brand-800"
        >
          Get directions →
        </a>
      </div>
    </div>
  );
}
