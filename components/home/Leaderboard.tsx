"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { creators as seed } from "@/data/seed";
import { avatarColor, initials } from "@/lib/utils";

/** Weekly points. Scores tick up on a timer to show the board is alive; swap for a live data source later. */
export function Leaderboard() {
  const [scores, setScores] = useState(() => Object.fromEntries(seed.map((c) => [c.id, c.score])));
  const [flash, setFlash] = useState<string | null>(null);

  useEffect(() => {
    const id = setInterval(() => {
      const c = seed[Math.floor(Math.random() * seed.length)];
      setScores((s) => ({ ...s, [c.id]: s[c.id] + 20 + Math.floor(Math.random() * 90) }));
      setFlash(c.id);
      setTimeout(() => setFlash(null), 600);
    }, 2200);
    return () => clearInterval(id);
  }, []);

  const rows = [...seed].sort((a, b) => scores[b.id] - scores[a.id]).slice(0, 6);
  return (
    <ol className="card m-0 list-none p-4">
      {rows.map((c, i) => (
        <li key={c.id} className={`flex items-center gap-3 border-b-2 border-dashed border-ink px-1 py-2.5 last:border-0 ${flash === c.id ? "bg-mist text-[#0a1a2e]" : ""}`}>
          <span className="w-8 font-display text-xl text-sky">{i + 1}</span>
          <div className="av h-10 w-10 text-sm" style={{ background: avatarColor(c.id) }} aria-hidden>{initials(c.name)}</div>
          <Link href={`/creators/${c.id}`} className="min-w-0 flex-1 hover:underline">
            <b>{c.name}</b>
            <div className="truncate text-[13px] opacity-65">{c.headline}</div>
          </Link>
          <b className="font-display text-xl text-sky [-webkit-text-stroke:1px_var(--ink)]">{scores[c.id].toLocaleString()}</b>
        </li>
      ))}
    </ol>
  );
}
