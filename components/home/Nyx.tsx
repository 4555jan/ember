"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

/**
 * Nyx: an original seated mascot. Eyes and hair parallax follow the pointer,
 * the whole figure tilts a few degrees in perspective, legs swing, she blinks,
 * and clicking her waves + hops. All state is local; no external assets.
 */
export function Nyx({ onPoke }: { onPoke?: () => void }) {
  const box = useRef<HTMLDivElement>(null);
  const [look, setLook] = useState({ ox: 0, oy: 0, ry: 0, rx: 0 });
  const [blink, setBlink] = useState(false);
  const [hop, setHop] = useState(false);
  const [waving, setWaving] = useState(false);
  const [happy, setHappy] = useState(false);

  useEffect(() => {
    let raf = 0;
    const move = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = box.current?.getBoundingClientRect();
        if (!r) return;
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height * 0.36);
        const d = Math.hypot(dx, dy) || 1;
        const k = Math.min(1, d / 260);
        setLook({
          ox: (dx / d) * 4 * k,
          oy: (dy / d) * 3 * k,
          ry: Math.max(-12, Math.min(12, (e.clientX / innerWidth - 0.5) * 24)),
          rx: Math.max(-8, Math.min(8, -(e.clientY / innerHeight - 0.5) * 16)),
        });
      });
    };
    window.addEventListener("pointermove", move);
    const blinker = setInterval(() => {
      if (Math.random() < 0.7) { setBlink(true); setTimeout(() => setBlink(false), 130); }
    }, 2600);
    return () => { window.removeEventListener("pointermove", move); clearInterval(blinker); cancelAnimationFrame(raf); };
  }, []);

  const poke = () => {
    setWaving(true); setHop(true); setHappy(true);
    setTimeout(() => { setWaving(false); setHop(false); setHappy(false); }, 1300);
    onPoke?.();
  };

  const t = (x: number, y: number): CSSProperties => ({ transform: `translate(${x}px, ${y}px)` });
  const pup = t(look.ox, look.oy);
  const face = t(look.ox * 0.9, look.oy * 0.6);
  const front = t(look.ox * 0.45, look.oy * 0.3);
  const back = t(-look.ox * 0.7, -look.oy * 0.3);

  return (
    <div
      ref={box}
      className={cn("sit", waving && "waving")}
      style={{ "--ry": `${look.ry}deg`, "--rx": `${look.rx}deg` } as CSSProperties}
      onClick={poke}
      role="button"
      tabIndex={0}
      aria-label="Nyx, the Ember mascot. Press to make her wave."
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && poke()}
    >
      <svg id="girl" className={cn(hop && "hop", blink && "blink")} viewBox="0 0 220 240" aria-label="Nyx sitting on the window. Click her!"><defs><linearGradient id="hg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f3fbff"/><stop offset=".55" stopColor="#a9dcff"/><stop offset="1" stopColor="#5fb4f7"/></linearGradient><radialGradient id="sg" cx=".4" cy=".35" r=".8"><stop offset="0" stopColor="#fff3e8"/><stop offset="1" stopColor="#ffd2b8"/></radialGradient><linearGradient id="og" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff"/><stop offset="1" stopColor="#b9defa"/></linearGradient><radialGradient id="ig" cx=".5" cy=".3" r=".8"><stop offset="0" stopColor="#9be7ff"/><stop offset=".6" stopColor="#3a7bff"/><stop offset="1" stopColor="#2b2fb8"/></radialGradient></defs><ellipse cx="110" cy="237" rx="62" ry="5" fill="#0a1a2e" opacity=".22"/><g id="back" style={back}><g className="sway"><path d="M70 66C54 108 52 170 66 204L154 204C168 170 166 108 150 66Z" fill="url(#hg)" stroke="#0a1a2e" strokeWidth="3" strokeLinejoin="round"/></g></g><g className="legL"><path d="M84 184H102L100 224H86Z" fill="url(#sg)" stroke="#0a1a2e" strokeWidth="3" strokeLinejoin="round"/><path d="M85 204H101L100.4 214H85.6Z" fill="#fff"/><path d="M85.3 209H100.7" stroke="#1ea7ff" strokeWidth="3"/><path d="M82 222H104Q108 232 102 235H84 Q78 232 82 222Z" fill="#1ea7ff" stroke="#0a1a2e" strokeWidth="3" strokeLinejoin="round"/></g><g className="legR"><path d="M118 184H136L134 224H120Z" fill="url(#sg)" stroke="#0a1a2e" strokeWidth="3" strokeLinejoin="round"/><path d="M119 204H135L134.4 214H119.6Z" fill="#fff"/><path d="M119.3 209H134.7" stroke="#1ea7ff" strokeWidth="3"/><path d="M116 222H138Q142 232 136 235H118 Q112 232 116 222Z" fill="#1ea7ff" stroke="#0a1a2e" strokeWidth="3" strokeLinejoin="round"/></g><rect x="101" y="104" width="18" height="24" fill="url(#sg)" stroke="#0a1a2e" strokeWidth="3"/><path d="M68 128Q110 108 152 128L160 186Q110 202 60 186Z" fill="url(#og)" stroke="#0a1a2e" strokeWidth="3" strokeLinejoin="round"/><path d="M60 178Q110 194 160 178L160 186Q110 202 60 186Z" fill="#1ea7ff" stroke="#0a1a2e" strokeWidth="3" strokeLinejoin="round"/><path d="M92 150Q96 166 88 178M128 150Q124 166 132 178" fill="none" stroke="#8fc6f0" strokeWidth="2.5" strokeLinecap="round"/><path d="M88 160H132L128 178H92Z" fill="none" stroke="#0a1a2e" strokeWidth="2.5" strokeLinejoin="round" opacity=".35"/><path d="M82 124Q110 146 138 124Q110 108 82 124Z" fill="#dff1ff" stroke="#0a1a2e" strokeWidth="3" strokeLinejoin="round"/><path d="M102 136V160M118 136V160" stroke="#0a1a2e" strokeWidth="2.5" strokeLinecap="round"/><circle cx="102" cy="162" r="3" fill="#1ea7ff"/><circle cx="118" cy="162" r="3" fill="#1ea7ff"/><path d="M72 134Q54 160 64 184" fill="none" stroke="#0a1a2e" strokeWidth="18" strokeLinecap="round"/><path d="M72 134Q54 160 64 184" fill="none" stroke="#e3f3ff" strokeWidth="12" strokeLinecap="round"/><circle cx="64" cy="189" r="7" fill="url(#sg)" stroke="#0a1a2e" strokeWidth="2.5"/><g className="wave"><path d="M148 134Q166 160 156 184" fill="none" stroke="#0a1a2e" strokeWidth="18" strokeLinecap="round"/><path d="M148 134Q166 160 156 184" fill="none" stroke="#e3f3ff" strokeWidth="12" strokeLinecap="round"/><circle cx="156" cy="189" r="7" fill="url(#sg)" stroke="#0a1a2e" strokeWidth="2.5"/></g><g id="face" style={face}><ellipse cx="110" cy="82" rx="38" ry="36" fill="url(#sg)" stroke="#0a1a2e" strokeWidth="3"/><path d="M70 84C62 34 158 34 150 84L148 102L140 102L138 72Q124 64 112 72Q100 64 84 72L82 102L72 102Z" fill="url(#hg)" stroke="#0a1a2e" strokeWidth="3" strokeLinejoin="round"/><ellipse cx="94" cy="88" rx="10" ry="12.5" fill="#fff" stroke="#0a1a2e" strokeWidth="2.5"/><g className="pup" style={pup}><circle cx="94" cy="90" r="8.5" fill="url(#ig)"/><circle cx="94" cy="90" r="4" fill="#0a1a2e"/><circle cx="91" cy="86" r="2.6" fill="#fff"/><circle cx="97" cy="94" r="1.3" fill="#fff"/></g><ellipse className="lid" cx="94" cy="88" rx="10.5" ry="13" fill="#ffe2cf" stroke="#0a1a2e" strokeWidth="2.5"/><ellipse cx="126" cy="88" rx="10" ry="12.5" fill="#fff" stroke="#0a1a2e" strokeWidth="2.5"/><g className="pup" style={pup}><circle cx="126" cy="90" r="8.5" fill="url(#ig)"/><circle cx="126" cy="90" r="4" fill="#0a1a2e"/><circle cx="123" cy="86" r="2.6" fill="#fff"/><circle cx="129" cy="94" r="1.3" fill="#fff"/></g><ellipse className="lid" cx="126" cy="88" rx="10.5" ry="13" fill="#ffe2cf" stroke="#0a1a2e" strokeWidth="2.5"/><path d="M83 79Q94 74 105 80M115 80Q126 74 137 79" fill="none" stroke="#0a1a2e" strokeWidth="3.5" strokeLinecap="round"/><ellipse cx="84" cy="104" rx="7" ry="4" fill="#ff9db8" opacity=".6"/><ellipse cx="136" cy="104" rx="7" ry="4" fill="#ff9db8" opacity=".6"/><path d={happy ? "M102 106Q110 120 118 106Z" : "M104 108Q110 113 116 108"} fill={happy ? "#ff7a8a" : "none"} stroke="#0a1a2e" strokeWidth="2.5" strokeLinecap="round" /><path d="M70 76C66 24 154 24 150 76" fill="none" stroke="#0a1a2e" strokeWidth="5" strokeLinecap="round"/><path d="M74 56L72 26L100 44Z" fill="#1ea7ff" stroke="#0a1a2e" strokeWidth="3" strokeLinejoin="round"/><path d="M146 56L148 26L120 44Z" fill="#1ea7ff" stroke="#0a1a2e" strokeWidth="3" strokeLinejoin="round"/><path d="M77 48L76 34L90 43Z" fill="#b5e0ff"/><path d="M143 48L144 34L130 43Z" fill="#b5e0ff"/><rect x="62" y="72" width="13" height="28" rx="6" fill="#1ea7ff" stroke="#0a1a2e" strokeWidth="3"/><rect x="145" y="72" width="13" height="28" rx="6" fill="#1ea7ff" stroke="#0a1a2e" strokeWidth="3"/><path d="M130 52l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#fff" stroke="#0a1a2e" strokeWidth="1.8"/></g><g id="front" style={front}><path d="M72 102Q60 136 70 172L82 168Q76 136 82 104Z" fill="url(#hg)" stroke="#0a1a2e" strokeWidth="2.5" strokeLinejoin="round"/><path d="M148 102Q160 136 150 172L138 168Q144 136 138 104Z" fill="url(#hg)" stroke="#0a1a2e" strokeWidth="2.5" strokeLinejoin="round"/></g></svg>
    </div>
  );
}
