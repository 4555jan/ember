"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import type { UserRole } from "@/types/user";

const nextPath = () => {
  const n = new URLSearchParams(window.location.search).get("next");
  return n && n.startsWith("/") && !n.startsWith("//") ? n : "/creators";
};

export default function LoginPage() {
  const router = useRouter();
  const { login, demoLogin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError(""); setBusy(true);
    try { await login(email.trim(), password); router.push(nextPath()); }
    catch (err) { setError(err instanceof Error ? err.message : "Couldn't log in. Try again."); }
    finally { setBusy(false); }
  }

  const demo = (role: UserRole) => { demoLogin(role); router.push(role === "creator" ? "/dashboard" : nextPath()); };

  return (
    <div className="mx-auto max-w-md">
      <form onSubmit={submit} className="card">
        <h1 className="mb-4 text-3xl">Log in</h1>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <Label htmlFor="pw">Password</Label>
        <Input id="pw" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p role="alert" className="mb-3 font-mono text-sm font-bold text-[#d6336c]">{error}</p>}
        <Button type="submit" disabled={busy} className="w-full">{busy ? "Logging in…" : "Log in"}</Button>
        <p className="mt-4 text-sm">New here? <Link href="/register" className="font-bold underline">Create an account</Link></p>
      </form>
      <div className="card mt-5">
        <div className="lbl mb-2">Demo mode</div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => demo("brand")}>Enter as brand</Button>
          <Button variant="outline" size="sm" onClick={() => demo("creator")}>Enter as creator</Button>
        </div>
      </div>
    </div>
  );
}
