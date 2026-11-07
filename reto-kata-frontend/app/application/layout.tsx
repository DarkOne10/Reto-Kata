import type { ReactNode } from "react"
import { AuthGuard } from "@/components/auth-guard"

export const instant = false

export default function ApplicationLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard allowedRoles={["APPLICANT"]}>
      {children}
    </AuthGuard>
  )
}
