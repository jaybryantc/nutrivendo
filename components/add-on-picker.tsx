"use client";

import { addOns, addOnGroups } from "@/lib/data";

/**
 * Grouped add-on checkboxes (Bases / Boosters / Superfoods). Shared by the
 * menu product card and the cart line editor.
 */
export default function AddOnPicker({
  selected,
  onToggle,
}: {
  selected: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <div className="space-y-4 rounded-xl bg-surface-container-low p-4">
      {addOnGroups.map((group) => (
        <div key={group}>
          <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
            {group}
          </p>
          <div className="mt-2 space-y-1.5">
            {addOns
              .filter((a) => a.group === group)
              .map((a) => {
                const isSelected = selected.includes(a.id);
                return (
                  <label
                    key={a.id}
                    className={`flex cursor-pointer items-center justify-between gap-3 -mx-1 rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                      isSelected
                        ? "border-primary bg-primary-container text-on-primary-container"
                        : "border-outline-variant hover:bg-surface-container-lowest"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggle(a.id)}
                        className="h-5 w-5 shrink-0 rounded border-outline-variant accent-primary text-primary focus:ring-primary"
                      />
                      {a.name}
                    </span>
                    <span className={`shrink-0 pl-3 text-right tabular-nums ${isSelected ? "text-on-primary-container" : "text-on-surface-variant"}`}>
                      +${a.price.toFixed(2)}
                    </span>
                  </label>
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
}
