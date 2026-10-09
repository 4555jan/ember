import type { ReactNode } from "react";

export function EmptyState({ title, hint, action }: { title: string; hint: string; action?: ReactNode }) {
  return (
    <div className="card mx-auto max-w-md text-center">
      <h3 className="mb-2 text-lg">{title}</h3>
      <p className="mb-4 text-sm opacity-75">{hint}</p>
      {action}
    </div>
  );
}
