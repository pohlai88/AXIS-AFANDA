"use client";

import { SettingsLayout } from "@/app/components/settings-layout";
import { Plug, MessageSquare, Video, Users, Key, Webhook } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function IntegrationsSettingsPage() {
  return (
    <SettingsLayout title="Integrations">
      <div className="layout-stack">
        <div className="flex items-center gap-3">
          <div className="bg-lux-gold-soft flex h-12 w-12 items-center justify-center rounded-xl">
            <Plug className="h-6 w-6 text-lux-gold" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-foreground">Integrations</h2>
            <p className="text-sm text-muted-foreground">
              Configure external service integrations: Chatwoot, Matrix, Jitsi, and Keycloak
            </p>
          </div>
        </div>

        <Tabs defaultValue="chatwoot" className="mt-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="chatwoot">Chatwoot</TabsTrigger>
            <TabsTrigger value="matrix">Matrix</TabsTrigger>
            <TabsTrigger value="jitsi">Jitsi</TabsTrigger>
            <TabsTrigger value="keycloak">Keycloak</TabsTrigger>
          </TabsList>

          {/* Chatwoot Integration */}
          <TabsContent value="chatwoot" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  <CardTitle>Chatwoot (Omnichannel)</CardTitle>
                  <Badge variant="secondary">Active</Badge>
                </div>
                <CardDescription>
                  Configure Chatwoot integration for customer support
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Chatwoot</Label>
                    <p className="text-xs text-muted-foreground">
                      Connect to Chatwoot for omnichannel support
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="chatwoot-url">Chatwoot Server URL</Label>
                  <Input
                    id="chatwoot-url"
                    placeholder="https://app.chatwoot.com"
                    defaultValue={process.env.NEXT_PUBLIC_CHATWOOT_URL || ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="chatwoot-api-key">API Access Token</Label>
                  <Input
                    id="chatwoot-api-key"
                    type="password"
                    placeholder="Enter API access token"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="chatwoot-account-id">Account ID</Label>
                  <Input
                    id="chatwoot-account-id"
                    placeholder="Enter Chatwoot account ID"
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label>Webhook Configuration</Label>
                  
                  <div className="space-y-2">
                    <Label htmlFor="webhook-url">Webhook URL</Label>
                    <Input
                      id="webhook-url"
                      placeholder="https://your-domain.com/api/v1/webhooks/chatwoot"
                      disabled
                    />
                    <p className="text-xs text-muted-foreground">
                      Configure this URL in Chatwoot webhook settings
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="webhook-secret">Webhook Secret</Label>
                    <Input
                      id="webhook-secret"
                      type="password"
                      placeholder="Enter webhook secret"
                    />
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Sync Conversations</Label>
                    <p className="text-xs text-muted-foreground">
                      Automatically sync conversations from Chatwoot
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Sync Agents</Label>
                    <p className="text-xs text-muted-foreground">
                      Sync agent data from Chatwoot
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Button className="w-full">Save Chatwoot Settings</Button>
                <Button variant="outline" className="w-full">Test Connection</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Matrix Integration */}
          <TabsContent value="matrix" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <CardTitle>Matrix (Team Chat)</CardTitle>
                  <Badge variant="secondary">Active</Badge>
                </div>
                <CardDescription>
                  Configure Matrix integration for team chat
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Matrix</Label>
                    <p className="text-xs text-muted-foreground">
                      Connect to Matrix for team chat
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="matrix-server">Matrix Server URL</Label>
                  <Input
                    id="matrix-server"
                    placeholder="https://matrix.example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="matrix-user-id">User ID</Label>
                  <Input
                    id="matrix-user-id"
                    placeholder="@user:matrix.example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="matrix-access-token">Access Token</Label>
                  <Input
                    id="matrix-access-token"
                    type="password"
                    placeholder="Enter access token"
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label>Webhook Configuration</Label>
                  
                  <div className="space-y-2">
                    <Label htmlFor="matrix-webhook-url">Webhook URL</Label>
                    <Input
                      id="matrix-webhook-url"
                      placeholder="https://your-domain.com/api/v1/webhooks/matrix"
                      disabled
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Sync Rooms</Label>
                    <p className="text-xs text-muted-foreground">
                      Sync Matrix rooms as team channels
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Button className="w-full">Save Matrix Settings</Button>
                <Button variant="outline" className="w-full">Test Connection</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Jitsi Integration */}
          <TabsContent value="jitsi" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  <CardTitle>Jitsi Meet (Video Calls)</CardTitle>
                  <Badge variant="secondary">Active</Badge>
                </div>
                <CardDescription>
                  Configure Jitsi Meet for video consultations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Jitsi</Label>
                    <p className="text-xs text-muted-foreground">
                      Connect to Jitsi Meet for video calls
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jitsi-domain">Jitsi Domain</Label>
                  <Input
                    id="jitsi-domain"
                    placeholder="meet.jit.si"
                    defaultValue={process.env.NEXT_PUBLIC_JITSI_URL?.replace("https://", "") || "meet.jit.si"}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jitsi-app-id">Application ID (optional)</Label>
                  <Input
                    id="jitsi-app-id"
                    placeholder="Enter app ID for custom deployment"
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Authentication</Label>
                    <p className="text-xs text-muted-foreground">
                      Require JWT authentication for rooms
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jitsi-secret">JWT Secret (if enabled)</Label>
                  <Input
                    id="jitsi-secret"
                    type="password"
                    placeholder="Enter JWT secret"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Recording</Label>
                    <p className="text-xs text-muted-foreground">
                      Allow recording of video calls
                    </p>
                  </div>
                  <Switch />
                </div>

                <Button className="w-full">Save Jitsi Settings</Button>
                <Button variant="outline" className="w-full">Test Connection</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Keycloak Integration */}
          <TabsContent value="keycloak" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  <CardTitle>Keycloak (Identity & Access)</CardTitle>
                  <Badge variant="default">SSOT</Badge>
                </div>
                <CardDescription>
                  Configure Keycloak as single source of truth for identity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="keycloak-url">Keycloak Server URL</Label>
                  <Input
                    id="keycloak-url"
                    placeholder="https://keycloak.example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="keycloak-realm">Realm</Label>
                  <Input
                    id="keycloak-realm"
                    placeholder="axis-afenda"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="keycloak-client-id">Client ID</Label>
                  <Input
                    id="keycloak-client-id"
                    placeholder="axis-afenda-shell"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="keycloak-client-secret">Client Secret</Label>
                  <Input
                    id="keycloak-client-secret"
                    type="password"
                    placeholder="Enter client secret"
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label>Sync Configuration</Label>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Sync Users</Label>
                      <p className="text-xs text-muted-foreground">
                        Sync users from Keycloak
                      </p>
                    </div>
                    <Switch defaultChecked disabled />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Sync Organizations</Label>
                      <p className="text-xs text-muted-foreground">
                        Sync organizations from Keycloak groups
                      </p>
                    </div>
                    <Switch defaultChecked disabled />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sync-interval">Sync Interval (minutes)</Label>
                    <Input
                      id="sync-interval"
                      type="number"
                      defaultValue="15"
                    />
                  </div>
                </div>

                <Separator />

                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Note:</strong> Keycloak is the single source of truth for identity and permissions. 
                    Teams are self-managed and do not sync to Keycloak.
                  </p>
                </div>

                <Button className="w-full">Save Keycloak Settings</Button>
                <Button variant="outline" className="w-full">Test Connection</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SettingsLayout>
  );
}
