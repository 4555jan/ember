"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CommercialUseBadge } from "@/components/creator/CommercialUseBadge";
import { ToolBadge } from "@/components/creator/ToolBadge";
import { VerificationBadge } from "@/components/creator/VerificationBadge";
import { EmptyState } from "@/components/discovery/EmptyState";
import { PortfolioGrid } from "@/components/portfolio/PortfolioGrid";
import { PortfolioViewer } from "@/components/portfolio/PortfolioViewer";
import { Button, buttonVariants } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { getCreator } from "@/lib/data/creators";
import { listPortfolio } from "@/lib/data/portfolios";
import { avatarColor, initials, money, readStore, writeStore } from "@/lib/utils";
import type { Creator } from "@/types/creator";
import type { PortfolioItem } from "@/types/portfolio";

export default function CreatorProfilePage() {
  const { creatorId } = useParams<{ creatorId: string }>();
  const [creator, setCreator] = useState<Creator | null | undefined>(undefined);
  const [works, setWorks] = useState<PortfolioItem[]>([]);
  const [open, setOpen] = useState<PortfolioItem | null>(null);
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    getCreator(creatorId).then(setCreator);
    listPortfolio(creatorId).then(setWorks);
    setFollowing(readStore<string[]>("ember.following", []).includes(creatorId));
  }, [creatorId]);

  if (creator === undefined) return <div className="card font-mono text-sm" aria-busy="true">Loading profile…</div>;
  if (creator === null) return <EmptyState title="Creator not found" hint="That profile doesn't exist or was removed." action={<Link href="/creators" className={buttonVariants({ size: "sm" })}>Browse creators</Link>} />;

  const toggleFollow = () => {
    const list = readStore<string[]>("ember.following", []);
    const next = following ? list.filter((x) => x !== creator.id) : [...list, creator.id];
    writeStore("ember.following", next);
    setFollowing(!following);
    toast(following ? "Unfollowed" : `Following ${creator.name}`);
  };

  return (
    <>
      <Link href="/creators" className={buttonVariants({ variant: "outline", size: "sm" })}>← All creators</Link>
      <div className="mt-5 grid items-start gap-6 md:grid-cols-[1fr_1.2fr]">
        <section className="card">
          <div className="av h-[84px] w-[84px] text-3xl" style={{ background: avatarColor(creator.id) }} aria-hidden>{initials(creator.name)}</div>
          <h1 className="mb-1 mt-4 text-3xl">{creator.name}</h1>
          <p className="font-mono text-xs opacity-70">{creator.handle} · {creator.location}</p>
          <p className="mt-3 font-bold">{creator.headline}</p>
          <p className="mt-1 text-sm opacity-80">{creator.bio}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <VerificationBadge verified={creator.verified} />
            <CommercialUseBadge allowed={creator.commercialUse} />
            <ToolBadge tool={creator.category} className="!bg-sky" />
            {creator.tools.map((t) => <ToolBadge key={t} tool={t} />)}
          </div>
          <dl className="my-5 grid grid-cols-3 gap-2 text-center">
            {[[creator.rating ? `${creator.rating}★` : "New", "rating"], [String(creator.jobs), "briefs"], [money(creator.startingRate), "from"]].map(([v, l]) => (
              <div key={l}><dd className="big !text-3xl">{v}</dd><dt className="text-xs opacity-65">{l}</dt></div>
            ))}
          </dl>
          <div className="flex gap-3">
            <Link href={`/briefs/create?creator=${creator.id}`} className={buttonVariants({ className: "flex-1" })}>Hire {creator.name.split(" ")[0]}</Link>
            <Button variant="outline" onClick={toggleFollow} aria-pressed={following}>{following ? "✓ Following" : "+ Follow"}</Button>
          </div>
          <p className="mt-3 font-mono text-xs opacity-65">Usually replies within {creator.responseHours}h</p>
        </section>

        <section aria-label="Portfolio">
          <h2 className="mb-1 text-xl">Portfolio</h2>
          <p className="mb-3 text-sm opacity-70">Open a piece to see the prompt, tools and step-by-step workflow.</p>
          {works.length ? <PortfolioGrid items={works} onSelect={setOpen} /> : <EmptyState title="No work published yet" hint="This creator hasn't added portfolio pieces. You can still send them a brief." />}
        </section>
      </div>
      <PortfolioViewer item={open} onClose={() => setOpen(null)} />
    </>
  );
}
