"use client"

import { useRouter } from "next/navigation"
import { LogOut, UserRound } from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

function ApplicantHome() {
  const { user, signOut } = useAuth()
  const router = useRouter()

  async function handleSignOut() {
    await signOut()
    router.replace("/login")
  }

  return (
    <AuthGuard allowedRoles={["APPLICANT"]}>
      <main className="min-h-screen bg-muted/30">
        <header className="flex h-16 items-center justify-between border-b bg-background px-5 sm:px-8">
          <a href="/application" className="flex items-center gap-3 text-sm font-semibold">
            <span className="grid size-9 place-items-center rounded-lg bg-neutral-950 text-white">
              <UserRound className="size-4" aria-hidden="true" />
            </span>
            Reto-Kata
          </a>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut data-icon="inline-start" />
            Cerrar sesión
          </Button>
        </header>
        <section className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-3xl content-start gap-8 px-5 py-12 sm:px-8">
          <div>
            <p className="text-sm text-muted-foreground">Portal del postulante</p>
            <h1 className="mt-2 text-3xl font-semibold">Hola, {user?.name}</h1>
          </div>
          <Card className="rounded-lg">
            <CardHeader>
              <CardTitle>Mi postulación</CardTitle>
              <CardDescription>Estado actual de tu proceso de selección.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between gap-4 rounded-md border bg-muted/30 p-4">
                <span className="text-sm font-medium">Estado</span>
                <span className="rounded-full border bg-background px-3 py-1 text-sm">
                  Pendiente
                </span>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </AuthGuard>
  )
}

export default function ApplicationPage() {
  return <ApplicantHome />
}
