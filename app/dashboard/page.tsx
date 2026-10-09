"use client";

import { useEffect, useState, type FormEvent } from "react";
import { PortfolioGrid } from "@/components/portfolio/PortfolioGrid";
import { PortfolioViewer } from "@/components/portfolio/PortfolioViewer";
import { EmptyState } from "@/components/discovery/EmptyState";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs } from "@/components/ui/tabs";
import { toast } from "@/components/ui/toast";
import { useAuth } from "@/hooks/useAuth";
import { ALL_TOOLS, getCreatorForUser, saveCreator } from "@/lib/data/creators";
import { addWork, listPortfolio, removeWork } from "@/lib/data/portfolios";
import { cn, uid } from "@/lib/utils";
import { CATEGORIES, type Category, type Creator } from "@/types/creator";
import type { PortfolioItem, WorkflowStep } from "@/types/portfolio";

const TABS = [{ id: "profile", label: "Profile" }, { id: "portfolio", label: "Portfolio" }];

function ProfileTab({ creator, onSaved }: { creator: Creator; onSaved: (c: Creator) => void }) {
  const [c, setC] = useState(creator);
  const set = <K extends keyof Creator>(k: K, v: Creator[K]) => setC((p) => ({ ...p, [k]: v }));
  const toggleTool = (t: string) => set("tools", c.tools.includes(t) ? c.tools.filter((x) => x !== t) : [...c.tools, t]);

  async function save(e: FormEvent) {
    e.preventDefault();
    onSaved(await saveCreator(c));
    toast("Profile saved");
  }

  return (
    <form onSubmit={save} className="card max-w-2xl">
      <Label htmlFor="n">Name</Label><Input id="n" value={c.name} onChange={(e) => set("name", e.target.value)} required />
      <Label htmlFor="h">Headline</Label><Input id="h" value={c.headline} onChange={(e) => set("headline", e.target.value)} />
      <Label htmlFor="b">Bio</Label><Textarea id="b" rows={4} value={c.bio} onChange={(e) => set("bio", e.target.value)} />
      <div className="lbl mb-2">Main category</div>
      <div className="mb-3">{CATEGORIES.map((k) => <button type="button" key={k} aria-pressed={c.category === k} onClick={() => set("category", k as Category)} className={cn("chip", c.category === k && "chip-on")}>{k}</button>)}</div>
      <div className="lbl mb-2">Tools you use</div>
      <div className="mb-3">{ALL_TOOLS.map((t) => <button type="button" key={t} aria-pressed={c.tools.includes(t)} onClick={() => toggleTool(t)} className={cn("chip", c.tools.includes(t) && "chip-on")}>{t}</button>)}</div>
      <Label htmlFor="r">Starting rate (USD)</Label><Input id="r" type="number" min={10} value={c.startingRate} onChange={(e) => set("startingRate", Math.max(0, +e.target.value))} />
      <div className="mb-4 flex items-center justify-between"><span className="lbl">Clients may use work commercially</span><Switch label="Commercial use" checked={c.commercialUse} onChange={(v) => set("commercialUse", v)} /></div>
      <Button type="submit">Save profile</Button>
    </form>
  );
}

function PortfolioTab({ creator }: { creator: Creator }) {
  const [works, setWorks] = useState<PortfolioItem[]>([]);
  const [open, setOpen] = useState<PortfolioItem | null>(null);
  const [title, setTitle] = useState("");
  const [prompt, setPrompt] = useState("");
  const [tools, setTools] = useState<string[]>(creator.tools.slice(0, 1));
  const [steps, setSteps] = useState("Concept: Wrote the style sheet\nGenerate: Made 20 options\nRefine: Fixed details by hand");
  const [error, setError] = useState("");

  const refresh = () => listPortfolio(creator.id).then(setWorks);
  useEffect(() => { refresh(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [creator.id]);

  async function add(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() || !prompt.trim()) return setError("Add a title and the prompt you used.");
    setError("");
    const workflow: WorkflowStep[] = steps.split("\n").map((l) => l.trim()).filter(Boolean).map((l) => {
      const [t, ...rest] = l.split(":");
      return { title: t.trim(), detail: rest.join(":").trim() || "—" };
    });
    await addWork({ id: uid("w"), creatorId: creator.id, title: title.trim(), category: creator.category, prompt: prompt.trim(), tools, artIndex: Math.floor(Math.random() * 6), commercialUse: creator.commercialUse, workflow, createdAt: new Date().toISOString() });
    setTitle(""); setPrompt("");
    toast("Work added to your portfolio");
    refresh();
  }

  return (
    <div className="grid items-start gap-6 md:grid-cols-[1.3fr_1fr]">
      <section aria-label="Your work">
        {works.length ? <PortfolioGrid items={works} onSelect={setOpen} onRemove={async (w) => { await removeWork(w.id); toast("Removed"); refresh(); }} /> : <EmptyState title="No work yet" hint="Add your first piece with its prompt and workflow. Brands open these before they hire." />}
      </section>
      <form onSubmit={add} className="card">
        <h2 className="mb-3 text-lg">Add a piece</h2>
        <Label htmlFor="wt">Title</Label><Input id="wt" value={title} onChange={(e) => setTitle(e.target.value)} />
        <Label htmlFor="wp">Prompt</Label><Textarea id="wp" rows={3} value={prompt} onChange={(e) => setPrompt(e.target.value)} />
        <div className="lbl mb-2">Tools</div>
        <div className="mb-3">{ALL_TOOLS.map((t) => <button type="button" key={t} aria-pressed={tools.includes(t)} onClick={() => setTools((p) => (p.includes(t) ? p.filter((x) => x !== t) : [...p, t]))} className={cn("chip", tools.includes(t) && "chip-on")}>{t}</button>)}</div>
        <Label htmlFor="ws">Workflow (one step per line, “Step: detail”)</Label>
        <Textarea id="ws" rows={4} value={steps} onChange={(e) => setSteps(e.target.value)} />
        {error && <p role="alert" className="mb-3 font-mono text-sm font-bold text-[#d6336c]">{error}</p>}
        <Button type="submit">Add to portfolio</Button>
      </form>
      <PortfolioViewer item={open} onClose={() => setOpen(null)} />
    </div>
  );
}

function Studio() {
  const { user } = useAuth();
  const [creator, setCreator] = useState<Creator | null>(null);
  const [tab, setTab] = useState("profile");

  useEffect(() => { if (user) getCreatorForUser(user).then(setCreator); }, [user]);
  if (!creator) return <div className="card font-mono text-sm" aria-busy="true">Opening your studio…</div>;

  return (
    <>
      <h1 className="mb-1 text-3xl">Your studio</h1>
      <p className="mb-5 text-sm opacity-70">Brands see this when they compare creators.</p>
      <Tabs tabs={TABS} value={tab} onChange={setTab} />
      {tab === "profile" ? <ProfileTab creator={creator} onSaved={setCreator} /> : <PortfolioTab creator={creator} />}
    </>
  );
}

export default function DashboardPage() {
  return <ProtectedRoute role="creator"><Studio /></ProtectedRoute>;
}
