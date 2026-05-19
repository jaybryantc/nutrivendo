"use client";

import dynamic from "next/dynamic";
import type { Location } from "@/lib/data";

const MapInner = dynamic(() => import("./locations-map-inner"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full animate-pulse bg-surface" />
  ),
});

export default function LocationsMap(props: {
  locations: Location[];
  activeId?: string | null;
  onMarkerClick?: (id: string) => void;
  className?: string;
  fitBounds?: boolean;
}) {
  const { className, ...rest } = props;
  return (
    <div
      className={
        "relative overflow-hidden rounded-3xl border border-border bg-surface " +
        (className ?? "")
      }
    >
      <MapInner {...rest} />
    </div>
  );
}
