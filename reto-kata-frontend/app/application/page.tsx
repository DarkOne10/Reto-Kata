"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, Send } from "lucide-react"
import { DashboardShell } from "@/components/dashboard-shell"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { apiFetch } from "@/lib/api"
import type { Candidate } from "@/lib/candidates"

export default function ApplicationPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [fullName, setFullName] = useState(user?.name ?? "")
  const [career, setCareer] = useState("")
  const [semester, setSemester] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      await apiFetch<Candidate>("/candidates", {
        method: "POST",
        body: JSON.stringify({
          fullName,
          email: user?.email,
          career,
          semester: Number(semester),
        }),
      })
      router.push("/application/follow-up")
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "No se pudo enviar la postulación.",
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <DashboardShell title="Postulación">
      <section className="mx-auto grid w-full max-w-4xl content-start gap-6 px-4 lg:px-6">
        <div>
          <p className="text-sm text-muted-foreground">Portal del postulante</p>
          <h1 className="mt-2 text-3xl font-semibold">Bienvenido, {user?.name}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Completa tus datos para iniciar el proceso de selección.
          </p>
        </div>

        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle>Datos de postulación</CardTitle>
            <CardDescription>Los campos marcados son obligatorios.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
              <div className="grid gap-2">
                <label htmlFor="candidate-name" className="text-sm font-medium">
                  Nombre completo
                </label>
                <Input
                  id="candidate-name"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  autoComplete="name"
                  minLength={2}
                  maxLength={150}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="candidate-email" className="text-sm font-medium">
                  Correo electrónico
                </label>
                <Input
                  id="candidate-email"
                  type="email"
                  value={user?.email ?? ""}
                  readOnly
                  aria-describedby="candidate-email-note"
                />
                <span id="candidate-email-note" className="text-xs text-muted-foreground">
                  Correo asociado a tu cuenta.
                </span>
              </div>

              <div className="grid gap-2">
                <label htmlFor="candidate-career" className="text-sm font-medium">
                  Carrera universitaria
                </label>
                <Input
                  id="candidate-career"
                  value={career}
                  onChange={(event) => setCareer(event.target.value)}
                  placeholder="Ej. Ingeniería de Sistemas"
                  minLength={2}
                  maxLength={150}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="candidate-semester" className="text-sm font-medium">
                  Semestre actual
                </label>
                <Input
                  id="candidate-semester"
                  type="number"
                  value={semester}
                  onChange={(event) => setSemester(event.target.value)}
                  min={1}
                  max={20}
                  step={1}
                  required
                  disabled={isSubmitting}
                />
              </div>

              {error && (
                <p className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive sm:col-span-2" role="alert">
                  {error}
                </p>
              )}

              <div className="flex flex-wrap gap-3 sm:col-span-2">
                <Button type="submit" disabled={isSubmitting}>
                  <Send data-icon="inline-start" />
                  {isSubmitting ? "Enviando..." : "Enviar postulación"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSubmitting}
                  onClick={() => router.push("/application/follow-up")}
                >
                  Ver seguimiento
                  <ArrowRight data-icon="inline-end" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </section>
    </DashboardShell>
  )
}
