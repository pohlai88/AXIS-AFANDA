"use client";

import { SettingsLayout } from "@/app/components/settings-layout";
import {
  MessageSquare, Users, Eye, Clock, FileText,
  Calendar, Edit, Bot
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export default function ConversationsSettingsPage() {
  return (
    <SettingsLayout title="Conversations">
      <div className="layout-stack">
        <div className="flex items-center gap-3">
          <div className="bg-lux-gold-soft flex h-12 w-12 items-center justify-center rounded-xl">
            <MessageSquare className="h-6 w-6 text-lux-gold" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-foreground">Conversations</h2>
            <p className="text-sm text-muted-foreground">
              Configure conversation behavior, visibility, participants, queue, and advanced features
            </p>
          </div>
        </div>

        <Tabs defaultValue="general" className="mt-8">
          <TabsList className="grid w-full grid-cols-8 max-w-full overflow-x-auto">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="participants">Participants</TabsTrigger>
            <TabsTrigger value="visibility">Visibility</TabsTrigger>
            <TabsTrigger value="queue">Queue</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="summaries">Summaries</TabsTrigger>
            <TabsTrigger value="concierge">Concierge</TabsTrigger>
          </TabsList>

          {/* General Conversation Settings */}
          <TabsContent value="general" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Conversation Settings</CardTitle>
                <CardDescription>
                  Configure default conversation behavior and features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Message Editing</Label>
                    <p className="text-xs text-muted-foreground">
                      Allow users to edit sent messages
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Message Deletion</Label>
                    <p className="text-xs text-muted-foreground">
                      Allow users to delete messages
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message-retention">Message Retention (days)</Label>
                  <Input
                    id="message-retention"
                    type="number"
                    defaultValue="365"
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Conversation Summaries</Label>
                    <p className="text-xs text-muted-foreground">
                      Automatically generate AI summaries
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Internal Messaging Mode</Label>
                    <p className="text-xs text-muted-foreground">
                      Enable internal-only messaging between agents
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Broadcasts</Label>
                    <p className="text-xs text-muted-foreground">
                      Allow sending broadcast messages to multiple conversations
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Outbound Conversations</Label>
                    <p className="text-xs text-muted-foreground">
                      Allow agents to initiate conversations
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Button className="w-full">Save Settings</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Invitations & Forwarding</CardTitle>
                <CardDescription>
                  Configure how users can invite others to conversations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Invitations</Label>
                    <p className="text-xs text-muted-foreground">
                      Users can invite others to conversations
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Forwarding</Label>
                    <p className="text-xs text-muted-foreground">
                      Users can forward conversations to other teams
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="invite-expiry">Invitation Expiry (hours)</Label>
                  <Input
                    id="invite-expiry"
                    type="number"
                    defaultValue="24"
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Delegation to Deputies</Label>
                    <p className="text-xs text-muted-foreground">
                      Allow delegating conversation requests to deputies
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Button className="w-full">Save Settings</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>File Upload Configuration</CardTitle>
                <CardDescription>
                  Configure file upload settings for conversations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable File Uploads</Label>
                    <p className="text-xs text-muted-foreground">
                      Allow file attachments in conversations
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max-file-size">Max File Size (MB)</Label>
                  <Input
                    id="max-file-size"
                    type="number"
                    defaultValue="10"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="allowed-file-types">Allowed File Types</Label>
                  <Input
                    id="allowed-file-types"
                    placeholder="pdf,doc,docx,jpg,png"
                    defaultValue="pdf,doc,docx,jpg,png,zip"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max-files">Max Files per Message</Label>
                  <Input
                    id="max-files"
                    type="number"
                    defaultValue="5"
                  />
                </div>

                <Button className="w-full">Save File Settings</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Custom Conversation Banners</CardTitle>
                <CardDescription>
                  Configure custom banners displayed in conversations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Custom Banners</Label>
                    <p className="text-xs text-muted-foreground">
                      Display custom banners in conversation UI
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="banner-text">Banner Text</Label>
                  <Textarea
                    id="banner-text"
                    placeholder="Enter banner message..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Banner Type</Label>
                  <Select defaultValue="info">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                      <SelectItem value="success">Success</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full">Save Banner Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Participants Management */}
          <TabsContent value="participants" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <CardTitle>Participant Management</CardTitle>
                </div>
                <CardDescription>
                  Configure how participants are managed in conversations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Removing Participants</Label>
                    <p className="text-xs text-muted-foreground">
                      Allow removing participants from conversations
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Permission to Remove</Label>
                    <p className="text-xs text-muted-foreground">
                      Require admin/owner permission to remove participants
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Hidden Secondary Agents</Label>
                    <p className="text-xs text-muted-foreground">
                      Allow hidden secondary agents in long-running conversations
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max-participants">Max Participants per Conversation</Label>
                  <Input
                    id="max-participants"
                    type="number"
                    defaultValue="50"
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Display Agent Status</Label>
                    <p className="text-xs text-muted-foreground">
                      Show agent status (online/offline/busy) in conversations
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="space-y-2">
                  <Label>Agent Status Display</Label>
                  <Select defaultValue="badge">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="badge">Status Badge</SelectItem>
                      <SelectItem value="indicator">Status Indicator</SelectItem>
                      <SelectItem value="text">Text Label</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full">Save Participant Settings</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Visitor Presence</CardTitle>
                <CardDescription>
                  Configure visitor presence and initialization
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Visitor Presence</Label>
                    <p className="text-xs text-muted-foreground">
                      Track and display visitor presence
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="space-y-2">
                  <Label>Presence Update Interval (seconds)</Label>
                  <Input
                    type="number"
                    defaultValue="30"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Awaited Person Types</Label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Agent</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Team Member</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">External Expert</Label>
                      <Switch />
                    </div>
                  </div>
                </div>

                <Button className="w-full">Save Presence Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Visibility Settings */}
          <TabsContent value="visibility" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  <CardTitle>Conversation Visibility</CardTitle>
                </div>
                <CardDescription>
                  Control who can see and access conversations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Default Visibility</Label>
                  <Select defaultValue="team">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="private">Private (participants only)</SelectItem>
                      <SelectItem value="team">Team (all team members)</SelectItem>
                      <SelectItem value="org">Organization (all org members)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Visibility Changes</Label>
                    <p className="text-xs text-muted-foreground">
                      Users can change conversation visibility
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Conversation History</Label>
                    <p className="text-xs text-muted-foreground">
                      Display past conversations in timeline
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Archive on Completion</Label>
                    <p className="text-xs text-muted-foreground">
                      Automatically archive completed conversations
                    </p>
                  </div>
                  <Switch />
                </div>

                <Button className="w-full">Save Visibility Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Queue Settings */}
          <TabsContent value="queue" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <CardTitle>Queue Configuration</CardTitle>
                </div>
                <CardDescription>
                  Configure how conversation requests are queued and dispatched
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Queue</Label>
                    <p className="text-xs text-muted-foreground">
                      Route conversations through queue system
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="space-y-2">
                  <Label>Routing Strategy</Label>
                  <Select defaultValue="round-robin">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="round-robin">Round Robin</SelectItem>
                      <SelectItem value="least-busy">Least Busy</SelectItem>
                      <SelectItem value="skill-based">Skill Based</SelectItem>
                      <SelectItem value="manual">Manual Assignment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max-queue-time">Max Queue Time (minutes)</Label>
                  <Input
                    id="max-queue-time"
                    type="number"
                    defaultValue="30"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Queue Status to Visitors</Label>
                    <p className="text-xs text-muted-foreground">
                      Display estimated wait time
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="space-y-2">
                  <Label>Queue Status Display</Label>
                  <Select defaultValue="full">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full">Full (position + wait time)</SelectItem>
                      <SelectItem value="position">Position Only</SelectItem>
                      <SelectItem value="wait-time">Wait Time Only</SelectItem>
                      <SelectItem value="minimal">Minimal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-assign from Queue</Label>
                    <p className="text-xs text-muted-foreground">
                      Automatically assign conversations to available agents
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Button className="w-full">Save Queue Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Scheduled Conversations */}
          <TabsContent value="scheduled" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <CardTitle>Scheduled Conversations</CardTitle>
                </div>
                <CardDescription>
                  Configure scheduled conversation settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Scheduled Conversations</Label>
                    <p className="text-xs text-muted-foreground">
                      Allow scheduling conversations in advance
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="min-schedule-time">Min Schedule Time (hours ahead)</Label>
                  <Input
                    id="min-schedule-time"
                    type="number"
                    defaultValue="1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max-schedule-time">Max Schedule Time (days ahead)</Label>
                  <Input
                    id="max-schedule-time"
                    type="number"
                    defaultValue="30"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Send Reminder Notifications</Label>
                    <p className="text-xs text-muted-foreground">
                      Send reminders before scheduled conversations
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reminder-time">Reminder Time (minutes before)</Label>
                  <Input
                    id="reminder-time"
                    type="number"
                    defaultValue="15"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-start Scheduled Conversations</Label>
                    <p className="text-xs text-muted-foreground">
                      Automatically start at scheduled time
                    </p>
                  </div>
                  <Switch />
                </div>

                <Button className="w-full">Save Scheduled Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Editor Configuration */}
          <TabsContent value="editor" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Edit className="h-5 w-5" />
                  <CardTitle>WYSIWYG Editor</CardTitle>
                </div>
                <CardDescription>
                  Configure the rich text editor for messages
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable WYSIWYG Editor</Label>
                    <p className="text-xs text-muted-foreground">
                      Use rich text editor for message composition
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="space-y-4">
                  <Label>Available Formatting Options</Label>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Bold</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Italic</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Underline</Label>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Lists</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Links</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Images</Label>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Code Blocks</Label>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Markdown</Label>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-save Drafts</Label>
                    <p className="text-xs text-muted-foreground">
                      Automatically save message drafts
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="draft-interval">Draft Save Interval (seconds)</Label>
                  <Input
                    id="draft-interval"
                    type="number"
                    defaultValue="5"
                  />
                </div>

                <Button className="w-full">Save Editor Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Conversation Summaries */}
          <TabsContent value="summaries" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  <CardTitle>Conversation Summaries</CardTitle>
                </div>
                <CardDescription>
                  Configure automatic conversation summary generation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Auto-summaries</Label>
                    <p className="text-xs text-muted-foreground">
                      Automatically generate conversation summaries
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="space-y-2">
                  <Label>Summary Trigger</Label>
                  <Select defaultValue="manual">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manual">Manual (on demand)</SelectItem>
                      <SelectItem value="on-close">On Conversation Close</SelectItem>
                      <SelectItem value="periodic">Periodic (every N messages)</SelectItem>
                      <SelectItem value="time-based">Time-based (every N hours)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="summary-messages">Messages Threshold</Label>
                  <Input
                    id="summary-messages"
                    type="number"
                    defaultValue="50"
                    placeholder="Generate summary after N messages"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="summary-length">Summary Length</Label>
                  <Select defaultValue="medium">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">Short (1-2 paragraphs)</SelectItem>
                      <SelectItem value="medium">Medium (3-5 paragraphs)</SelectItem>
                      <SelectItem value="long">Long (detailed summary)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Include Key Points</Label>
                    <p className="text-xs text-muted-foreground">
                      Include bullet points of key discussion points
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Include Action Items</Label>
                    <p className="text-xs text-muted-foreground">
                      Extract and list action items from conversation
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Button className="w-full">Save Summary Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Concierge Configuration */}
          <TabsContent value="concierge" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  <CardTitle>Concierge Bot</CardTitle>
                  <Badge variant="secondary">Beta</Badge>
                </div>
                <CardDescription>
                  Configure the concierge bot for onboarding and conversation management
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Concierge</Label>
                    <p className="text-xs text-muted-foreground">
                      Enable concierge bot for conversation onboarding
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="space-y-2">
                  <Label>Concierge Name</Label>
                  <Input
                    defaultValue="Concierge"
                    placeholder="Enter concierge name"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Concierge Avatar</Label>
                  <Input
                    placeholder="URL to concierge avatar image"
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label>Concierge Functions</Label>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Onboarding</Label>
                      <p className="text-xs text-muted-foreground">
                        Welcome new users to conversations
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Reboarding</Label>
                      <p className="text-xs text-muted-foreground">
                        Re-engage returning users
                      </p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Offboarding</Label>
                      <p className="text-xs text-muted-foreground">
                        Handle conversation closure
                      </p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Queue Management</Label>
                      <p className="text-xs text-muted-foreground">
                        Assist with queue status and wait times
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Welcome Message</Label>
                  <Textarea
                    placeholder="Enter welcome message for new conversations..."
                    rows={3}
                    defaultValue="Hello! I'm here to help. How can I assist you today?"
                  />
                </div>

                <Button className="w-full">Save Concierge Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SettingsLayout>
  );
}
