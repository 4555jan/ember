import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const initials = (name: string) =>
  name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

export const artUrl = (i: number) => `/seed/art-${((i % 6) + 6) % 6}.svg`;

export const money = (n: number) => `$${n.toLocaleString("en-US")}`;

export const uid = (p = "id") => `${p}_${Math.random().toString(36).slice(2, 9)}`;

export const AVATAR_COLORS = ["#1ea7ff", "#6cc4ff", "#b5e0ff", "#7dd3fc", "#5aa9ff", "#a5d8ff", "#38bdf8", "#8fd0ff"];

export const avatarColor = (id: string) =>
  AVATAR_COLORS[[...id].reduce((a, c) => a + c.charCodeAt(0), 0) % AVATAR_COLORS.length];

export function readStore<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeStore<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable */
  }
}
