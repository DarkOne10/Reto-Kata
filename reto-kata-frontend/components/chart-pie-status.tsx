"use client"

import { Pie, PieChart } from "recharts"
import type { Candidate, CandidateStatus } from "@/lib/candidates"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const statusDetails = [
  { status: "PENDING", key: "pending", label: "En revisión", color: "#d97706" },
  { status: "VIABLE", key: "viable", label: "Viable", color: "#15803d" },
  { status: "NOT_VIABLE", key: "notViable", label: "No viable", color: "#dc2626" },
] as const satisfies readonly {
  status: CandidateStatus
  key: string
  label: string
  color: string
}[]

const chartConfig = {
  pending: { label: "En revisión", color: "#d97706" },
  viable: { label: "Viable", color: "#15803d" },
  notViable: { label: "No viable", color: "#dc2626" },
} satisfies ChartConfig

export function ChartPieStatus({ candidates }: { candidates: Candidate[] }) {
  const chartData = statusDetails.map((detail) => ({
    status: detail.key,
    count: candidates.filter((candidate) => candidate.status === detail.status).length,
    fill: `var(--color-${detail.key})`,
  }))
  const total = candidates.length

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Estado de postulaciones</CardTitle>
        <CardDescription>Distribución actual de candidatos</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col items-center justify-center gap-2 pb-5">
        <div className="relative mx-auto w-full max-w-[250px]">
          <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
            <PieChart>
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={chartData}
                dataKey="count"
                nameKey="status"
                innerRadius={62}
                outerRadius={88}
                strokeWidth={4}
              />
            </PieChart>
          </ChartContainer>
          <div className="pointer-events-none absolute inset-0 grid content-center justify-items-center text-center">
            <span className="text-3xl font-semibold tabular-nums">{total}</span>
            <span className="text-xs text-muted-foreground">Postulaciones</span>
          </div>
        </div>
        <ul className="grid w-full gap-2 px-2 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
          {statusDetails.map((detail, index) => (
            <li key={detail.status} className="flex items-center justify-between gap-2 text-sm">
              <span className="flex min-w-0 items-center gap-2">
                <span
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: detail.color }}
                  aria-hidden="true"
                />
                <span className="truncate">{detail.label}</span>
              </span>
              <span className="font-medium tabular-nums">{chartData[index].count}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}