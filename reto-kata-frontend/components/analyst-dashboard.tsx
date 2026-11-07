"use client"

import { useEffect, useState } from "react"
import { ApplicationsAreaChart } from "@/components/applications-area-chart"
import { CandidatesDashboardTable } from "@/components/candidates-dashboard-table"
import { ChartPieStatus } from "@/components/chart-pie-status"
import { DashboardShell } from "@/components/dashboard-shell"
import { apiFetch } from "@/lib/api"
import type { Candidate } from "@/lib/candidates"

export function AnalystDashboard() {
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
              : "No se pudieron cargar las postulaciones.",
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
    <DashboardShell title="Panel de analista">
      <section className="mx-auto grid w-full content-start gap-5">
        <div className="px-4 lg:px-6">
          <h1 className="text-xl font-semibold">Resumen de postulaciones</h1>
        </div>

        {error && (
          <p
            className="mx-4 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive lg:mx-6"
            role="alert"
          >
            {error}
          </p>
        )}

        <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-[minmax(0,1.65fr)_minmax(280px,1fr)] lg:px-6">
          <ApplicationsAreaChart candidates={candidates} />
          <ChartPieStatus candidates={candidates} />
        </div>

        <CandidatesDashboardTable candidates={candidates} isLoading={isLoading} />
      </section>
    </DashboardShell>
  )
}