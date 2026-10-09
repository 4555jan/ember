"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CreatorCard } from "@/components/creator/CreatorCard";
import { buttonVariants } from "@/components/ui/button";
import { DEFAULT_FILTERS, listCreators } from "@/lib/data/creators";
import { CATEGORIES, type Creator, type CreatorFilters, type SortKey } from "@/types/creator";
import { EmptyState } from "./EmptyState";
import { FilterPanel } from "./FilterPanel";

/** Filters live in the URL, so a search can be shared. useSearchParams requires the Suspense in the page. */
export function CreatorExplorer() {
  const router = useRouter();
  const sp = useSearchParams();
  const [list, setList] = useState<Creator[] | null>(null);

  const filters: CreatorFilters = useMemo(() => {
    const cat = sp.get("cat");
    return {
      q: sp.get("q") ?? "",
      category: CATEGORIES.includes(cat as never) ? (cat as CreatorFilters["category"]) : "All",
      tools: sp.get("tools")?.split(",").filter(Boolean) ?? [],
      verifiedOnly: sp.get("verified") === "1",
      commercialOnly: sp.get("commercial") === "1",
      sort: (["top", "rating", "price", "fast"].includes(sp.get("sort") ?? "") ? sp.get("sort") : "top") as SortKey,
    };
  }, [sp]);

  useEffect(() => {
    let live = true;
    listCreators(filters).then((r) => live && setList(r));
    return () => { live = false; };
  }, [filters]);

  const push = (f: CreatorFilters) => {
    const p = new URLSearchParams();
    if (f.q) p.set("q", f.q);
    if (f.category !== "All") p.set("cat", f.category);
    if (f.tools.length) p.set("tools", f.tools.join(","));
    if (f.verifiedOnly) p.set("verified", "1");
    if (f.commercialOnly) p.set("commercial", "1");
    if (f.sort !== "top") p.set("sort", f.sort);
    const qs = p.toString();
    router.replace(qs ? `/creators?${qs}` : "/creators", { scroll: false });
  };

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[280px_1fr]">
      <FilterPanel filters={filters} count={list?.length ?? 0} onChange={(patch) => push({ ...filters, ...patch })} onReset={() => push(DEFAULT_FILTERS)} />
      <section aria-label="Results">
        {list === null ? (
          <div className="card font-mono text-sm" aria-busy="true">Loading creators…</div>
        ) : list.length === 0 ? (
          <EmptyState title="No creators match those filters" hint="Remove a tool or switch off verified-only to widen the search."
            action={<button className={buttonVariants({ variant: "outline", size: "sm" })} onClick={() => push(DEFAULT_FILTERS)}>Clear filters</button>} />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{list.map((c) => <CreatorCard key={c.id} creator={c} />)}</div>
        )}
        <p className="mt-6 text-sm opacity-70">Can&apos;t find the right fit? <Link href="/briefs/create" className="font-bold underline">Post a brief</Link> and let creators come to you.</p>
      </section>
    </div>
  );
}
