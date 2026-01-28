"use client";

import * as React from "react";
import { formatDistanceToNow } from "date-fns";
import { CheckSquare, MessageSquare, Users, Activity, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useActivityStore, type ActivityItem } from "@/app/lib/stores/activity-store";
import Link from "next/link";

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
        <ScrollArea className="h-[600px]">
          {activities.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No activity yet. Activity will appear here as you use the system.
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity, index) => {
                const Icon = activityIcons[activity.type];
                const isLast = index === activities.length - 1;

                return (
                  <div key={activity.id} className="relative flex gap-4">
                    {/* Timeline line */}
                    {!isLast && (
                      <div className="absolute left-4 top-8 h-full w-px bg-border" />
                    )}
                    
                    {/* Icon */}
                    <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                      <Icon className="h-4 w-4 text-muted-foreground" />
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
