"use client";

import { useEffect, useState } from "react";

type Listener = (msg: string) => void;
const listeners = new Set<Listener>();

/** toast("Saved") from anywhere in client code. */
export const toast = (msg: string) => listeners.forEach((l) => l(msg));

export function Toaster() {
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const l: Listener = (m) => {
      setMsg(m);
      clearTimeout(t);
      t = setTimeout(() => setMsg(null), 2600);
    };
    listeners.add(l);
    return () => { listeners.delete(l); clearTimeout(t); };
  }, []);

  if (!msg) return null;
  return (
    <div role="status" className="fixed bottom-[calc(24px+env(safe-area-inset-bottom,0px))] left-1/2 z-[70] -translate-x-1/2 rounded-xl border-[2.5px] border-sky bg-ink px-[18px] py-3 font-mono text-[13px] font-bold text-paper" style={{ animation: "tin .3s" }}>
      {msg}
    </div>
  );
}
