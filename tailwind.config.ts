import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "var(--ink)",
        paper: "var(--bg)",
        sky: "var(--sky)",
        mist: "var(--mist)",
        card: "var(--card)",
      },
      fontFamily: {
        display: ["'Archivo Black'", "Impact", "sans-serif"],
        mono: ["'Space Mono'", "ui-monospace", "monospace"],
        hand: ["Caveat", "cursive"],
      },
      boxShadow: {
        zine: "6px 6px 0 var(--ink)",
        "zine-sm": "3px 3px 0 var(--ink)",
        "zine-sky": "9px 9px 0 var(--sky)",
      },
    },
  },
  plugins: [],
};
export default config;
