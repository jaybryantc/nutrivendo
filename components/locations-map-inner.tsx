"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useMemo } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import type { Location } from "@/lib/data";

const pinSvg = (color: string) =>
  `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="28" height="28"><path fill="${color}" transform="scale(1,-1) translate(0,-24)" d="M12 2c3.5 4.8 6 8.4 6 12a6 6 0 1 1-12 0c0-3.6 2.5-7.2 6-12z"/></svg>`;

const baseIcon = L.divIcon({
  html: pinSvg("#4ca50d"),
  className: "nv-pin",
  iconSize: [28, 28],
  iconAnchor: [14, 26],
  popupAnchor: [0, -22],
});
const activeIcon = L.divIcon({
  html: pinSvg("#216b00"),
  className: "nv-pin nv-pin-active",
  iconSize: [34, 34],
  iconAnchor: [17, 30],
  popupAnchor: [0, -26],
});

function Controller({
  locations,
  activeId,
  fitBounds,
}: {
  locations: Location[];
  activeId?: string | null;
  fitBounds?: boolean;
}) {
  const map = useMap();

  // Whenever the locations set changes the parent column often resizes;
  // Leaflet caches its container size and needs to be told to recompute.
  useEffect(() => {
    const t = window.setTimeout(() => map.invalidateSize(), 0);
    return () => window.clearTimeout(t);
  }, [map, locations]);

  // Catch any other resize (window, neighbour-column reflow, etc.)
  useEffect(() => {
    const container = map.getContainer();
    const ro = new ResizeObserver(() => map.invalidateSize());
    ro.observe(container);
    return () => ro.disconnect();
  }, [map]);

  useEffect(() => {
    if (!fitBounds || locations.length === 0) return;
    const bounds = L.latLngBounds(
      locations.map((l) => [l.lat, l.lng] as [number, number])
    );
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
  }, [map, fitBounds, locations]);

  useEffect(() => {
    if (!activeId) return;
    const loc = locations.find((l) => l.id === activeId);
    if (loc) {
      map.flyTo([loc.lat, loc.lng], Math.max(map.getZoom(), 13), {
        duration: 0.6,
      });
    }
  }, [activeId, locations, map]);

  return null;
}

export default function LocationsMapInner({
  locations,
  activeId,
  onMarkerClick,
  fitBounds,
}: {
  locations: Location[];
  activeId?: string | null;
  onMarkerClick?: (id: string) => void;
  fitBounds?: boolean;
}) {
  const center = useMemo<[number, number]>(() => [43.6532, -79.3832], []);

  return (
    <MapContainer
      center={center}
      zoom={12}
      scrollWheelZoom={false}
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions" target="_blank" rel="noreferrer">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        subdomains="abcd"
        maxZoom={20}
      />
      {locations.map((loc) => (
        <Marker
          key={loc.id}
          position={[loc.lat, loc.lng]}
          icon={activeId === loc.id ? activeIcon : baseIcon}
          eventHandlers={{
            click: () => onMarkerClick?.(loc.id),
          }}
        >
          <Popup>
            <div style={{ minWidth: 180 }}>
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: "#216b00",
                  margin: 0,
                }}
              >
                {loc.type}
              </p>
              <p
                style={{
                  fontWeight: 600,
                  margin: "2px 0 0",
                  fontSize: 14,
                }}
              >
                {loc.name}
              </p>
              <p style={{ color: "#6b7280", margin: "4px 0 0", fontSize: 12 }}>
                {loc.address}, {loc.city}
              </p>
              <p style={{ color: "#6b7280", margin: "4px 0 0", fontSize: 11 }}>
                {loc.hours}
              </p>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "inline-block",
                  marginTop: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#216b00",
                }}
              >
                Get directions →
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
      <Controller
        locations={locations}
        activeId={activeId}
        fitBounds={fitBounds}
      />
    </MapContainer>
  );
}
