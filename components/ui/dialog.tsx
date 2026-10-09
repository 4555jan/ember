"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function Dialog({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    ref.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-[rgba(10,26,46,.6)] p-4" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-label={title} className="card relative my-auto w-full max-w-3xl !p-0 outline-none">
        <div className="flex items-center justify-between border-b-[2.5px] border-ink bg-mist px-4 py-2.5 text-[#0a1a2e]">
          <span className="font-mono text-xs font-bold uppercase">{title}</span>
          <button onClick={onClose} aria-label="Close" className="btn btn-w btn-s !px-2.5">✕</button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
