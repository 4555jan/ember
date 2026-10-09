import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-10 border-t-[2.5px] border-ink bg-card px-4 py-8">
      <div className="mx-auto flex max-w-[1060px] flex-wrap items-center justify-between gap-4">
        <div>
          <div className="font-display text-xl text-sky [text-shadow:2px_2px_0_var(--ink)]">EMBER*</div>
          <p className="mt-1 max-w-xs text-sm opacity-70">Hire AI creators for images, video, copy, voice, 3D and automation. Pay when you approve.</p>
        </div>
        <nav aria-label="Footer" className="flex gap-4 font-mono text-xs font-bold">
          <Link href="/creators" className="hover:underline">Creators</Link>
          <Link href="/briefs/create" className="hover:underline">Post a brief</Link>
          <Link href="/register" className="hover:underline">Join</Link>
        </nav>
      </div>
    </footer>
  );
}
