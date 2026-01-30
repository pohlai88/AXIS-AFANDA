import type { Metadata } from "next"
import { LayoutDashboard } from "lucide-react"
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
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b bg-background px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="bg-lux-gold-soft flex h-12 w-12 items-center justify-center rounded-xl">
            <LayoutDashboard className="h-6 w-6 text-lux-gold" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Overview of your workspace metrics and activity
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="@container/main flex flex-col gap-2">
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
    </div>
  )
}
