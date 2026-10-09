"use client";

import { useMemo, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn, money } from "@/lib/utils";
import { CATEGORIES, type Category, type Creator } from "@/types/creator";
import type { BriefInput } from "@/types/brief";

const DEADLINES = ["24 hours", "3 days", "1 week", "2 weeks"];
const CLARITY_WORDS = ["mood", "colour", "color", "brand", "audience", "size", "tone", "style", "format", "reference"];

/** Rough clarity score so briefs get specific before creators see them. */
export function clarity(text: string) {
  const hits = CLARITY_WORDS.filter((w) => text.toLowerCase().includes(w)).length;
  return Math.min(100, Math.round(text.length / 2.5 + hits * 14));
}

export function BriefForm({ preferred, onSubmit }: { preferred?: Creator | null; onSubmit: (input: BriefInput) => Promise<void> }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Category>(preferred?.category ?? "Image");
  const [budget, setBudget] = useState(300);
  const [deadline, setDeadline] = useState("3 days");
  const [description, setDescription] = useState("");
  const [commercial, setCommercial] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const score = useMemo(() => clarity(description), [description]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return setError("Give the brief a title so creators know what it's about.");
    if (description.trim().length < 20) return setError("Add a few more details: mood, colours, audience or size.");
    setError("");
    setBusy(true);
    await onSubmit({ title: title.trim(), category, budget, deadline, description: description.trim(), needsCommercialUse: commercial, preferredCreatorId: preferred?.id });
    setBusy(false);
  }

  return (
    <form onSubmit={submit} className="grid items-start gap-6 md:grid-cols-[1.4fr_1fr]" noValidate>
      <div className="card">
        {preferred && <p className="chip chip-static">For {preferred.name}</p>}
        <Label htmlFor="title">Title</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Sneaker drop hero shots" />

        <div className="lbl mb-2">What do you need?</div>
        <div className="mb-3.5">
          {CATEGORIES.map((c) => <button type="button" key={c} aria-pressed={category === c} onClick={() => setCategory(c)} className={cn("chip", category === c && "chip-on")}>{c}</button>)}
        </div>

        <Label htmlFor="budget">Budget: {money(budget)}</Label>
        <input id="budget" type="range" min={50} max={2000} step={50} value={budget} onChange={(e) => setBudget(+e.target.value)} className="field !border-0 !p-0 accent-[var(--sky)]" />

        <Label htmlFor="deadline">Deadline</Label>
        <select id="deadline" className="field" value={deadline} onChange={(e) => setDeadline(e.target.value)}>{DEADLINES.map((d) => <option key={d}>{d}</option>)}</select>

        <Label htmlFor="desc">Describe the vibe</Label>
        <Textarea id="desc" rows={5} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Mood, colours, audience, size, tone…" />

        <div className="mb-4 flex items-center justify-between gap-3">
          <span className="lbl">Needs commercial-use licence</span>
          <Switch label="Needs commercial-use licence" checked={commercial} onChange={setCommercial} />
        </div>

        {error && <p role="alert" className="mb-3 font-mono text-sm font-bold text-[#d6336c]">{error}</p>}
        <Button type="submit" disabled={busy}>{busy ? "Posting…" : "Post brief"}</Button>
      </div>

      <aside className="card md:sticky md:top-24" aria-live="polite">
        <div className="lbl">Clarity check</div>
        <div className="big">{score}%</div>
        <div className="meter"><i style={{ width: `${score}%` }} /></div>
        <p className="mt-3 text-sm opacity-75">
          {score < 35 ? "Too vague. Add mood, colours and who it's for." : score < 70 ? "Getting there. Mention size, tone or a reference." : "Clear. Creators can quote straight away."}
        </p>
      </aside>
    </form>
  );
}
