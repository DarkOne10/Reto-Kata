"use client"

import { useEffect, useState } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { CandidateStatusBadge } from "@/components/candidate-status-badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { apiFetch } from "@/lib/api"
import type { Candidate } from "@/lib/candidates"

export default function FollowUpPage() {
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

  return (
    <DashboardShell title="Seguimiento">
      <section className="mx-auto grid w-full max-w-4xl content-start gap-6 px-4 lg:px-6">
        <div>
          <p className="text-sm text-muted-foreground">Portal del postulante</p>
          <h1 className="mt-2 text-3xl font-semibold">Seguimiento</h1>
        </div>

        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle>Mis postulaciones</CardTitle>
            <CardDescription>Consulta el estado de cada registro.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Cargando postulaciones...
              </p>
            )}
            {error && (
              <p className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive" role="alert">
                {error}
              </p>
            )}
            {!isLoading && !error && candidates.length === 0 && (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Aún no tienes postulaciones registradas.
              </p>
            )}
            {!error && candidates.length > 0 && (
              <ul className="divide-y">
                {candidates.map((candidate) => (
                  <li
                    key={candidate.id}
                    className="flex flex-col gap-3 py-4 first:pt-0 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">{candidate.career}</p>
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
                    </div>
                    <CandidateStatusBadge status={candidate.status} />
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </section>
    </DashboardShell>
  )
}
