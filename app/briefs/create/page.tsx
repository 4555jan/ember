"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BriefForm } from "@/components/brief/BriefForm";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { toast } from "@/components/ui/toast";
import { useAuth } from "@/hooks/useAuth";
import { createBrief } from "@/lib/data/briefs";
import { getCreator } from "@/lib/data/creators";
import type { Creator } from "@/types/creator";

function Create() {
  const router = useRouter();
  const { user } = useAuth();
  const [preferred, setPreferred] = useState<Creator | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("creator");
    (id ? getCreator(id) : Promise.resolve(null)).then((c) => { setPreferred(c); setReady(true); });
  }, []);

  if (!ready || !user) return <div className="card font-mono text-sm" aria-busy="true">Loading…</div>;
  return (
    <>
      <h1 className="mb-5 text-3xl">New brief</h1>
      <BriefForm preferred={preferred} onSubmit={async (input) => {
        const b = await createBrief(input, user.uid);
        toast("Brief posted. Finding matches…");
        router.push(`/briefs/${b.id}`);
      }} />
    </>
  );
}

export default function CreateBriefPage() {
  return <ProtectedRoute><Create /></ProtectedRoute>;
}
