import Link from "next/link";
import { avatarColor, cn, initials, money } from "@/lib/utils";
import type { Creator } from "@/types/creator";
import { VerificationBadge } from "./VerificationBadge";
import { ToolBadge } from "./ToolBadge";

export function CreatorCard({ creator: c, className }: { creator: Creator; className?: string }) {
  return (
    <Link href={`/creators/${c.id}`} className={cn("card block transition hover:-translate-x-[3px] hover:-translate-y-[3px] hover:-rotate-1 hover:shadow-zine-sky", className)}>
      <div className="flex items-center gap-3">
        <div className="av h-[52px] w-[52px] text-lg" style={{ background: avatarColor(c.id) }} aria-hidden>{initials(c.name)}</div>
        <div className="min-w-0">
          <div className="truncate font-bold">{c.name}</div>
          <div className="truncate text-[13px] opacity-65">{c.headline}</div>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        <ToolBadge tool={c.category} className="!bg-sky" />
        {c.tools.slice(0, 2).map((t) => <ToolBadge key={t} tool={t} />)}
      </div>
      <div className="mt-3.5 flex items-center gap-3 text-sm">
        <VerificationBadge verified={c.verified} />
        <span className="flex-1" />
        <b>{c.rating ? `${c.rating}★` : "New"}</b>
        <b>from {money(c.startingRate)}</b>
      </div>
    </Link>
  );
}
