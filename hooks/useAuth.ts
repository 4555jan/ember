"use client";

import { useEffect, useSyncExternalStore } from "react";
import { readStore, uid, writeStore } from "@/lib/utils";
import type { AppUser, UserRole } from "@/types/user";

/**
 * One auth store for the whole app.
 * Demo auth only: accounts live in localStorage (plain text), so never use it for real users.
 * When you pick a backend, replace login / register / logout and the `start` listener below.
 */
interface State { user: AppUser | null; loading: boolean }
interface RegisterInput { name: string; email: string; password: string; role: UserRole; handle: string }
type Account = AppUser & { password: string };

const SESSION = "ember.session";
const ACCOUNTS = "ember.accounts";
const SERVER: State = { user: null, loading: true };

let state: State = SERVER;
let started = false;
const subs = new Set<() => void>();

function set(next: Partial<State>) {
  state = { ...state, ...next };
  subs.forEach((f) => f());
}

function start() {
  if (started || typeof window === "undefined") return;
  started = true;
  set({ user: readStore<AppUser | null>(SESSION, null), loading: false });
}

export async function login(email: string, password: string) {
  const acc = readStore<Account[]>(ACCOUNTS, []).find((a) => a.email.toLowerCase() === email.toLowerCase());
  if (!acc || acc.password !== password) throw new Error("Email or password is wrong. Check both, or use a demo login.");
  const { password: _pw, ...user } = acc;
  writeStore(SESSION, user);
  set({ user });
}

export async function register(input: RegisterInput) {
  const accounts = readStore<Account[]>(ACCOUNTS, []);
  if (accounts.some((a) => a.email.toLowerCase() === input.email.toLowerCase())) throw new Error("That email already has an account. Log in instead.");
  const user: AppUser = { uid: uid("u"), email: input.email, name: input.name, handle: input.handle, role: input.role };
  writeStore(ACCOUNTS, [...accounts, { ...user, password: input.password }]);
  writeStore(SESSION, user);
  set({ user });
}

export function demoLogin(role: UserRole) {
  const user: AppUser = role === "brand"
    ? { uid: "demo_brand", email: "brand@demo.dev", name: "Demo Brand", handle: "@demobrand", role }
    : { uid: "demo_creator", email: "creator@demo.dev", name: "Demo Creator", handle: "@democreator", role };
  writeStore(SESSION, user);
  set({ user });
}

export async function logout() {
  writeStore(SESSION, null);
  set({ user: null });
}

export function useAuth() {
  useEffect(start, []);
  const s = useSyncExternalStore(
    (cb) => { subs.add(cb); return () => subs.delete(cb); },
    () => state,
    () => SERVER,
  );
  return { ...s, login, register, demoLogin, logout };
}
