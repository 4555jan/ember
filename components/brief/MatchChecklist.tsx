import { cn } from "@/lib/utils";
import type { MatchCheck } from "@/types/brief";

export function MatchChecklist({ checks }: { checks: MatchCheck[] }) {
  return (
    <ul className="m-0 list-none space-y-1 p-0 text-sm">
      {checks.map((c) => (
        <li key={c.label} className={cn("flex items-center gap-2", !c.pass && "opacity-55")}>
          <span aria-hidden className={cn("grid h-5 w-5 place-items-center rounded-full border-2 border-ink text-[11px] font-bold", c.pass ? "bg-sky text-[#0a1a2e]" : "bg-card")}>{c.pass ? "✓" : "–"}</span>
          <span><span className="sr-only">{c.pass ? "Met: " : "Not met: "}</span>{c.label}</span>
        </li>
      ))}
    </ul>
  );
}
