import { Badge } from "@/components/ui/badge";

export function ToolBadge({ tool, className }: { tool: string; className?: string }) {
  return <Badge className={className}>{tool}</Badge>;
}
