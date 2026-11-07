"use client"

import { useState } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { useIsMobile } from "@/hooks/use-mobile"
import type { Candidate } from "@/lib/candidates"
import {
  Card,
  CardAction,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const chartConfig = {
  applications: {
    label: "Postulaciones",
    color: "var(--primary)",
  },
} satisfies ChartConfig

const rangeDays: Record<string, number> = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
}

function dateKey(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${date.getFullYear()}-${month}-${day}`
}

function dateFromKey(key: string) {
  const [year, month, day] = key.split("-").map(Number)
  return new Date(year, month - 1, day)
}

function formatDay(key: string, options: Intl.DateTimeFormatOptions) {
  return dateFromKey(key).toLocaleDateString("es-CO", options)
}

export function ApplicationsAreaChart({ candidates }: { candidates: Candidate[] }) {
  const isMobile = useIsMobile()
  const [selectedTimeRange, setSelectedTimeRange] = useState<string | null>(null)
  const timeRange = selectedTimeRange ?? (isMobile ? "7d" : "30d")
  const days = rangeDays[timeRange] ?? 30
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const startDate = new Date(today)
  startDate.setDate(today.getDate() - days + 1)

  const countsByDay = new Map<string, number>()
  for (const candidate of candidates) {
    const date = new Date(candidate.createdAt)
    if (Number.isNaN(date.getTime())) continue
    const key = dateKey(date)
    countsByDay.set(key, (countsByDay.get(key) ?? 0) + 1)
  }

  const chartData = Array.from({ length: days }, (_, index) => {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + index)
    const key = dateKey(date)
    return { date: key, applications: countsByDay.get(key) ?? 0 }
  })

  const timeRangeLabel =
    timeRange === "7d"
      ? "Últimos 7 días"
      : timeRange === "30d"
        ? "Últimos 30 días"
        : "Últimos 90 días"

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Postulaciones por día</CardTitle>
        <CardDescription>{timeRangeLabel}</CardDescription>
        <CardAction>
          <ToggleGroup
            multiple={false}
            value={[timeRange]}
            onValueChange={(value) => setSelectedTimeRange(value[0] ?? timeRange)}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:px-3! @[767px]/card:flex"
          >
            <ToggleGroupItem value="7d">7 días</ToggleGroupItem>
            <ToggleGroupItem value="30d">30 días</ToggleGroupItem>
            <ToggleGroupItem value="90d">90 días</ToggleGroupItem>
          </ToggleGroup>
          <Select
            value={timeRange}
            onValueChange={(value) => {
              if (value !== null) setSelectedTimeRange(value)
            }}
          >
            <SelectTrigger
              className="flex w-32 @[767px]/card:hidden"
              size="sm"
              aria-label="Seleccionar periodo"
            >
              <SelectValue placeholder="Periodo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 días</SelectItem>
              <SelectItem value="30d">30 días</SelectItem>
              <SelectItem value="90d">90 días</SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="h-[260px] w-full">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="fillApplications" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-applications)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="var(--color-applications)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={28}
              tickFormatter={(value: string) => formatDay(value, { month: "short", day: "numeric" })}
            />
            <YAxis
              allowDecimals={false}
              width={32}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => formatDay(String(value), {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="applications"
              type="monotone"
              fill="url(#fillApplications)"
              stroke="var(--color-applications)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}