"use client";

import { useState } from "react";
import { Container, Section, Eyebrow, Input } from "@/components/ui";
import Icon from "@/components/icon";
import { locations, type Location } from "@/lib/data";
import { cn } from "@/lib/cn";
import LocationsMap from "@/components/locations-map";

const types = ["All", "Gym", "Office", "Campus", "Transit"] as const;
type LocType = (typeof types)[number];

const typeIcons: Record<string, string> = {
  Gym: "fitness_center",
  Office: "business",
  Campus: "school",
  Transit: "train",
};

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
      <Section className="pb-0 lg:pb-0 lg:pt-12">
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

      <Section className="lg:pt-12">
        <Container>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Icon
                name="search"
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
              />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by city, address, or venue"
                className="h-12 rounded-full pl-11"
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
                      ? "bg-primary text-on-primary"
                      : "bg-surface-container-low text-on-surface-variant hover:bg-secondary-container hover:text-on-secondary-container"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:mt-10 lg:gap-10 lg:grid-cols-[1fr_1.2fr]">
            <div className="order-2 space-y-3 lg:order-1">
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
              className="order-1 h-[55vh] min-h-[320px] lg:order-2 lg:h-full lg:min-h-0"
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
        "product-card-shadow rounded-xl bg-surface-container-lowest p-5 transition-all",
        active && "ring-2 ring-primary/30"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-primary-container text-on-primary-container">
            <Icon name={typeIcons[l.type] ?? "location_on"} size={20} />
          </span>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-primary">
              {l.type}
            </p>
            <h3 className="mt-1 font-semibold">{l.name}</h3>
            <p className="flex items-center gap-1 text-sm text-on-surface-variant">
              <Icon name="location_on" size={16} className="flex-none" />
              {l.address}, {l.city}
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary-container px-2.5 py-1 text-[11px] font-medium text-on-secondary-container">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Open
        </span>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-t border-outline-variant pt-4">
        <p className="flex items-center gap-1 text-xs text-on-surface-variant">
          <Icon name="schedule" size={16} className="flex-none" />
          {l.hours}
        </p>
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${l.lat},${l.lng}`}
          target="_blank"
          rel="noreferrer"
          className="text-sm font-medium text-primary hover:underline"
        >
          Get directions →
        </a>
      </div>
    </div>
  );
}
