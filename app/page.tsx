"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { EmptyState } from "@/components/discovery/EmptyState";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { listBriefs } from "@/lib/data/briefs";
import { money } from "@/lib/utils";
import type { Brief, BriefStatus } from "@/types/brief";

const STATUS_LABEL: Record<BriefStatus, string> = { open: "Open", in_progress: "In progress", done: "Done" };
const TABS = [{ id: "all", label: "All" }, { id: "open", label: "Open" }, { id: "in_progress", label: "In progress" }, { id: "done", label: "Done" }];

function List() {
  const { user } = useAuth();
  const [briefs, setBriefs] = useState<Brief[] | null>(null);
  const [tab, setTab] = useState("all");

  useEffect(() => { if (user) listBriefs(user.uid).then(setBriefs); }, [user]);

  const shown = (briefs ?? []).filter((b) => tab === "all" || b.status === tab);
  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl">My briefs</h1>
        <Link href="/briefs/create" className={buttonVariants({ size: "sm" })}>New brief</Link>
      </div>
      <Tabs tabs={TABS} value={tab} onChange={setTab} />
      {briefs === null ? <div className="card font-mono text-sm" aria-busy="true">Loading briefs…</div> : shown.length === 0 ? (
        <EmptyState title="Nothing in this view yet" hint="Post a brief and creators who fit will show up as matches." action={<Link href="/briefs/create" className={buttonVariants({ size: "sm" })}>Post a brief</Link>} />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((b) => (
            <Link key={b.id} href={`/briefs/${b.id}`} className="card block transition hover:-translate-y-[3px] hover:-rotate-1 hover:shadow-zine-sky">
              <div className="mb-2 flex items-start justify-between gap-2"><h2 className="text-base">{b.title}</h2><Badge on={b.status !== "open"}>{STATUS_LABEL[b.status]}</Badge></div>
              <p className="mb-3 text-sm opacity-70">{b.category} · {money(b.budget)} · {b.deadline}</p>
              <div className="meter" role="progressbar" aria-valuenow={b.progress} aria-valuemin={0} aria-valuemax={100} aria-label="Progress"><i style={{ width: `${b.progress}%` }} /></div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

export default function BriefsPage() {
  return <ProtectedRoute><List /></ProtectedRoute>;
}
