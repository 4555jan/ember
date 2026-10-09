"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/creators", label: "Creators" },
  { href: "/briefs/create", label: "New brief" },
  { href: "/briefs", label: "My briefs" },
  { href: "/dashboard", label: "Studio" },
];

export function Navbar() {
  const path = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const active = (href: string) => (href === "/" ? path === "/" : href === "/briefs" ? path === "/briefs" || /^\/briefs\/(?!create)/.test(path) : path.startsWith(href));

  return (
    <header className="sticky top-[env(safe-area-inset-top,0px)] z-40 flex items-center gap-3.5 border-b-[2.5px] border-ink bg-paper px-4 py-2.5">
      <Link href="/" className="whitespace-nowrap font-display text-2xl text-sky [text-shadow:2px_2px_0_var(--ink)]">EMBER*</Link>
      <nav aria-label="Main" className="flex flex-1 gap-1 overflow-x-auto [scrollbar-width:none]">
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} aria-current={active(l.href) ? "page" : undefined}
            className={cn("whitespace-nowrap rounded-full border-2 border-transparent px-3 py-1.5 font-mono text-xs font-bold uppercase hover:border-ink", active(l.href) && "bg-ink text-paper")}>
            {l.label}
          </Link>
        ))}
      </nav>
      {!loading && (user ? (
        <div className="flex items-center gap-2">
          <span className="hidden font-mono text-xs font-bold sm:inline">{user.handle}</span>
          <button className={buttonVariants({ variant: "outline", size: "sm" })} onClick={async () => { await logout(); router.push("/"); }}>Log out</button>
        </div>
      ) : (
        <div className="flex gap-2">
          <Link href="/login" className={buttonVariants({ variant: "outline", size: "sm" })}>Log in</Link>
          <Link href="/register" className={buttonVariants({ size: "sm" })}>Join</Link>
        </div>
      ))}
    </header>
  );
}
