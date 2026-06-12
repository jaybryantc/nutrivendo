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
    <div className="space-y-4 rounded-xl bg-surface p-4">
      {addOnGroups.map((group) => (
        <div key={group}>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            {group}
          </p>
          <div className="mt-2 space-y-1.5">
            {addOns
              .filter((a) => a.group === group)
              .map((a) => (
                <label
                  key={a.id}
                  className="flex cursor-pointer items-center justify-between gap-3 -mx-1 rounded-lg px-1 py-1.5 text-sm hover:bg-white/60 active:bg-white"
                >
                  <span className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selected.includes(a.id)}
                      onChange={() => onToggle(a.id)}
                      className="h-5 w-5 rounded border-border text-brand-500 focus:ring-brand-500"
                    />
                    {a.name}
                  </span>
                  <span className="text-muted">+${a.price.toFixed(2)}</span>
                </label>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
