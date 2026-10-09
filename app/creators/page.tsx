import type { Metadata } from "next";
import { Suspense } from "react";
import { CreatorExplorer } from "@/components/discovery/CreatorExplorer";

export const metadata: Metadata = { title: "Creators" };

export default function CreatorsPage() {
  return (
    <>
      <h1 className="mb-5 text-3xl">Find your creator</h1>
      {/* CreatorExplorer reads the URL with useSearchParams, which needs a Suspense boundary. */}
      <Suspense fallback={<div className="card font-mono text-sm" aria-busy="true">Loading creators…</div>}>
        <CreatorExplorer />
      </Suspense>
    </>
  );
}
