import { briefs as seed } from "@/data/seed";
import { readStore, uid, writeStore } from "@/lib/utils";
import type { Brief, BriefInput, Match, MatchCheck } from "@/types/brief";
import type { Creator } from "@/types/creator";

const KEY = "ember.briefs";
const patches = "ember.briefs.patches";

const all = (): Brief[] => {
  const p = readStore<Record<string, Partial<Brief>>>(patches, {});
  return [...readStore<Brief[]>(KEY, []), ...seed].map((b) => ({ ...b, ...p[b.id] }));
};

export async function listBriefs(ownerId: string): Promise<Brief[]> {
  return all().filter((b) => b.ownerId === ownerId || b.ownerId === "seed");
}

export async function getBrief(id: string): Promise<Brief | null> {
  return all().find((b) => b.id === id) ?? null;
}

export async function createBrief(input: BriefInput, ownerId: string): Promise<Brief> {
  const brief: Brief = { ...input, id: uid("b"), ownerId, status: "open", progress: 10, createdAt: new Date().toISOString() };
  writeStore(KEY, [brief, ...readStore<Brief[]>(KEY, [])]);
  return brief;
}

export async function updateBrief(id: string, patch: Partial<Brief>): Promise<void> {
  const p = readStore<Record<string, Partial<Brief>>>(patches, {});
  const mine = readStore<Brief[]>(KEY, []);
  if (mine.some((b) => b.id === id)) writeStore(KEY, mine.map((b) => (b.id === id ? { ...b, ...patch } : b)));
  else writeStore(patches, { ...p, [id]: { ...p[id], ...patch } });
}

export function matchCreators(brief: Brief, creators: Creator[]): Match[] {
  return creators
    .map((creator) => {
      const checks: MatchCheck[] = [
        { label: `Works in ${brief.category}`, pass: creator.category === brief.category },
        { label: "Starting rate fits the budget", pass: creator.startingRate <= brief.budget },
        { label: brief.needsCommercialUse ? "Licensed for commercial use" : "Commercial licence (not required)", pass: !brief.needsCommercialUse || creator.commercialUse },
        { label: "Identity verified", pass: creator.verified },
        { label: "Replies within a day", pass: creator.responseHours <= 24 },
      ];
      const passed = checks.filter((c) => c.pass).length;
      const bonus = creator.id === brief.preferredCreatorId ? 8 : 0;
      return { creator, checks, score: Math.min(99, passed * 17 + Math.round(creator.rating * 2) + bonus) };
    })
    .sort((a, b) => b.score - a.score);
}
