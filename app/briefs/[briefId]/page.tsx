"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { MatchChecklist } from "@/components/brief/MatchChecklist";
import { CommercialUseBadge } from "@/components/creator/CommercialUseBadge";
import { VerificationBadge } from "@/components/creator/VerificationBadge";
import { EmptyState } from "@/components/discovery/EmptyState";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { getBrief, matchCreators, updateBrief } from "@/lib/data/briefs";
import { listCreators } from "@/lib/data/creators";
import { avatarColor, initials, money } from "@/lib/utils";
import type { Brief, BriefStatus } from "@/types/brief";
import type { Creator } from "@/types/creator";

const NEXT: Record<BriefStatus, { status: BriefStatus; progress: number; label: string } | null> = {
  open: null,
  in_progress: { status: "done", progress: 100, label: "Approve and pay" },
  done: null,
};
const LABEL: Record<BriefStatus, string> = { open: "Open", in_progress: "In progress", done: "Done" };

function Detail() {
  const { briefId } = useParams<{ briefId: string }>();
  const [brief, setBrief] = useState<Brief | null | undefined>(undefined);
  const [creators, setCreators] = useState<Creator[]>([]);

  const load = useCallback(() => getBrief(briefId).then(setBrief), [briefId]);
  useEffect(() => { load(); listCreators().then(setCreators); }, [load]);

  const matches = useMemo(() => (brief ? matchCreators(brief, creators).slice(0, 5) : []), [brief, creators]);

  if (brief === undefined) return <div className="card font-mono text-sm" aria-busy="true">Loading brief…</div>;
  if (brief === null) return <EmptyState title="Brief not found" hint="It may have been deleted." action={<Link href="/briefs" className={buttonVariants({ size: "sm" })}>Back to my briefs</Link>} />;

  const hire = async (c: Creator) => {
    await updateBrief(brief.id, { hiredCreatorId: c.id, status: "in_progress", progress: 40 });
    toast(`Hired ${c.name}. Kickoff sent`);
    load();
  };
  const advance = NEXT[brief.status];
  const hired = creators.find((c) => c.id === brief.hiredCreatorId);

  return (
    <>
      <Link href="/briefs" className={buttonVariants({ variant: "outline", size: "sm" })}>← My briefs</Link>
      <div className="mt-5 grid items-start gap-6 md:grid-cols-[1fr_1.5fr]">
        <section className="card md:sticky md:top-24">
          <Badge on={brief.status !== "open"}>{LABEL[brief.status]}</Badge>
          <h1 className="my-3 text-2xl">{brief.title}</h1>
          <p className="mb-4 text-sm opacity-80">{brief.description}</p>
          <dl className="mb-4 grid grid-cols-2 gap-3 text-sm">
            <div><dt className="lbl">Type</dt><dd>{brief.category}</dd></div>
            <div><dt className="lbl">Budget</dt><dd>{money(brief.budget)}</dd></div>
            <div><dt className="lbl">Deadline</dt><dd>{brief.deadline}</dd></div>
            <div><dt className="lbl">Licence</dt><dd>{brief.needsCommercialUse ? "Commercial use" : "Any"}</dd></div>
          </dl>
          <div className="meter" role="progressbar" aria-valuenow={brief.progress} aria-valuemin={0} aria-valuemax={100} aria-label="Progress"><i style={{ width: `${brief.progress}%` }} /></div>
          {hired && <p className="mt-3 text-sm">With <Link className="font-bold underline" href={`/creators/${hired.id}`}>{hired.name}</Link></p>}
          {advance && <Button className="mt-4 w-full" onClick={async () => { await updateBrief(brief.id, { status: advance.status, progress: advance.progress }); toast("Approved. Payment released"); load(); }}>{advance.label}</Button>}
        </section>

        <section aria-label="Matches">
          <h2 className="mb-1 text-xl">Best matches</h2>
          <p className="mb-4 text-sm opacity-70">Ranked by how many of your requirements each creator meets.</p>
          <ul className="m-0 grid list-none gap-4 p-0">
            {matches.map(({ creator: c, score, checks }) => (
              <li key={c.id} className="card">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="av h-[46px] w-[46px]" style={{ background: avatarColor(c.id) }} aria-hidden>{initials(c.name)}</div>
                  <div className="min-w-[150px] flex-1">
                    <Link href={`/creators/${c.id}`} className="font-bold hover:underline">{c.name}</Link>
                    <div className="mt-1 flex flex-wrap gap-1.5"><VerificationBadge verified={c.verified} /><CommercialUseBadge allowed={c.commercialUse} /></div>
                  </div>
                  <div className="big !text-[28px]" aria-label={`${score} percent match`}>{score}%</div>
                  <Button size="sm" disabled={brief.hiredCreatorId === c.id} onClick={() => hire(c)}>{brief.hiredCreatorId === c.id ? "Hired ✓" : "Hire"}</Button>
                </div>
                <div className="meter my-3"><i style={{ width: `${score}%` }} /></div>
                <MatchChecklist checks={checks} />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}

export default function BriefDetailPage() {
  return <ProtectedRoute><Detail /></ProtectedRoute>;
}
