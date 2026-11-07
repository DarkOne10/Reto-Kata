import type { ReactNode } from "react"
import { AuthGuard } from "@/components/auth-guard"

export const instant = false

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard allowedRoles={["ADMIN", "ANALYST"]}>
      {children}
    </AuthGuard>
  )
}