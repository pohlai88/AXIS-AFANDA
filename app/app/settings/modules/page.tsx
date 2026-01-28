import { SettingsLayout } from "@/app/components/settings-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  LayoutDashboard,
  Inbox,
  CheckSquare,
  MessageSquare,
  Video,
  Activity,
  ExternalLink,
  Code,
} from "lucide-react";
import { getEnabledModules, moduleRegistry } from "@/app/lib/module-registry";
import Link from "next/link";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Inbox,
  CheckSquare,
  MessageSquare,
  Video,
  Activity,
};

export default function ModulesSettingsPage() {
  const enabledModules = getEnabledModules();
  const allModules = moduleRegistry;

  return (
    <SettingsLayout title="Modules">
      <div className="layout-stack">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Module Registry</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage enabled modules and their configuration. Modules can be in-app components or external iframe integrations.
          </p>
        </div>

        <div className="mt-8 space-y-6">
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Modules</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{allModules.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {enabledModules.length} enabled
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">In-App Modules</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {allModules.filter((m) => m.type === "in-app").length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Native components
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Iframe Modules</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {allModules.filter((m) => m.type === "iframe").length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  External integrations
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Module List */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">All Modules</h3>
            {allModules.map((module) => {
              const Icon = iconMap[module.icon || ""] || Code;
              const isEnabled = module.enabled;

              return (
                <Card key={module.id} className={!isEnabled ? "opacity-60" : ""}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                          <Icon className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-lg">{module.name}</CardTitle>
                            <Badge variant={module.type === "in-app" ? "default" : "secondary"}>
                              {module.type}
                            </Badge>
                            {module.lazy && (
                              <Badge variant="outline" className="text-xs">
                                Lazy
                              </Badge>
                            )}
                          </div>
                          {module.description && (
                            <CardDescription className="mt-1">
                              {module.description}
                            </CardDescription>
                          )}
                          <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Route: {module.route}</span>
                            {module.url && (
                              <span className="flex items-center gap-1">
                                <ExternalLink className="h-3 w-3" />
                                {module.url}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={isEnabled}
                          disabled
                          aria-label={`Enable ${module.name}`}
                        />
                        <Label htmlFor={`module-${module.id}`} className="text-sm">
                          {isEnabled ? "Enabled" : "Disabled"}
                        </Label>
                      </div>
                      <div className="flex gap-2">
                        {module.route && (
                          <Link href={module.route}>
                            <Button variant="outline" size="sm">
                              Open Module
                              <ExternalLink className="ml-2 h-3 w-3" />
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Info Card */}
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle className="text-sm">About Module Registry</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>
                The module registry defines which modules are available in the shell. Modules can be:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>
                  <strong>In-app:</strong> Native React components built into the shell
                </li>
                <li>
                  <strong>Iframe:</strong> External applications embedded via iframe
                </li>
              </ul>
              <p className="mt-2">
                Module configuration is managed in <code className="text-xs bg-muted px-1 py-0.5 rounded">app/lib/module-registry.ts</code>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </SettingsLayout>
  );
}
