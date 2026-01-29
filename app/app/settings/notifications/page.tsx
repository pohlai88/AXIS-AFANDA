"use client";

import { SettingsLayout } from "@/app/components/settings-layout";
import { Bell, Smartphone, Globe, Pause, Settings as SettingsIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function NotificationsSettingsPage() {
  return (
    <SettingsLayout title="Notifications">
      <div className="layout-stack">
        <div className="flex items-center gap-3">
          <div className="bg-lux-gold-soft flex h-12 w-12 items-center justify-center rounded-xl">
            <Bell className="h-6 w-6 text-lux-gold" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-foreground">Notifications</h2>
            <p className="text-sm text-muted-foreground">
              Configure push notifications, web notifications, permissions, and pause settings
            </p>
          </div>
        </div>

        <Tabs defaultValue="web" className="mt-8">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="web">Web</TabsTrigger>
            <TabsTrigger value="push">Push</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
            <TabsTrigger value="pause">Pause</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          {/* Web Notifications */}
          <TabsContent value="web" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  <CardTitle>Web Browser Notifications</CardTitle>
                </div>
                <CardDescription>
                  Configure browser-based notifications and permissions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Web Notifications</Label>
                    <p className="text-xs text-muted-foreground">
                      Show browser notifications for new messages and events
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label>Notification Types</Label>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">New Messages</Label>
                      <p className="text-xs text-muted-foreground">
                        Notify when new messages arrive in conversations
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Approval Requests</Label>
                      <p className="text-xs text-muted-foreground">
                        Notify when approval is requested
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Team Invitations</Label>
                      <p className="text-xs text-muted-foreground">
                        Notify when invited to a team
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Conversation Assignments</Label>
                      <p className="text-xs text-muted-foreground">
                        Notify when conversation is assigned to you
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">System Updates</Label>
                      <p className="text-xs text-muted-foreground">
                        Notify about system changes and maintenance
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Notification Badge</Label>
                    <p className="text-xs text-muted-foreground">
                      Display unread count in browser tab favicon
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Group Notifications</Label>
                    <p className="text-xs text-muted-foreground">
                      Group multiple notifications together
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="space-y-2">
                  <Label>Notification Position</Label>
                  <Select defaultValue="top-right">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="top-right">Top Right</SelectItem>
                      <SelectItem value="top-left">Top Left</SelectItem>
                      <SelectItem value="bottom-right">Bottom Right</SelectItem>
                      <SelectItem value="bottom-left">Bottom Left</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notification-duration">Notification Duration (seconds)</Label>
                  <Input
                    id="notification-duration"
                    type="number"
                    defaultValue="5"
                  />
                </div>

                <Button className="w-full">Save Web Notification Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Push Notifications */}
          <TabsContent value="push" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  <CardTitle>Mobile Push Notifications</CardTitle>
                </div>
                <CardDescription>
                  Configure push notifications for mobile devices (iOS and Android)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Push Notifications</Label>
                    <p className="text-xs text-muted-foreground">
                      Send push notifications to mobile devices
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="space-y-2">
                  <Label>Push Service Provider</Label>
                  <Select defaultValue="fcm">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fcm">Firebase Cloud Messaging (FCM)</SelectItem>
                      <SelectItem value="apns">Apple Push Notification Service (APNS)</SelectItem>
                      <SelectItem value="web-push">Web Push Protocol</SelectItem>
                      <SelectItem value="custom">Custom Provider</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label>Notification Channels</Label>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">High Priority</Label>
                      <p className="text-xs text-muted-foreground">
                        Urgent messages, approvals, and critical alerts
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Normal Priority</Label>
                      <p className="text-xs text-muted-foreground">
                        Regular messages and updates
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Low Priority</Label>
                      <p className="text-xs text-muted-foreground">
                        Background updates and summaries
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Push Notification Sound</Label>
                  <Select defaultValue="default">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="none">None (Silent)</SelectItem>
                      <SelectItem value="custom">Custom Sound</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Notification Preview</Label>
                    <p className="text-xs text-muted-foreground">
                      Show message preview in notification
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Vibrate on Notification</Label>
                    <p className="text-xs text-muted-foreground">
                      Vibrate device when notification arrives
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Button className="w-full">Save Push Notification Settings</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Push Notification Configuration</CardTitle>
                <CardDescription>
                  Configure push notification service credentials
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fcm-server-key">FCM Server Key (if using FCM)</Label>
                  <Input
                    id="fcm-server-key"
                    type="password"
                    placeholder="Enter FCM server key"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apns-key-id">APNS Key ID (if using APNS)</Label>
                  <Input
                    id="apns-key-id"
                    placeholder="Enter APNS key ID"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apns-team-id">APNS Team ID</Label>
                  <Input
                    id="apns-team-id"
                    placeholder="Enter APNS team ID"
                  />
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Note:</strong> Push notification credentials are managed securely.
                    Contact your administrator to configure push services.
                  </p>
                </div>

                <Button variant="outline" className="w-full">Test Push Notification</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Web Notification Permissions */}
          <TabsContent value="permissions" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <SettingsIcon className="h-5 w-5" />
                  <CardTitle>Web Notification Permissions</CardTitle>
                </div>
                <CardDescription>
                  Manage browser notification permissions and settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Current Permission Status</Label>
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Browser Permission</span>
                      <Badge variant="secondary">Granted</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Your browser has granted notification permissions
                    </p>
                    <div className="flex gap-2 mt-3">
                      <Button variant="outline" size="sm">Request Permission</Button>
                      <Button variant="outline" size="sm">Revoke Permission</Button>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label>Permission Request Settings</Label>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto-request Permission</Label>
                      <p className="text-xs text-muted-foreground">
                        Automatically request permission on first visit
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="space-y-2">
                    <Label>Permission Request Timing</Label>
                    <Select defaultValue="immediate">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">Immediate (on page load)</SelectItem>
                        <SelectItem value="delayed">Delayed (after 30 seconds)</SelectItem>
                        <SelectItem value="on-interaction">On User Interaction</SelectItem>
                        <SelectItem value="manual">Manual (button click only)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Permission Request Message</Label>
                    <Input
                      placeholder="We'd like to send you notifications..."
                      defaultValue="We'd like to send you notifications for important updates"
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label>Permission Handling</Label>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Show Permission Denied Message</Label>
                      <p className="text-xs text-muted-foreground">
                        Show instructions if permission is denied
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Allow Permission Re-request</Label>
                      <p className="text-xs text-muted-foreground">
                        Allow users to request permission again after denial
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <Button className="w-full">Save Permission Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pause Notifications */}
          <TabsContent value="pause" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Pause className="h-5 w-5" />
                  <CardTitle>Pause Notifications</CardTitle>
                </div>
                <CardDescription>
                  Configure when to pause mobile and web push notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Pause Functionality</Label>
                    <p className="text-xs text-muted-foreground">
                      Allow users to pause notifications temporarily
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label>Pause Mobile Push Notifications</Label>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Enable Pause</Label>
                      <p className="text-xs text-muted-foreground">
                        Allow pausing mobile push notifications
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="space-y-2">
                    <Label>Default Pause Duration</Label>
                    <Select defaultValue="1-hour">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15-min">15 minutes</SelectItem>
                        <SelectItem value="30-min">30 minutes</SelectItem>
                        <SelectItem value="1-hour">1 hour</SelectItem>
                        <SelectItem value="2-hours">2 hours</SelectItem>
                        <SelectItem value="until-tomorrow">Until tomorrow</SelectItem>
                        <SelectItem value="custom">Custom duration</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Allow Indefinite Pause</Label>
                      <p className="text-xs text-muted-foreground">
                        Allow users to pause indefinitely until manually resumed
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label>Pause Web Notifications</Label>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Enable Pause</Label>
                      <p className="text-xs text-muted-foreground">
                        Allow pausing web browser notifications
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="space-y-2">
                    <Label>Default Pause Duration</Label>
                    <Select defaultValue="1-hour">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15-min">15 minutes</SelectItem>
                        <SelectItem value="30-min">30 minutes</SelectItem>
                        <SelectItem value="1-hour">1 hour</SelectItem>
                        <SelectItem value="2-hours">2 hours</SelectItem>
                        <SelectItem value="until-tomorrow">Until tomorrow</SelectItem>
                        <SelectItem value="custom">Custom duration</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label>Quiet Hours</Label>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Enable Quiet Hours</Label>
                      <p className="text-xs text-muted-foreground">
                        Automatically pause notifications during specified hours
                      </p>
                    </div>
                    <Switch />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quiet-start">Start Time</Label>
                      <Input
                        id="quiet-start"
                        type="time"
                        defaultValue="22:00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quiet-end">End Time</Label>
                      <Input
                        id="quiet-end"
                        type="time"
                        defaultValue="08:00"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Quiet Hours Days</Label>
                    <div className="flex flex-wrap gap-2">
                      {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                        <Badge key={day} variant="outline" className="cursor-pointer">
                          {day.slice(0, 3)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <Button className="w-full">Save Pause Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Preferences */}
          <TabsContent value="preferences" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  <CardTitle>Notification Preferences</CardTitle>
                </div>
                <CardDescription>
                  Configure when and how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Notification Frequency</Label>
                  <Select defaultValue="realtime">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realtime">Real-time (immediate)</SelectItem>
                      <SelectItem value="batched">Batched (every 5 minutes)</SelectItem>
                      <SelectItem value="hourly">Hourly digest</SelectItem>
                      <SelectItem value="daily">Daily digest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Batching Window (if batched)</Label>
                  <Select defaultValue="5">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 minute</SelectItem>
                      <SelectItem value="5">5 minutes</SelectItem>
                      <SelectItem value="10">10 minutes</SelectItem>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Do Not Disturb Mode</Label>
                    <p className="text-xs text-muted-foreground">
                      Pause all notifications temporarily
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dnd-duration">DND Duration (if enabled)</Label>
                  <Select defaultValue="1-hour">
                    <SelectTrigger id="dnd-duration">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15-min">15 minutes</SelectItem>
                      <SelectItem value="30-min">30 minutes</SelectItem>
                      <SelectItem value="1-hour">1 hour</SelectItem>
                      <SelectItem value="2-hours">2 hours</SelectItem>
                      <SelectItem value="indefinite">Until manually disabled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label>Desktop Notifications</Label>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Enable Desktop Notifications</Label>
                      <p className="text-xs text-muted-foreground">
                        Show notifications on desktop
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Show When App is Focused</Label>
                      <p className="text-xs text-muted-foreground">
                        Show notifications even when app is in focus
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label>Sound & Visual</Label>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Sound Alerts</Label>
                      <p className="text-xs text-muted-foreground">
                        Play sound for notifications
                      </p>
                    </div>
                    <Switch />
                  </div>

                  <div className="space-y-2">
                    <Label>Notification Sound</Label>
                    <Select defaultValue="default">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Default</SelectItem>
                        <SelectItem value="gentle">Gentle</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                        <SelectItem value="none">None (Silent)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Visual Flash</Label>
                      <p className="text-xs text-muted-foreground">
                        Flash browser tab for notifications
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label>Notification Delivery</Label>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Require Interaction</Label>
                      <p className="text-xs text-muted-foreground">
                        Notifications require user interaction to dismiss
                      </p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Persistent Notifications</Label>
                      <p className="text-xs text-muted-foreground">
                        Keep notifications visible until dismissed
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>

                <Button className="w-full">Save Preferences</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SettingsLayout>
  );
}
