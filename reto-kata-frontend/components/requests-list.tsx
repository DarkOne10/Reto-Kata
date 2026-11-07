"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { CandidateStatusBadge } from "@/components/candidate-status-badge"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { apiFetch } from "@/lib/api"
import type { Candidate } from "@/lib/candidates"

export default function RequestsList() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let active = true

    apiFetch<Candidate[]>("/candidates")
      .then((result) => {
        if (active) setCandidates(result)
      })
      .catch((requestError: unknown) => {
        if (active) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "No se pudieron cargar las solicitudes.",
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
    <DashboardShell title="Solicitudes">
      <section className="px-4 lg:px-6">
        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle>Solicitudes recibidas</CardTitle>
            <CardDescription>Postulaciones de practicantes registradas.</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <p className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive" role="alert">
                {error}
              </p>
            )}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Practicante</TableHead>
                  <TableHead>Carrera</TableHead>
                  <TableHead>Semestre</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Registro</TableHead>
                  <TableHead><span className="sr-only">Detalle</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {candidates.map((candidate) => (
                  <TableRow key={candidate.id}>
                    <TableCell>
                      <div className="font-medium">{candidate.fullName}</div>
                      <div className="text-xs text-muted-foreground">{candidate.email}</div>
                    </TableCell>
                    <TableCell>{candidate.career}</TableCell>
                    <TableCell>{candidate.semester}</TableCell>
                    <TableCell><CandidateStatusBadge status={candidate.status} /></TableCell>
                    <TableCell>
                      {new Date(candidate.createdAt).toLocaleDateString("es-CO")}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        nativeButton={false}
                        render={<Link href={`/requests/${candidate.id}`} />}
                        aria-label={`Ver solicitud de ${candidate.fullName}`}
                      >
                        Ver
                        <ArrowUpRight data-icon="inline-end" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {isLoading && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                      Cargando solicitudes...
                    </TableCell>
                  </TableRow>
                )}
                {!isLoading && !error && candidates.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                      Aún no hay solicitudes registradas.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>
    </DashboardShell>
  )
}
