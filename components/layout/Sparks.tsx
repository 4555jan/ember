"use client";

import { useEffect } from "react";

/** Tiny ✦ burst on every click. Skipped when the visitor prefers reduced motion. */
export function Sparks() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onClick = (e: MouseEvent) => {
      for (let i = 0; i < 5; i++) {
        const s = document.createElement("span");
        s.textContent = "✦";
        s.setAttribute("aria-hidden", "true");
        s.style.cssText = `position:fixed;pointer-events:none;z-index:80;font-size:22px;color:var(--sky);left:${e.clientX}px;top:${e.clientY}px;--x:${(Math.random() - 0.5) * 110}px;--y:${(Math.random() - 0.5) * 110}px;animation:spark .8s forwards`;
        document.body.appendChild(s);
        setTimeout(() => s.remove(), 800);
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}
