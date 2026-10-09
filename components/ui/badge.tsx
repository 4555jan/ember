import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, on, ...props }: HTMLAttributes<HTMLSpanElement> & { on?: boolean }) {
  return <span className={cn("chip chip-static !mb-0 !mr-0", on && "chip-on", className)} {...props} />;
}
