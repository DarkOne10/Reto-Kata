"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, CircleCheck, CircleX } from "lucide-react"
import { CandidateStatusBadge } from "@/components/candidate-status-badge"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { apiFetch } from "@/lib/api"
import type { Candidate, CandidateStatus } from "@/lib/candidates"

export default function RequestDetail() {
  const params = useParams<{ id: string }>()
  const candidateId = Number(params.id)
  const [candidate, setCandidate] = useState<Candidate | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    let active = true

    apiFetch<Candidate>(`/candidates/${candidateId}`)
      .then((result) => {
        if (active) setCandidate(result)
      })
      .catch((requestError: unknown) => {
        if (active) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "No se pudo cargar la solicitud.",
          )
        }
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })

    return () => {
      active = false
    }
  }, [candidateId])

  async function setStatus(status: CandidateStatus) {
    setIsUpdating(true)
    setError("")

    try {
      const updated = await apiFetch<Candidate>(`/candidates/${candidateId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      })
      setCandidate(updated)
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "No se pudo actualizar el estado.",
      )
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <DashboardShell title="Detalle de solicitud">
      <section className="mx-auto grid w-full max-w-4xl content-start gap-5 px-4 lg:px-6">
        <Button
          variant="outline"
          className="w-fit"
          nativeButton={false}
          render={<Link href="/requests" />}
        >
          <ArrowLeft data-icon="inline-start" />
          Volver a solicitudes
        </Button>

        {isLoading && <p className="text-sm text-muted-foreground">Cargando solicitud...</p>}
        {error && (
          <p className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive" role="alert">
            {error}
          </p>
        )}

        {candidate && (
          <Card className="rounded-lg">
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <CardTitle>{candidate.fullName}</CardTitle>
                  <CardDescription>{candidate.email}</CardDescription>
                </div>
                <CandidateStatusBadge status={candidate.status} />
              </div>
            </CardHeader>
            <CardContent className="grid gap-6">
              <dl className="grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-sm text-muted-foreground">Carrera universitaria</dt>
                  <dd className="mt-1 font-medium">{candidate.career}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Semestre actual</dt>
                  <dd className="mt-1 font-medium">{candidate.semester}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Fecha de postulación</dt>
                  <dd className="mt-1 font-medium">
                    {new Date(candidate.createdAt).toLocaleDateString("es-CO", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </dd>
                </div>
                {candidate.reviewedAt && (
                  <div>
                    <dt className="text-sm text-muted-foreground">Fecha de revisión</dt>
                    <dd className="mt-1 font-medium">
                      {new Date(candidate.reviewedAt).toLocaleDateString("es-CO")}
                    </dd>
                  </div>
                )}
              </dl>

              <div className="flex flex-wrap gap-3 border-t pt-5">
                <Button
                  onClick={() => void setStatus("VIABLE")}
                  disabled={isUpdating || candidate.status === "VIABLE"}
                >
                  <CircleCheck data-icon="inline-start" />
                  Marcar viable
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => void setStatus("NOT_VIABLE")}
                  disabled={isUpdating || candidate.status === "NOT_VIABLE"}
                >
                  <CircleX data-icon="inline-start" />
                  Marcar no viable
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </section>
    </DashboardShell>
  )
}
