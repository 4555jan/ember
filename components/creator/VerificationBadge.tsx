import { Badge } from "@/components/ui/badge";

export function VerificationBadge({ verified }: { verified: boolean }) {
  return verified
    ? <Badge on title="Identity and portfolio checked by Ember">✓ Verified</Badge>
    : <Badge title="Not verified yet">Unverified</Badge>;
}
