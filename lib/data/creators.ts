import { creators as seed, TOOLS } from "@/data/seed";
import { readStore, writeStore } from "@/lib/utils";
import type { Creator, CreatorFilters } from "@/types/creator";
import type { AppUser } from "@/types/user";

// Mock data layer. Swap the bodies for real API calls later; signatures stay the same.
const KEY = "ember.creators";

export const ALL_TOOLS = TOOLS;
export const DEFAULT_FILTERS: CreatorFilters = { q: "", category: "All", tools: [], verifiedOnly: false, commercialOnly: false, sort: "top" };

const custom = () => readStore<Creator[]>(KEY, []);

export function applyFilters(list: Creator[], f: CreatorFilters): Creator[] {
  const q = f.q.trim().toLowerCase();
  const out = list.filter(
    (c) =>
      (f.category === "All" || c.category === f.category) &&
      (!q || `${c.name} ${c.headline} ${c.tools.join(" ")}`.toLowerCase().includes(q)) &&
      f.tools.every((t) => c.tools.includes(t)) &&
      (!f.verifiedOnly || c.verified) &&
      (!f.commercialOnly || c.commercialUse),
  );
  const by = {
    top: (a: Creator, b: Creator) => b.score - a.score,
    rating: (a: Creator, b: Creator) => b.rating - a.rating,
    price: (a: Creator, b: Creator) => a.startingRate - b.startingRate,
    fast: (a: Creator, b: Creator) => a.responseHours - b.responseHours,
  }[f.sort];
  return out.sort(by);
}

export async function listCreators(f: CreatorFilters = DEFAULT_FILTERS): Promise<Creator[]> {
  const merged = [...custom(), ...seed.filter((s) => !custom().some((c) => c.id === s.id))];
  return applyFilters(merged, f);
}

export async function getCreator(id: string): Promise<Creator | null> {
  return custom().find((c) => c.id === id) ?? seed.find((c) => c.id === id) ?? null;
}

export async function saveCreator(c: Creator): Promise<Creator> {
  const rest = custom().filter((x) => x.id !== c.id);
  writeStore(KEY, [c, ...rest]);
  return c;
}

export async function getCreatorForUser(user: AppUser): Promise<Creator> {
  const id = `u_${user.uid}`;
  const found = await getCreator(id);
  if (found) return found;
  return saveCreator({
    id, name: user.name, handle: user.handle, headline: "Add a one-line pitch", bio: "Tell brands what you make and how you work.",
    category: "Image", tools: [], verified: false, commercialUse: false, rating: 0, jobs: 0, startingRate: 100, responseHours: 24, location: "Online", score: 0,
  });
}
