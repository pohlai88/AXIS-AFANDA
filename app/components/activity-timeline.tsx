"use client";

import * as React from "react";
import { formatDistanceToNow } from "date-fns";
import { CheckSquare, MessageSquare, Users, Activity, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { useActivityStore, type ActivityItem } from "@/app/lib/stores/activity-store";
import Link from "next/link";
import { NoTimelineState } from "@/app/components/common/empty-states";
import { APP_PATTERNS, ACTIVITY_TYPES } from "@/app/lib/constants/app-patterns";
import { cn } from "@/lib/utils";

const activityIcons: Record<ActivityItem["type"], React.ComponentType<{ className?: string }>> = {
  approval: CheckSquare,
  message: MessageSquare,
  team: Users,
  system: Activity,
};

export function ActivityTimeline() {
  const { activities, isLoading, fetchActivities } = useActivityStore();

  React.useEffect(() => {
    fetchActivities(20);
  }, [fetchActivities]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Activity Timeline</CardTitle>
          <CardDescription>Loading activities...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Activity Timeline</CardTitle>
            <CardDescription>Recent activity across your workspace</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => fetchActivities(20)}>
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-screen-60">
          {activities.length === 0 ? (
            <div className="py-12">
              <NoTimelineState />
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity, index) => {
                const Icon = activityIcons[activity.type];
                const isLast = index === activities.length - 1;

                return (
                  <div key={activity.id} data-slot="activity-item" className={APP_PATTERNS.activityTimeline.itemContainer}>
                    {/* Timeline line */}
                    {!isLast && (
                      <div data-slot="timeline-line" className="absolute left-4 top-8 h-full w-px bg-border" />
                    )}

                    {/* Icon */}
                    <div
                      data-slot="activity-icon"
                      className={cn(
                        APP_PATTERNS.activityTimeline.iconContainer,
                        "relative z-10 shrink-0",
                        ACTIVITY_TYPES[activity.type].bgColor
                      )}
                    >
                      <Icon className={cn("h-4 w-4", ACTIVITY_TYPES[activity.type].color)} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-1 pb-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.title}</p>
                          {activity.description && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {activity.description}
                            </p>
                          )}
                          {activity.actor && (
                            <p className="text-xs text-muted-foreground mt-1">
                              by {activity.actor}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {activity.type}
                          </Badge>
                          {activity.url && (
                            <Link href={activity.url}>
                              <Button variant="ghost" size="sm" className="h-6 px-2">
                                <ArrowRight className="h-3 w-3" />
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
