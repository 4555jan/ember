import { portfolioItems as seed } from "@/data/seed";
import { readStore, writeStore } from "@/lib/utils";
import type { PortfolioItem } from "@/types/portfolio";

const KEY = "ember.works";
const removedKey = "ember.works.removed";

export async function listPortfolio(creatorId: string): Promise<PortfolioItem[]> {
  const removed = readStore<string[]>(removedKey, []);
  const mine = readStore<PortfolioItem[]>(KEY, []).filter((w) => w.creatorId === creatorId);
  return [...mine, ...seed.filter((w) => w.creatorId === creatorId && !removed.includes(w.id))];
}

export async function addWork(item: PortfolioItem): Promise<void> {
  writeStore(KEY, [item, ...readStore<PortfolioItem[]>(KEY, [])]);
}

export async function removeWork(id: string): Promise<void> {
  writeStore(KEY, readStore<PortfolioItem[]>(KEY, []).filter((w) => w.id !== id));
  writeStore(removedKey, [...readStore<string[]>(removedKey, []), id]);
}
