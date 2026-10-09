"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import type { UserRole } from "@/types/user";

/** Wrap a page: signed-out visitors go to /login?next=… ; wrong-role users see a short explainer. */
export function ProtectedRoute({ children, role }: { children: ReactNode; role?: UserRole }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    if (!loading && !user) router.replace(`/login?next=${encodeURIComponent(path)}`);
  }, [loading, user, router, path]);

  if (loading || !user) return <div className="card max-w-md font-mono text-sm" aria-busy="true">Checking your session…</div>;
  if (role && user.role !== role)
    return <div className="card max-w-md"><h2 className="mb-2 text-xl">Creators only</h2><p className="text-sm">Your account is a {user.role} account. Register a creator account to open the studio.</p></div>;
  return <>{children}</>;
}
