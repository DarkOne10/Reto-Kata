import { Badge } from "@/components/ui/badge"
import { candidateStatusLabels, type CandidateStatus } from "@/lib/candidates"

export function CandidateStatusBadge({ status }: { status: CandidateStatus }) {
  const variant = status === "VIABLE"
    ? "default"
    : status === "NOT_VIABLE"
      ? "destructive"
      : "outline"

  return <Badge variant={variant}>{candidateStatusLabels[status]}</Badge>
}
