"use client";

import { cn } from "@/lib/utils";

export interface TabItem { id: string; label: string }

export function Tabs({ tabs, value, onChange, className }: { tabs: TabItem[]; value: string; onChange: (id: string) => void; className?: string }) {
  return (
    <div role="tablist" className={cn("mb-4", className)}>
      {tabs.map((t) => (
        <button key={t.id} role="tab" aria-selected={value === t.id} onClick={() => onChange(t.id)} className={cn("chip", value === t.id && "chip-on")}>
          {t.label}
        </button>
      ))}
    </div>
  );
}
