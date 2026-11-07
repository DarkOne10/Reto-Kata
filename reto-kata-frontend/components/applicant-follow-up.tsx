"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { CalendarDays, ClipboardCheck, Clock3, FilePlus2 } from "lucide-react"
import { DashboardShell } from "@/components/dashboard-shell"
import { CandidateStatusBadge } from "@/components/candidate-status-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/components/auth-provider"
import { apiFetch } from "@/lib/api"
import type { Candidate } from "@/lib/candidates"

export default function ApplicantFollowUp() {
  const { user } = useAuth()
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let active = true

    apiFetch<Candidate[]>("/candidates/mine")
      .then((result) => {
        if (active) setCandidates(result)
      })
      .catch((requestError: unknown) => {
        if (active) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "No se pudo consultar el seguimiento.",
          )
        }
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const pendingCount = candidates.filter((candidate) => candidate.status === "PENDING").length
  const resolvedCount = candidates.length - pendingCount

  return (
    <DashboardShell title="Mi panel">
      <section className="mx-auto grid w-full max-w-5xl content-start gap-8 px-4 lg:px-6">
        <header className="flex flex-col gap-5 border-b pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Portal del postulante</p>
            <h1 className="mt-2 text-3xl font-semibold">Hola, {user?.name}</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Consulta el avance de tus postulaciones.
            </p>
          </div>
          <Button nativeButton={false} render={<Link href="/application" />}>
            <FilePlus2 data-icon="inline-start" />
            Nueva postulación
          </Button>
        </header>

        <dl className="grid grid-cols-1 divide-y rounded-lg border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <div className="flex items-center gap-3 p-4 sm:p-5">
            <ClipboardCheck className="size-5 text-muted-foreground" aria-hidden="true" />
            <div>
              <dt className="text-sm text-muted-foreground">Postulaciones</dt>
              <dd className="mt-1 text-2xl font-semibold tabular-nums">
                {isLoading ? "-" : candidates.length}
              </dd>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 sm:p-5">
            <Clock3 className="size-5 text-amber-600" aria-hidden="true" />
            <div>
              <dt className="text-sm text-muted-foreground">En revisión</dt>
              <dd className="mt-1 text-2xl font-semibold tabular-nums">
                {isLoading ? "-" : pendingCount}
              </dd>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 sm:p-5">
            <CalendarDays className="size-5 text-emerald-700" aria-hidden="true" />
            <div>
              <dt className="text-sm text-muted-foreground">Con decisión</dt>
              <dd className="mt-1 text-2xl font-semibold tabular-nums">
                {isLoading ? "-" : resolvedCount}
              </dd>
            </div>
          </div>
        </dl>

        <div className="grid gap-4">
          <div>
            <h2 className="text-lg font-semibold">Estado de tus postulaciones</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Revisa cada proceso y la fecha en que lo enviaste.
            </p>
          </div>

          {isLoading && (
            <p className="py-10 text-center text-sm text-muted-foreground">
              Cargando tus postulaciones...
            </p>
          )}
          {error && (
            <p className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
          {!isLoading && !error && candidates.length === 0 && (
            <Card className="rounded-lg">
              <CardHeader>
                <CardTitle>Aún no tienes postulaciones</CardTitle>
                <CardDescription>
                  Completa el formulario para iniciar tu proceso de selección.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button nativeButton={false} render={<Link href="/application" />}>
                  <FilePlus2 data-icon="inline-start" />
                  Crear postulación
                </Button>
              </CardContent>
            </Card>
          )}

          {!error && candidates.length > 0 && (
            <ol className="divide-y border-y">
              {candidates.map((candidate) => {
                const hasDecision = candidate.status !== "PENDING"
                const statusLabel = candidate.status === "VIABLE"
                  ? "Candidato viable"
                  : candidate.status === "NOT_VIABLE"
                    ? "Candidato no viable"
                    : "En revisión por el equipo de selección"

                return (
                  <li key={candidate.id} className="grid gap-5 py-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="font-semibold">{candidate.career}</h3>
                        <CandidateStatusBadge status={candidate.status} />
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Semestre {candidate.semester} · Enviada el{" "}
                        <time dateTime={candidate.createdAt}>
                          {new Date(candidate.createdAt).toLocaleDateString("es-CO", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </time>
                      </p>
                      <p className="mt-3 text-sm">{statusLabel}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 sm:min-w-72">
                      {[
                        { label: "Recibida", complete: true },
                        { label: "En revisión", complete: true },
                        { label: "Decisión", complete: hasDecision },
                      ].map((step, index) => (
                        <div key={step.label} className="grid gap-2">
                          <div className="flex items-center">
                            <span
                              className={`size-2.5 shrink-0 rounded-full ${step.complete ? "bg-primary" : "bg-muted-foreground/30"}`}
                              aria-hidden="true"
                            />
                            {index < 2 && (
                              <span
                                className={`h-px flex-1 ${step.complete && (index === 0 || hasDecision) ? "bg-primary" : "bg-border"}`}
                                aria-hidden="true"
                              />
                            )}
                          </div>
                          <span className={`text-xs ${step.complete ? "text-foreground" : "text-muted-foreground"}`}>
                            {step.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </li>
                )
              })}
            </ol>
          )}
        </div>
      </section>
    </DashboardShell>
  )
}
