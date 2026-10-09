import { artUrl } from "@/lib/utils";
import type { PortfolioItem } from "@/types/portfolio";

interface Props { items: PortfolioItem[]; onSelect: (item: PortfolioItem) => void; onRemove?: (item: PortfolioItem) => void }

export function PortfolioGrid({ items, onSelect, onRemove }: Props) {
  if (!items.length) return null;
  return (
    <ul className="m-0 grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3">
      {items.map((w) => (
        <li key={w.id} className="relative">
          <button onClick={() => onSelect(w)} aria-label={`Open ${w.title}`}
            className="group block aspect-square w-full overflow-hidden rounded-[14px] border-[2.5px] border-ink bg-cover bg-center text-left transition hover:-rotate-1 hover:shadow-zine-sm"
            style={{ backgroundImage: `url(${artUrl(w.artIndex)})` }}>
            <span className="absolute inset-x-0 bottom-0 translate-y-full bg-ink px-2.5 py-2 font-mono text-[11px] font-bold text-paper transition-transform group-hover:translate-y-0 group-focus-visible:translate-y-0">{w.title}</span>
          </button>
          {onRemove && <button onClick={() => onRemove(w)} aria-label={`Remove ${w.title}`} className="btn btn-w btn-s absolute right-1.5 top-1.5 !px-2">✕</button>}
        </li>
      ))}
    </ul>
  );
}
