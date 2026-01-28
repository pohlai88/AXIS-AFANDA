"use client";

import { SettingsLayout } from "@/app/components/settings-layout";
import { Shield, Lock, Key, Users, FileText, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function SecuritySettingsPage() {
  return (
    <SettingsLayout title="Security">
      <div className="layout-stack">
        <div className="flex items-center gap-3">
          <div className="bg-lux-gold-soft flex h-12 w-12 items-center justify-center rounded-xl">
            <Shield className="h-6 w-6 text-lux-gold" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-foreground">Security</h2>
            <p className="text-sm text-muted-foreground">
              Configure security policies, authentication, and access control
            </p>
          </div>
        </div>

        <Tabs defaultValue="authentication" className="mt-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="authentication">Authentication</TabsTrigger>
            <TabsTrigger value="access">Access Control</TabsTrigger>
            <TabsTrigger value="data">Data Security</TabsTrigger>
            <TabsTrigger value="audit">Audit Log</TabsTrigger>
          </TabsList>

          {/* Authentication */}
          <TabsContent value="authentication" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  <CardTitle>Authentication</CardTitle>
                </div>
                <CardDescription>
                  Configure authentication methods and session management
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Primary Authentication</Label>
                  <Select defaultValue="keycloak">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="keycloak">Keycloak (OIDC/OAuth2)</SelectItem>
                      <SelectItem value="local">Local Authentication</SelectItem>
                      <SelectItem value="saml">SAML 2.0</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable SSO</Label>
                    <p className="text-xs text-muted-foreground">
                      Single sign-on via Keycloak
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                  <Input
                    id="session-timeout"
                    type="number"
                    defaultValue="480"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Remember Me</Label>
                    <p className="text-xs text-muted-foreground">
                      Allow extended session duration
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="remember-days">Remember Me Duration (days)</Label>
                  <Input
                    id="remember-days"
                    type="number"
                    defaultValue="30"
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require MFA</Label>
                    <p className="text-xs text-muted-foreground">
                      Require multi-factor authentication
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="space-y-2">
                  <Label>MFA Method</Label>
                  <Select defaultValue="totp">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="totp">TOTP (Authenticator App)</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full">Save Authentication Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Access Control */}
          <TabsContent value="access" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <CardTitle>Access Control</CardTitle>
                </div>
                <CardDescription>
                  Configure role-based access control and permissions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Note:</strong> Permissions are managed in Keycloak. 
                    This section shows read-only permission information.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Permission Source</Label>
                  <Select defaultValue="keycloak" disabled>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="keycloak">Keycloak (SSOT)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label>Role Hierarchy</Label>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <Label className="font-medium">Organization Admin</Label>
                        <p className="text-xs text-muted-foreground">
                          Full access to organization
                        </p>
                      </div>
                      <Badge variant="default">Keycloak</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <Label className="font-medium">Team Owner</Label>
                        <p className="text-xs text-muted-foreground">
                          Full access to team
                        </p>
                      </div>
                      <Badge variant="secondary">Self-managed</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <Label className="font-medium">Team Admin</Label>
                        <p className="text-xs text-muted-foreground">
                          Manage team members
                        </p>
                      </div>
                      <Badge variant="secondary">Self-managed</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <Label className="font-medium">Team Member</Label>
                        <p className="text-xs text-muted-foreground">
                          Basic team access
                        </p>
                      </div>
                      <Badge variant="secondary">Self-managed</Badge>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Tenant Isolation</Label>
                    <p className="text-xs text-muted-foreground">
                      Enforce strict tenant data isolation
                    </p>
                  </div>
                  <Switch defaultChecked disabled />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Security */}
          <TabsContent value="data" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  <CardTitle>Data Security</CardTitle>
                </div>
                <CardDescription>
                  Configure data encryption, retention, and privacy
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Encrypt Data at Rest</Label>
                    <p className="text-xs text-muted-foreground">
                      Encrypt database and file storage
                    </p>
                  </div>
                  <Switch defaultChecked disabled />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Encrypt Data in Transit</Label>
                    <p className="text-xs text-muted-foreground">
                      Use TLS/SSL for all connections
                    </p>
                  </div>
                  <Switch defaultChecked disabled />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="data-retention">Data Retention Policy (days)</Label>
                  <Input
                    id="data-retention"
                    type="number"
                    defaultValue="365"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-delete Expired Data</Label>
                    <p className="text-xs text-muted-foreground">
                      Automatically delete data after retention period
                    </p>
                  </div>
                  <Switch />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable GDPR Compliance</Label>
                    <p className="text-xs text-muted-foreground">
                      Enable data export and deletion features
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="space-y-2">
                  <Label>Privacy Policy URL</Label>
                  <Input
                    placeholder="https://example.com/privacy"
                  />
                </div>

                <Button className="w-full">Save Data Security Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audit Log */}
          <TabsContent value="audit" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  <CardTitle>Audit Log</CardTitle>
                </div>
                <CardDescription>
                  Configure audit logging and compliance tracking
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Audit Log</Label>
                    <p className="text-xs text-muted-foreground">
                      Log all security-relevant events
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="space-y-2">
                  <Label>Audit Log Level</Label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Events</SelectItem>
                      <SelectItem value="security">Security Events Only</SelectItem>
                      <SelectItem value="critical">Critical Events Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <Label>Events to Log</Label>
                  
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">User Login/Logout</Label>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Permission Changes</Label>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Data Access</Label>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Configuration Changes</Label>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Approval Actions</Label>
                    <Switch defaultChecked />
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="audit-retention">Audit Log Retention (days)</Label>
                  <Input
                    id="audit-retention"
                    type="number"
                    defaultValue="2555"
                  />
                  <p className="text-xs text-muted-foreground">
                    Recommended: 7 years for compliance
                  </p>
                </div>

                <Button className="w-full">Save Audit Settings</Button>
                <Button variant="outline" className="w-full">Export Audit Log</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SettingsLayout>
  );
}
