import type { WorkflowStep } from "@/types/portfolio";

/** A real sequence, so numbering is meaningful here. */
export function WorkflowTimeline({ steps }: { steps: WorkflowStep[] }) {
  return (
    <ol className="relative m-0 list-none space-y-4 p-0 before:absolute before:bottom-2 before:left-[13px] before:top-2 before:w-[3px] before:bg-ink before:content-['']">
      {steps.map((s, i) => (
        <li key={s.title} className="relative flex gap-3">
          <span className="z-[1] grid h-7 w-7 flex-none place-items-center rounded-full border-[2.5px] border-ink bg-sky font-mono text-xs font-bold text-[#0a1a2e]">{i + 1}</span>
          <div>
            <div className="font-bold">{s.title}{s.tool && <span className="chip chip-static ml-2 !mb-0 !mr-0">{s.tool}</span>}</div>
            <p className="text-sm opacity-75">{s.detail}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
