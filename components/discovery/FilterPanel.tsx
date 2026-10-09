"use client";

import { Input, Label } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ALL_TOOLS } from "@/lib/data/creators";
import { cn } from "@/lib/utils";
import { CATEGORIES, type CreatorFilters, type SortKey } from "@/types/creator";

interface Props { filters: CreatorFilters; onChange: (patch: Partial<CreatorFilters>) => void; onReset: () => void; count: number }

const SORTS: { id: SortKey; label: string }[] = [
  { id: "top", label: "Leaderboard rank" },
  { id: "rating", label: "Highest rated" },
  { id: "price", label: "Lowest rate" },
  { id: "fast", label: "Fastest reply" },
];

export function FilterPanel({ filters: f, onChange, onReset, count }: Props) {
  const toggleTool = (t: string) => onChange({ tools: f.tools.includes(t) ? f.tools.filter((x) => x !== t) : [...f.tools, t] });
  return (
    <aside aria-label="Filters" className="card h-fit lg:sticky lg:top-24">
      <Label htmlFor="q">Search</Label>
      <Input id="q" type="search" placeholder="Name, style or tool" value={f.q} onChange={(e) => onChange({ q: e.target.value })} />

      <div className="lbl mb-2">Category</div>
      <div className="mb-3">
        {(["All", ...CATEGORIES] as const).map((c) => (
          <button key={c} onClick={() => onChange({ category: c })} aria-pressed={f.category === c} className={cn("chip", f.category === c && "chip-on")}>{c}</button>
        ))}
      </div>

      <div className="lbl mb-2">Tools</div>
      <div className="mb-3">
        {ALL_TOOLS.map((t) => (
          <button key={t} onClick={() => toggleTool(t)} aria-pressed={f.tools.includes(t)} className={cn("chip", f.tools.includes(t) && "chip-on")}>{t}</button>
        ))}
      </div>

      <div className="mb-3 flex items-center justify-between"><span className="lbl">Verified only</span><Switch label="Verified only" checked={f.verifiedOnly} onChange={(v) => onChange({ verifiedOnly: v })} /></div>
      <div className="mb-4 flex items-center justify-between"><span className="lbl">Commercial use</span><Switch label="Commercial use only" checked={f.commercialOnly} onChange={(v) => onChange({ commercialOnly: v })} /></div>

      <Label htmlFor="sort">Sort by</Label>
      <select id="sort" className="field" value={f.sort} onChange={(e) => onChange({ sort: e.target.value as SortKey })}>
        {SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
      </select>

      <div className="flex items-center justify-between">
        <span className="font-mono text-xs" aria-live="polite">{count} creator{count === 1 ? "" : "s"}</span>
        <button className="btn btn-w btn-s" onClick={onReset}>Clear filters</button>
      </div>
    </aside>
  );
}
