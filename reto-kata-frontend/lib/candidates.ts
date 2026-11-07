export type CandidateStatus = "PENDING" | "VIABLE" | "NOT_VIABLE"

export type Candidate = {
  id: number
  fullName: string
  email: string
  career: string
  semester: number
  status: CandidateStatus
  createdAt: string
  reviewedAt: string | null
}

export const candidateStatusLabels: Record<CandidateStatus, string> = {
  PENDING: "En revisión",
  VIABLE: "Viable",
  NOT_VIABLE: "No viable",
}
