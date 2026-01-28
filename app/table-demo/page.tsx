import { DataTable } from "@/app/components/data-table"
import data from "../dashboard/data.json"

export default function TableDemoPage() {
  return (
    <div className="layout-container layout-section">
      <div className="layout-stack">
        <h1 className="text-hero-lux text-3xl font-semibold">Data Table Demo</h1>
        <p className="text-muted-foreground">
          Comprehensive table with pagination, sorting, filtering, drag-and-drop, and inline editing.
        </p>
      </div>
      <div className="mt-8">
        <DataTable data={data} />
      </div>
    </div>
  )
}
