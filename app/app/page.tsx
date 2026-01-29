import type { Metadata } from "next"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { ActivityTimeline } from "@/app/components/activity-timeline"
import data from "../dashboard/data.json"

export const metadata: Metadata = {
  title: "Dashboard | AXIS-AFENDA",
  description: "Overview dashboard with metrics, charts, and activity timeline.",
}

export default function AppDashboardPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards />
          <div className="px-4 lg:px-6">
            <ChartAreaInteractive />
          </div>
          <div className="grid gap-4 px-4 lg:grid-cols-2 lg:px-6">
            <DataTable data={data} />
            <ActivityTimeline />
          </div>
        </div>
      </div>
    </div>
  )
}
