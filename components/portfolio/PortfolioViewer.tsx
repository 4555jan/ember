"use client";

import { Dialog } from "@/components/ui/dialog";
import { ToolBadge } from "@/components/creator/ToolBadge";
import { CommercialUseBadge } from "@/components/creator/CommercialUseBadge";
import { artUrl } from "@/lib/utils";
import { toast } from "@/components/ui/toast";
import type { PortfolioItem } from "@/types/portfolio";
import { WorkflowTimeline } from "./WorkflowTimeline";

export function PortfolioViewer({ item, onClose }: { item: PortfolioItem | null; onClose: () => void }) {
  return (
    <Dialog open={!!item} onClose={onClose} title={item?.title ?? "Work"}>
      {item && (
        <div className="grid gap-5 md:grid-cols-2">
          <div className="aspect-square rounded-[14px] border-[2.5px] border-ink bg-cover bg-center" style={{ backgroundImage: `url(${artUrl(item.artIndex)})` }} role="img" aria-label={`Preview of ${item.title}`} />
          <div className="space-y-4">
            <div className="flex flex-wrap gap-1.5">
              <ToolBadge tool={item.category} className="!bg-sky" />
              {item.tools.map((t) => <ToolBadge key={t} tool={t} />)}
              <CommercialUseBadge allowed={item.commercialUse} />
            </div>
            <div>
              <div className="lbl mb-1">Prompt</div>
              <p className="rounded-[10px] border-2 border-dashed border-ink p-3 font-mono text-[13px]">&ldquo;{item.prompt}&rdquo;</p>
              <button className="btn btn-w btn-s mt-2" onClick={() => { navigator.clipboard?.writeText(item.prompt); toast("Prompt copied"); }}>Copy prompt</button>
            </div>
            <div>
              <div className="lbl mb-2">How it was made</div>
              <WorkflowTimeline steps={item.workflow} />
            </div>
          </div>
        </div>
      )}
    </Dialog>
  );
}
