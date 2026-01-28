"use client";

import { SettingsLayout } from "@/app/components/settings-layout";
import { Settings, Server, Globe, Key, Database, Search, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export default function SettingsPage() {
  return (
    <SettingsLayout title="General">
      <div className="layout-stack">
        <div className="flex items-center gap-3">
          <div className="bg-lux-gold-soft flex h-12 w-12 items-center justify-center rounded-xl">
            <Settings className="h-6 w-6 text-lux-gold" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-foreground">General Settings</h2>
            <p className="text-sm text-muted-foreground">
              Configure server settings, localization, API keys, and system preferences
            </p>
          </div>
        </div>

        <Tabs defaultValue="server" className="mt-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="server">Server</TabsTrigger>
            <TabsTrigger value="localization">Localization</TabsTrigger>
            <TabsTrigger value="api-keys">API Keys</TabsTrigger>
            <TabsTrigger value="search">Search</TabsTrigger>
          </TabsList>

          {/* Server Configuration */}
          <TabsContent value="server" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  <CardTitle>Server Configuration</CardTitle>
                </div>
                <CardDescription>
                  Configure the Orchestrator API server and connection settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="api-url">API Base URL</Label>
                  <Input
                    id="api-url"
                    placeholder="https://api.example.com/api/v1"
                    defaultValue={process.env.NEXT_PUBLIC_API_URL || "/api/v1"}
                  />
                  <p className="text-xs text-muted-foreground">
                    Base URL for the Orchestrator API
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeout">Request Timeout (seconds)</Label>
                  <Input
                    id="timeout"
                    type="number"
                    defaultValue="30"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Request Retries</Label>
                    <p className="text-xs text-muted-foreground">
                      Automatically retry failed requests
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max-retries">Max Retries</Label>
                  <Input
                    id="max-retries"
                    type="number"
                    defaultValue="3"
                    disabled
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="db-url">Database Connection</Label>
                  <Input
                    id="db-url"
                    type="password"
                    placeholder="postgresql://..."
                  />
                  <p className="text-xs text-muted-foreground">
                    Managed by Orchestrator. Display only.
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Database Pooling</Label>
                    <p className="text-xs text-muted-foreground">
                      Use connection pooling for better performance
                    </p>
                  </div>
                  <Switch defaultChecked disabled />
                </div>

                <Button className="w-full">Save Server Settings</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  <CardTitle>Data Management</CardTitle>
                </div>
                <CardDescription>
                  Configure data retention and export policies
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="retention-days">Data Retention (days)</Label>
                  <Input
                    id="retention-days"
                    type="number"
                    defaultValue="365"
                  />
                  <p className="text-xs text-muted-foreground">
                    How long to keep activity logs and audit trails
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-archive Old Data</Label>
                    <p className="text-xs text-muted-foreground">
                      Automatically archive data older than retention period
                    </p>
                  </div>
                  <Switch />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Export Configuration</Label>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <FileText className="mr-2 h-4 w-4" />
                      Export Config
                    </Button>
                    <Button variant="outline" size="sm">
                      Import Config
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Localization */}
          <TabsContent value="localization" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  <CardTitle>Localization</CardTitle>
                </div>
                <CardDescription>
                  Configure language, date format, and regional settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="default-locale">Default Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger id="default-locale">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="zh">Chinese</SelectItem>
                      <SelectItem value="ja">Japanese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date-format">Date Format</Label>
                  <Select defaultValue="iso">
                    <SelectTrigger id="date-format">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="iso">ISO 8601 (2024-01-28)</SelectItem>
                      <SelectItem value="us">US (01/28/2024)</SelectItem>
                      <SelectItem value="eu">European (28/01/2024)</SelectItem>
                      <SelectItem value="uk">UK (28 Jan 2024)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time-format">Time Format</Label>
                  <Select defaultValue="24h">
                    <SelectTrigger id="time-format">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24h">24-hour (14:30)</SelectItem>
                      <SelectItem value="12h">12-hour (2:30 PM)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select defaultValue="utc">
                    <SelectTrigger id="timezone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utc">UTC</SelectItem>
                      <SelectItem value="est">Eastern Time (EST)</SelectItem>
                      <SelectItem value="pst">Pacific Time (PST)</SelectItem>
                      <SelectItem value="cet">Central European Time (CET)</SelectItem>
                      <SelectItem value="jst">Japan Standard Time (JST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-detect User Locale</Label>
                    <p className="text-xs text-muted-foreground">
                      Use browser language preference
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Button className="w-full">Save Localization Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Keys */}
          <TabsContent value="api-keys" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  <CardTitle>API Keys</CardTitle>
                </div>
                <CardDescription>
                  Manage API keys for external integrations and webhooks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Label className="font-medium">Orchestrator API Key</Label>
                        <Badge variant="secondary">Active</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Created 2 days ago • Last used 1 hour ago
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Copy</Button>
                      <Button variant="outline" size="sm">Regenerate</Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Label className="font-medium">Webhook Secret</Label>
                        <Badge variant="secondary">Active</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Used for Chatwoot, Matrix webhooks
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Copy</Button>
                      <Button variant="outline" size="sm">Regenerate</Button>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Create New API Key</Label>
                  <div className="flex gap-2">
                    <Input placeholder="Key name (e.g., 'External Service')" />
                    <Button>Create</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Search Configuration */}
          <TabsContent value="search" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  <CardTitle>Full-Text Search</CardTitle>
                </div>
                <CardDescription>
                  Configure search indexing and query settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Full-Text Search</Label>
                    <p className="text-xs text-muted-foreground">
                      Index conversations, messages, and documents for search
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="search-provider">Search Provider</Label>
                  <Select defaultValue="postgres">
                    <SelectTrigger id="search-provider">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="postgres">PostgreSQL Full-Text Search</SelectItem>
                      <SelectItem value="elasticsearch">Elasticsearch</SelectItem>
                      <SelectItem value="algolia">Algolia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="index-interval">Index Update Interval (minutes)</Label>
                  <Input
                    id="index-interval"
                    type="number"
                    defaultValue="5"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Search in Messages</Label>
                    <p className="text-xs text-muted-foreground">
                      Include message content in search results
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Search in Documents</Label>
                    <p className="text-xs text-muted-foreground">
                      Include document content in search results
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Button className="w-full">Save Search Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SettingsLayout>
  );
}
