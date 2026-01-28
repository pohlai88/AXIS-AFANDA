"use client";

import { SettingsLayout } from "@/app/components/settings-layout";
import { 
  Activity, FileText, Database, Server, AlertTriangle, 
  Download, RefreshCw, CheckCircle, XCircle, Clock,
  Eye, EyeOff, Filter, Search, Trash2, Archive
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function DiagnosticsSettingsPage() {
  return (
    <SettingsLayout title="Diagnostics & Troubleshooting">
      <div className="layout-stack">
        <div className="flex items-center gap-3">
          <div className="bg-lux-gold-soft flex h-12 w-12 items-center justify-center rounded-xl">
            <Activity className="h-6 w-6 text-lux-gold" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-foreground">Diagnostics & Troubleshooting</h2>
            <p className="text-sm text-muted-foreground">
              Server diagnostics, logging, audit logs, and system monitoring
            </p>
          </div>
        </div>

        <Tabs defaultValue="diagnostics" className="mt-8">
          <TabsList className="grid w-full grid-cols-5 max-w-full overflow-x-auto">
            <TabsTrigger value="diagnostics">Diagnostics</TabsTrigger>
            <TabsTrigger value="logging">Logging</TabsTrigger>
            <TabsTrigger value="audit">Audit Log</TabsTrigger>
            <TabsTrigger value="database">Database</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          </TabsList>

          {/* Server Diagnostics */}
          <TabsContent value="diagnostics" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  <CardTitle>Server Diagnostics Package</CardTitle>
                </div>
                <CardDescription>
                  Generate and download diagnostic packages for troubleshooting
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Diagnostic Package</AlertTitle>
                  <AlertDescription>
                    Diagnostic packages contain system information, logs, and configuration data. 
                    Use them when contacting support or troubleshooting issues.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <Label>Include in Diagnostic Package</Label>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-0.5">
                        <Label className="text-sm font-medium">System Information</Label>
                        <p className="text-xs text-muted-foreground">
                          Server version, OS, hardware
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-0.5">
                        <Label className="text-sm font-medium">Application Logs</Label>
                        <p className="text-xs text-muted-foreground">
                          Recent application logs
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-0.5">
                        <Label className="text-sm font-medium">Error Logs</Label>
                        <p className="text-xs text-muted-foreground">
                          Error and exception logs
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-0.5">
                        <Label className="text-sm font-medium">Configuration</Label>
                        <p className="text-xs text-muted-foreground">
                          Current configuration settings
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-0.5">
                        <Label className="text-sm font-medium">Database Status</Label>
                        <p className="text-xs text-muted-foreground">
                          Database connection and schema info
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-0.5">
                        <Label className="text-sm font-medium">Network Status</Label>
                        <p className="text-xs text-muted-foreground">
                          Network connectivity and endpoints
                        </p>
                      </div>
                      <Switch />
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-0.5">
                        <Label className="text-sm font-medium">Performance Metrics</Label>
                        <p className="text-xs text-muted-foreground">
                          CPU, memory, disk usage
                        </p>
                      </div>
                      <Switch />
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-0.5">
                        <Label className="text-sm font-medium">Module Status</Label>
                        <p className="text-xs text-muted-foreground">
                          Module registry and status
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Log Time Range</Label>
                  <Select defaultValue="24h">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1h">Last Hour</SelectItem>
                      <SelectItem value="6h">Last 6 Hours</SelectItem>
                      <SelectItem value="24h">Last 24 Hours</SelectItem>
                      <SelectItem value="7d">Last 7 Days</SelectItem>
                      <SelectItem value="30d">Last 30 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1">
                    <Download className="mr-2 h-4 w-4" />
                    Generate Diagnostic Package
                  </Button>
                  <Button variant="outline">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Recent Diagnostic Packages</Label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">diagnostics-2026-01-28-143022.zip</p>
                          <p className="text-xs text-muted-foreground">2 hours ago • 2.4 MB</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">diagnostics-2026-01-27-091545.zip</p>
                          <p className="text-xs text-muted-foreground">Yesterday • 2.1 MB</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Health Check</CardTitle>
                <CardDescription>
                  Quick system health status
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <Label>Database Connection</Label>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Healthy
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <Label>Redis Connection</Label>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Healthy
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <Label>Keycloak Integration</Label>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Connected
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <Label>Orchestrator API</Label>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Online
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      <Label>Jitsi Server</Label>
                    </div>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                      Warning
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <Label>Chatwoot Integration</Label>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Connected
                    </Badge>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Run Health Check
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Logging Configuration */}
          <TabsContent value="logging" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  <CardTitle>Logging Configuration</CardTitle>
                </div>
                <CardDescription>
                  Configure application logging levels and destinations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Global Log Level</Label>
                  <Select defaultValue="info">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="trace">Trace</SelectItem>
                      <SelectItem value="debug">Debug</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="warn">Warn</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                      <SelectItem value="fatal">Fatal</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Set the default logging level for all components
                  </p>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label>Component-Specific Log Levels</Label>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Orchestrator API</Label>
                      <Select defaultValue="info" className="w-32">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="trace">Trace</SelectItem>
                          <SelectItem value="debug">Debug</SelectItem>
                          <SelectItem value="info">Info</SelectItem>
                          <SelectItem value="warn">Warn</SelectItem>
                          <SelectItem value="error">Error</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Shell (Next.js)</Label>
                      <Select defaultValue="warn" className="w-32">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="trace">Trace</SelectItem>
                          <SelectItem value="debug">Debug</SelectItem>
                          <SelectItem value="info">Info</SelectItem>
                          <SelectItem value="warn">Warn</SelectItem>
                          <SelectItem value="error">Error</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Keycloak Integration</Label>
                      <Select defaultValue="warn" className="w-32">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="trace">Trace</SelectItem>
                          <SelectItem value="debug">Debug</SelectItem>
                          <SelectItem value="info">Info</SelectItem>
                          <SelectItem value="warn">Warn</SelectItem>
                          <SelectItem value="error">Error</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Chatwoot Integration</Label>
                      <Select defaultValue="info" className="w-32">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="trace">Trace</SelectItem>
                          <SelectItem value="debug">Debug</SelectItem>
                          <SelectItem value="info">Info</SelectItem>
                          <SelectItem value="warn">Warn</SelectItem>
                          <SelectItem value="error">Error</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Matrix Integration</Label>
                      <Select defaultValue="warn" className="w-32">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="trace">Trace</SelectItem>
                          <SelectItem value="debug">Debug</SelectItem>
                          <SelectItem value="info">Info</SelectItem>
                          <SelectItem value="warn">Warn</SelectItem>
                          <SelectItem value="error">Error</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Jitsi Integration</Label>
                      <Select defaultValue="warn" className="w-32">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="trace">Trace</SelectItem>
                          <SelectItem value="debug">Debug</SelectItem>
                          <SelectItem value="info">Info</SelectItem>
                          <SelectItem value="warn">Warn</SelectItem>
                          <SelectItem value="error">Error</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label>Log Destinations</Label>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Console Output</Label>
                      <p className="text-xs text-muted-foreground">
                        Output logs to console (stdout/stderr)
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>File Logging</Label>
                      <p className="text-xs text-muted-foreground">
                        Write logs to files
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="log-dir">Log Directory</Label>
                    <Input
                      id="log-dir"
                      defaultValue="/var/log/axis-afenda"
                      placeholder="/var/log/axis-afenda"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>External Logging Service</Label>
                      <p className="text-xs text-muted-foreground">
                        Send logs to external service (e.g., Datadog, Loggly)
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label>Log Rotation</Label>
                  
                  <div className="space-y-2">
                    <Label htmlFor="max-log-size">Max Log File Size (MB)</Label>
                    <Input
                      id="max-log-size"
                      type="number"
                      defaultValue="100"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="max-log-files">Max Log Files</Label>
                    <Input
                      id="max-log-files"
                      type="number"
                      defaultValue="10"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Compress Old Logs</Label>
                      <p className="text-xs text-muted-foreground">
                        Compress rotated log files
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <Button className="w-full">Save Logging Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audit Log */}
          <TabsContent value="audit" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  <CardTitle>Audit Log</CardTitle>
                </div>
                <CardDescription>
                  Configure audit logging for security and compliance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Audit Logging</Label>
                    <p className="text-xs text-muted-foreground">
                      Record all security-relevant events
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label>Audit Events to Log</Label>
                  
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="flex items-center justify-between p-2 border rounded">
                      <Label className="text-sm">User Authentication</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-2 border rounded">
                      <Label className="text-sm">User Authorization</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-2 border rounded">
                      <Label className="text-sm">Configuration Changes</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-2 border rounded">
                      <Label className="text-sm">Data Access</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-2 border rounded">
                      <Label className="text-sm">Data Modifications</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-2 border rounded">
                      <Label className="text-sm">Approval Actions</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-2 border rounded">
                      <Label className="text-sm">Team Changes</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-2 border rounded">
                      <Label className="text-sm">Integration Events</Label>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between p-2 border rounded">
                      <Label className="text-sm">Security Events</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-2 border rounded">
                      <Label className="text-sm">System Events</Label>
                      <Switch />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label>Audit Log Storage</Label>
                  
                  <div className="space-y-2">
                    <Label>Storage Type</Label>
                    <Select defaultValue="database">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="database">Database</SelectItem>
                        <SelectItem value="file">File System</SelectItem>
                        <SelectItem value="external">External Service</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="audit-retention">Retention Period (days)</Label>
                    <Input
                      id="audit-retention"
                      type="number"
                      defaultValue="365"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Archive Old Logs</Label>
                      <p className="text-xs text-muted-foreground">
                        Archive audit logs older than retention period
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label>Audit Log Access</Label>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Require Admin Role</Label>
                      <p className="text-xs text-muted-foreground">
                        Only admins can view audit logs
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Export Audit Logs</Label>
                      <p className="text-xs text-muted-foreground">
                        Allow exporting audit logs (CSV/JSON)
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <Button className="w-full">Save Audit Log Settings</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>View Audit Log</CardTitle>
                <CardDescription>
                  Search and filter audit log entries
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input placeholder="Search audit log..." />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Events</SelectItem>
                      <SelectItem value="auth">Authentication</SelectItem>
                      <SelectItem value="config">Configuration</SelectItem>
                      <SelectItem value="data">Data Access</SelectItem>
                      <SelectItem value="security">Security</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>

                <div className="border rounded-lg">
                  <div className="p-4 border-b">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">User login</p>
                        <p className="text-xs text-muted-foreground">admin@example.com • 2 hours ago</p>
                      </div>
                      <Badge variant="outline">Authentication</Badge>
                    </div>
                  </div>
                  <div className="p-4 border-b">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Configuration updated</p>
                        <p className="text-xs text-muted-foreground">Settings → General • 5 hours ago</p>
                      </div>
                      <Badge variant="outline">Configuration</Badge>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Approval decision</p>
                        <p className="text-xs text-muted-foreground">Approval #1234 • Approved • Yesterday</p>
                      </div>
                      <Badge variant="outline">Data</Badge>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <Download className="mr-2 h-4 w-4" />
                    Export Logs
                  </Button>
                  <Button variant="outline">
                    <Archive className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Database Troubleshooting */}
          <TabsContent value="database" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  <CardTitle>Database Migration & Troubleshooting</CardTitle>
                </div>
                <CardDescription>
                  Monitor database migrations and troubleshoot issues
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <Label className="font-medium">Database Status</Label>
                      <p className="text-xs text-muted-foreground">PostgreSQL 16.2</p>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Connected
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <Label className="font-medium">Schema Version</Label>
                      <p className="text-xs text-muted-foreground">v1.2.3</p>
                    </div>
                    <Badge variant="outline">Current</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <Label className="font-medium">Pending Migrations</Label>
                      <p className="text-xs text-muted-foreground">0 pending</p>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Up to date
                    </Badge>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label>Migration Management</Label>
                  
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">
                      Database migrations are automatically applied on server startup. 
                      Use manual migration only for troubleshooting.
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Check Migrations
                      </Button>
                      <Button variant="outline" size="sm">
                        View Migration History
                      </Button>
                    </div>
                  </div>

                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Migration Safety</AlertTitle>
                    <AlertDescription>
                      Always backup your database before running migrations manually. 
                      Automatic migrations are recommended for production.
                    </AlertDescription>
                  </Alert>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label>Database Connection</Label>
                  
                  <div className="space-y-2">
                    <Label htmlFor="db-host">Host</Label>
                    <Input
                      id="db-host"
                      defaultValue="localhost"
                      disabled
                    />
                  </div>

                  <div className="grid gap-2 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="db-port">Port</Label>
                      <Input
                        id="db-port"
                        type="number"
                        defaultValue="5432"
                        disabled
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="db-name">Database Name</Label>
                      <Input
                        id="db-name"
                        defaultValue="axis_afenda"
                        disabled
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Connection Pooling</Label>
                      <p className="text-xs text-muted-foreground">
                        Enable connection pooling for better performance
                      </p>
                    </div>
                    <Switch defaultChecked disabled />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label>Database Health</Label>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-sm">Active Connections</Label>
                        <Badge variant="outline">12/100</Badge>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-green-600" style={{ width: '12%' }} />
                      </div>
                    </div>

                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-sm">Database Size</Label>
                        <Badge variant="outline">2.4 GB</Badge>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600" style={{ width: '48%' }} />
                      </div>
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Test Database Connection
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Monitoring */}
          <TabsContent value="monitoring" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  <CardTitle>System Monitoring</CardTitle>
                </div>
                <CardDescription>
                  Monitor system health and performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm font-medium">CPU Usage</Label>
                      <Badge variant="outline">45%</Badge>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600" style={{ width: '45%' }} />
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm font-medium">Memory Usage</Label>
                      <Badge variant="outline">62%</Badge>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-green-600" style={{ width: '62%' }} />
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm font-medium">Disk Usage</Label>
                      <Badge variant="outline">38%</Badge>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-600" style={{ width: '38%' }} />
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm font-medium">Network I/O</Label>
                      <Badge variant="outline">1.2 MB/s</Badge>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-purple-600" style={{ width: '30%' }} />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label>Monitoring Settings</Label>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Enable Performance Monitoring</Label>
                      <p className="text-xs text-muted-foreground">
                        Collect and display performance metrics
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="space-y-2">
                    <Label>Metrics Collection Interval</Label>
                    <Select defaultValue="30s">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10s">10 seconds</SelectItem>
                        <SelectItem value="30s">30 seconds</SelectItem>
                        <SelectItem value="1m">1 minute</SelectItem>
                        <SelectItem value="5m">5 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Alert on High Usage</Label>
                      <p className="text-xs text-muted-foreground">
                        Send alerts when resource usage exceeds thresholds
                      </p>
                    </div>
                    <Switch />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cpu-threshold">CPU Alert Threshold (%)</Label>
                    <Input
                      id="cpu-threshold"
                      type="number"
                      defaultValue="80"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="memory-threshold">Memory Alert Threshold (%)</Label>
                    <Input
                      id="memory-threshold"
                      type="number"
                      defaultValue="85"
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label>External Monitoring</Label>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Prometheus Metrics</Label>
                      <p className="text-xs text-muted-foreground">
                        Expose metrics endpoint for Prometheus
                      </p>
                    </div>
                    <Switch />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="metrics-endpoint">Metrics Endpoint</Label>
                    <Input
                      id="metrics-endpoint"
                      defaultValue="/metrics"
                      placeholder="/metrics"
                    />
                  </div>
                </div>

                <Button className="w-full">Save Monitoring Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SettingsLayout>
  );
}
