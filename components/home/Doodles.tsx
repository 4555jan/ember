import type { CSSProperties } from "react";

type Kind = "star" | "squiggle" | "arrow" | "spiral";
const PATHS: Record<Kind, { w: number; h: number; vb: string; d: string }> = {
  star: { w: 40, h: 40, vb: "0 0 24 24", d: "M12 1 14 10 23 12 14 14 12 23 10 14 1 12 10 10Z" },
  squiggle: { w: 120, h: 24, vb: "0 0 120 20", d: "M2 10Q12 0 22 10T42 10T62 10T82 10T102 10T118 10" },
  arrow: { w: 90, h: 60, vb: "0 0 90 60", d: "M5 50C30 5 60 5 85 30M85 30 70 28M85 30 83 14" },
  spiral: { w: 50, h: 50, vb: "0 0 50 50", d: "M25 25a3 3 0 1 1 5 2 8 8 0 1 1-12-6 14 14 0 1 1 22 12" },
};

/** Hand-drawn decoration. Purely visual, hidden from assistive tech. */
export function Doodle({ kind, style }: { kind: Kind; style?: CSSProperties }) {
  const p = PATHS[kind];
  return (
    <svg className="dd" width={p.w} height={p.h} viewBox={p.vb} style={style} aria-hidden="true">
      <path d={p.d} />
    </svg>
  );
}
