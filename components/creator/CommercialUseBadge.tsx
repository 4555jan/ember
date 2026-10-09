import { Badge } from "@/components/ui/badge";

export function CommercialUseBadge({ allowed }: { allowed: boolean }) {
  return allowed
    ? <Badge title="Outputs can be used in paid campaigns">Commercial use ok</Badge>
    : <Badge className="opacity-70" title="Personal and editorial use only">Personal use only</Badge>;
}
