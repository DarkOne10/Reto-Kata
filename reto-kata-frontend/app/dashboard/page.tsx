import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { DashboardShell } from "@/components/dashboard-shell"
import { SectionCards } from "@/components/section-cards"

import data from "./data.json"

export const instant = false

export default function Page() {
  return (
    <DashboardShell title="Panel">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 md:gap-6">
          <SectionCards />
          <div className="px-4 lg:px-6">
            <ChartAreaInteractive />
          </div>
          <DataTable data={data} />
        </div>
      </div>
    </DashboardShell>
  )
}
