"use client"

import { useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import type { AuthRole } from "@/components/auth-provider"
import { useAuth } from "@/components/auth-provider"

export function AuthGuard({
  children,
  allowedRoles,
}: {
  children: ReactNode
  allowedRoles: AuthRole[]
}) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const hasAccess = Boolean(user && allowedRoles.includes(user.role))
  const destination = user?.role === "APPLICANT" ? "/application" : "/dashboard"

  useEffect(() => {
    if (!isLoading && !user) router.replace("/login")
    else if (!isLoading && user && !hasAccess) router.replace(destination)
  }, [destination, hasAccess, isLoading, router, user])

  if (isLoading || !hasAccess) {
    return (
      <main className="grid min-h-screen place-items-center bg-background text-sm text-muted-foreground">
        Verificando sesión...
      </main>
    )
  }

  return children
}
