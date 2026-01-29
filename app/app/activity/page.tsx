import { ActivityTimeline } from "@/app/components/activity-timeline";
import { Activity } from "lucide-react";

export default function ActivityPage() {
  return (
    <div className="layout-container layout-section">
      <div className="layout-stack">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-lux-gold-soft flex h-12 w-12 items-center justify-center rounded-xl">
            <Activity className="h-6 w-6 text-lux-gold" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-foreground">Activity Timeline</h1>
            <p className="text-sm text-muted-foreground">
              View all activity across your workspace
            </p>
          </div>
        </div>

        <ActivityTimeline />
      </div>
    </div>
  );
}
