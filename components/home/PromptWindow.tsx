"use client";

import { useEffect, useState } from "react";
import { artUrl } from "@/lib/utils";
import { Nyx } from "./Nyx";

const PROMPTS = [
  "neon sneaker, rainy tokyo, 35mm",
  "chrome koi fish, vaporwave",
  "cyber-witch portrait, blue smoke",
  "floating soda can, pastel void",
  "glitch city skyline at dawn",
  "holographic cat astronaut",
];
const LINES = ["hey you ✦ i'm Nyx", "pick a creator already~", "your brief looks cute", "i'm watching the leaderboard…", "click me again, i dare you", "blue is the best colour ♡", "go on, hire someone ✦"];

/** Fake terminal that types prompts and swaps the art, with Nyx sitting on its top edge. */
export function PromptWindow() {
  const [k, setK] = useState(0);
  const [typed, setTyped] = useState("");
  const [say, setSay] = useState("hey, i'm Nyx ✦");
  const [pop, setPop] = useState(0);

  useEffect(() => {
    let j = 0, wait = 0, idx = 0;
    const id = setInterval(() => {
      const text = PROMPTS[idx];
      if (j <= text.length) { setTyped(text.slice(0, j++)); }
      else if (++wait > 22) {
        idx = (idx + 1) % PROMPTS.length; j = 0; wait = 0;
        setK(idx);
        setSay(`rendering: ${PROMPTS[idx].split(",")[0]} ✦`); setPop((n) => n + 1);
      }
    }, 70);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="stage">
      <Nyx onPoke={() => { setSay(LINES[Math.floor(Math.random() * LINES.length)]); setPop((n) => n + 1); }} />
      <div key={pop} className={pop ? "say pop" : "say"} aria-live="polite">{say}</div>
      <div className="card mt-0 rotate-[1.5deg] overflow-hidden !p-0">
        <div className="flex items-center gap-1.5 border-b-[2.5px] border-ink bg-mist px-3 py-2 text-[#0a1a2e]">
          {[0, 1, 2].map((i) => <i key={i} className="h-[11px] w-[11px] rounded-full border-2 border-[#0a1a2e] bg-white" />)}
          <span className="ml-2 font-mono text-xs">prompt.exe</span>
        </div>
        <div className="min-h-16 p-3.5 font-mono text-[13px]" aria-hidden><b className="text-sky">&gt; prompt:</b> {typed}▌</div>
        <div className="h-[190px] border-t-[2.5px] border-ink bg-cover bg-center transition-[background] duration-500" style={{ backgroundImage: `url(${artUrl(k)})` }} role="img" aria-label={`AI-made artwork for the prompt: ${PROMPTS[k]}`} />
      </div>
    </div>
  );
}
