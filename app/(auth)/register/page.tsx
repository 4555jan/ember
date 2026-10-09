"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types/user";

const A = ["neon", "glitch", "pixel", "void", "chrome", "sugar", "laser"];
const B = ["witch", "fox", "byte", "ghost", "cat", "pilot", "moth"];
const roll = () => `@${A[Math.floor(Math.random() * A.length)]}_${B[Math.floor(Math.random() * B.length)]}${Math.floor(Math.random() * 99)}`;

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [role, setRole] = useState<UserRole>("brand");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [handle, setHandle] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return setError("Add your name.");
    if (password.length < 6) return setError("Use a password with at least 6 characters.");
    setError(""); setBusy(true);
    try {
      await register({ name: name.trim(), email: email.trim(), password, role, handle: handle.trim() || roll() });
      router.push(role === "creator" ? "/dashboard" : "/creators");
    } catch (err) { setError(err instanceof Error ? err.message : "Couldn't create the account. Try again."); }
    finally { setBusy(false); }
  }

  return (
    <div className="grid items-center gap-8 md:grid-cols-2">
      <form onSubmit={submit} className="card" noValidate>
        <h1 className="mb-4 text-3xl">Join Ember</h1>
        <div className="lbl mb-2">I am a</div>
        <div className="mb-3.5" role="group" aria-label="Account type">
          {(["brand", "creator"] as UserRole[]).map((r) => (
            <button type="button" key={r} aria-pressed={role === r} onClick={() => setRole(r)} className={cn("chip capitalize", role === r && "chip-on")}>{r}</button>
          ))}
        </div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Label htmlFor="pw">Password</Label>
        <Input id="pw" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Label htmlFor="handle">Handle</Label>
        <div className="flex gap-2">
          <Input id="handle" value={handle} onChange={(e) => setHandle(e.target.value)} placeholder="@handle" />
          <Button variant="outline" size="sm" className="mb-3.5 mt-1.5" aria-label="Suggest a handle" onClick={() => setHandle(roll())}>Suggest</Button>
        </div>
        {error && <p role="alert" className="mb-3 font-mono text-sm font-bold text-[#d6336c]">{error}</p>}
        <Button type="submit" disabled={busy} className="w-full">{busy ? "Creating…" : "Create account"}</Button>
        <p className="mt-4 text-sm">Already in? <Link href="/login" className="font-bold underline">Log in</Link></p>
      </form>
      <p className="note text-center !text-4xl" aria-hidden>{role === "brand" ? "find your next obsession ✦" : "get paid for your prompts ✦"}</p>
    </div>
  );
}
