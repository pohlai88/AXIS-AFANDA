"use client";

import { SettingsLayout } from "@/app/components/settings-layout";
import { CreateTeamDialog } from "@/app/components/create-team-dialog";
import {
  Users, Plus, Lock, Globe, ArrowRight, User, UserPlus,
  Settings, Tag, RefreshCw, Image as ImageIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useTeamUpdates } from "@/app/hooks/use-team-updates";
import { ConnectionStatusIndicator } from "@/app/components/common/connection-status-indicator";
import { TeamStatsCards, type TeamStats } from "@/app/components/teams/team-stats";
import { TeamListWithBulk } from "@/app/components/teams/team-list-with-bulk";
import { toast } from "sonner";

// Mock data - will be replaced with API call
const mockTeams = [
  {
    id: "1",
    name: "Engineering Team",
    description: "Core engineering team",
    visibility: "private" as const,
    memberCount: 12,
    role: "owner" as const,
    createdAt: "2 days ago",
  },
  {
    id: "2",
    name: "Design Team",
    description: "Product design and UX",
    visibility: "public" as const,
    memberCount: 8,
    role: "admin" as const,
    createdAt: "1 week ago",
  },
];

export default function TeamsSettingsPage() {
  // Real-time updates for team membership changes
  const { isConnected, error } = useTeamUpdates({
    enabled: true,
    showToasts: true,
    onUpdate: (update) => {
      console.log('Team update:', update);
      // TODO: Refresh teams list when updates received
    },
  });

  // Calculate stats from mock data
  const stats: TeamStats = {
    total: mockTeams.length,
    members: mockTeams.reduce((sum, team) => sum + team.memberCount, 0),
    public: mockTeams.filter(team => team.visibility === 'public').length,
    private: mockTeams.filter(team => team.visibility === 'private').length,
  };

  const handleBulkInvite = (teamIds: string[], memberEmails: string[]) => {
    toast.success(`Invited ${memberEmails.length} member(s) to ${teamIds.length} team(s)`);
  };

  const handleBulkRemove = (teamIds: string[], memberIds: string[]) => {
    toast.success(`Removed ${memberIds.length} member(s) from ${teamIds.length} team(s)`);
  };

  const handleBulkDelete = (teamIds: string[]) => {
    toast.success(`Deleted ${teamIds.length} team(s)`);
  };

  return (
    <SettingsLayout title="Teams & Users">
      <div className="layout-stack">
        <div className="flex items-center gap-3">
          <div className="bg-lux-gold-soft flex h-12 w-12 items-center justify-center rounded-xl">
            <Users className="h-6 w-6 text-lux-gold" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-foreground">Teams & Users</h2>
            <p className="text-sm text-muted-foreground">
              Manage teams, users, avatars, and user display settings. Teams are self-managed; organizations are managed by Keycloak.
            </p>
          </div>
          <div className="ml-auto">
            <ConnectionStatusIndicator
              isConnected={isConnected}
              error={error}
              showLabel
              className="hidden sm:flex"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6">
          <TeamStatsCards stats={stats} />
        </div>

        <Tabs defaultValue="teams" className="mt-8">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="teams">Teams</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="display">Display</TabsTrigger>
            <TabsTrigger value="labels">Labels</TabsTrigger>
            <TabsTrigger value="sync">Sync</TabsTrigger>
          </TabsList>

          {/* Teams Management */}
          <TabsContent value="teams" className="space-y-6 mt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Your Teams</h3>
                <p className="text-sm text-muted-foreground">
                  Teams you own or administer
                </p>
              </div>
              <CreateTeamDialog />
            </div>

            {mockTeams.length === 0 ? (
              <Card className="card-glow-lux">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No teams yet</h3>
                  <p className="text-sm text-muted-foreground text-center mb-4">
                    Create your first team to start collaborating with others.
                  </p>
                  <CreateTeamDialog
                    trigger={
                      <Button className="btn-gold-lux">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Team
                      </Button>
                    }
                  />
                </CardContent>
              </Card>
            ) : (
              <TeamListWithBulk
                teams={mockTeams}
                onSelectTeam={(team) => {
                  window.location.href = `/app/teams/${team.id}`;
                }}
                onInviteMembers={handleBulkInvite}
                onRemoveMembers={handleBulkRemove}
                onDeleteTeams={handleBulkDelete}
              />
            )}

            <Card>
              <CardHeader>
                <CardTitle>Team Configuration</CardTitle>
                <CardDescription>
                  Configure default team settings and behavior
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Default Team Visibility</Label>
                  <Select defaultValue="private">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="private">Private</SelectItem>
                      <SelectItem value="public">Public</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Nested Teams</Label>
                    <p className="text-xs text-muted-foreground">
                      Allow teams to create sub-teams
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Approval for Team Creation</Label>
                    <p className="text-xs text-muted-foreground">
                      Team creation requires organization admin approval
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max-teams">Max Teams per User</Label>
                  <Input
                    id="max-teams"
                    type="number"
                    defaultValue="10"
                  />
                </div>

                <Button className="w-full">Save Team Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Management */}
          <TabsContent value="users" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>
                      View and manage users. Users are synced from Keycloak.
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add User
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Note:</strong> Users are managed in Keycloak. This interface shows read-only user information.
                    To add or modify users, use the Keycloak admin console.
                  </p>
                </div>

                <div className="mt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Enable User Search</Label>
                      <p className="text-xs text-muted-foreground">
                        Allow searching for users across organization
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Show User Status</Label>
                      <p className="text-xs text-muted-foreground">
                        Display online/offline status for users
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Show User Activity</Label>
                      <p className="text-xs text-muted-foreground">
                        Display last active time for users
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Assignment</CardTitle>
                <CardDescription>
                  Configure how users are assigned to teams
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Direct Assignment</Label>
                    <p className="text-xs text-muted-foreground">
                      Team owners can directly add users
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Invitation</Label>
                    <p className="text-xs text-muted-foreground">
                      Users must accept invitation before joining
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="invite-expiry">Invitation Expiry (days)</Label>
                  <Input
                    id="invite-expiry"
                    type="number"
                    defaultValue="7"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-assign from Organization</Label>
                    <p className="text-xs text-muted-foreground">
                      Automatically assign org members to teams
                    </p>
                  </div>
                  <Switch />
                </div>

                <Button className="w-full">Save Assignment Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Display Configuration */}
          <TabsContent value="display" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  <CardTitle>User Name Display</CardTitle>
                </div>
                <CardDescription>
                  Configure how user names are displayed throughout the system
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Name Display Format</Label>
                  <Select defaultValue="full">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full">Full Name (John Doe)</SelectItem>
                      <SelectItem value="first">First Name Only (John)</SelectItem>
                      <SelectItem value="last">Last Name Only (Doe)</SelectItem>
                      <SelectItem value="email">Email Address</SelectItem>
                      <SelectItem value="username">Username</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Email in Display</Label>
                    <p className="text-xs text-muted-foreground">
                      Include email address with name
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Role Badge</Label>
                    <p className="text-xs text-muted-foreground">
                      Display role badge next to name
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Name Order</Label>
                  <Select defaultValue="first-last">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="first-last">First Last</SelectItem>
                      <SelectItem value="last-first">Last, First</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full">Save Display Settings</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  <CardTitle>Avatar Configuration</CardTitle>
                </div>
                <CardDescription>
                  Configure avatar display and sources
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Avatar Source</Label>
                  <Select defaultValue="keycloak">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="keycloak">Keycloak</SelectItem>
                      <SelectItem value="gravatar">Gravatar</SelectItem>
                      <SelectItem value="local">Local Upload</SelectItem>
                      <SelectItem value="initials">Initials Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Avatar Upload</Label>
                    <p className="text-xs text-muted-foreground">
                      Users can upload custom avatars
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="avatar-size">Default Avatar Size (px)</Label>
                  <Input
                    id="avatar-size"
                    type="number"
                    defaultValue="40"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max-avatar-size">Max Avatar File Size (KB)</Label>
                  <Input
                    id="max-avatar-size"
                    type="number"
                    defaultValue="200"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Allowed Avatar Formats</Label>
                  <Input
                    defaultValue="jpg,jpeg,png,gif,webp"
                    placeholder="jpg,jpeg,png"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Avatar in Conversations</Label>
                    <p className="text-xs text-muted-foreground">
                      Display user avatars in message threads
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Button className="w-full">Save Avatar Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Labels and Visibility */}
          <TabsContent value="labels" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  <CardTitle>Labels and Visibility Rules</CardTitle>
                </div>
                <CardDescription>
                  Configure labels for teams and visibility rules
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Labels</Label>
                    <p className="text-xs text-muted-foreground">
                      Allow teams to have custom labels
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="space-y-2">
                  <Label>Default Labels</Label>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Engineering</Badge>
                    <Badge variant="secondary">Design</Badge>
                    <Badge variant="secondary">Sales</Badge>
                    <Badge variant="secondary">Support</Badge>
                    <Button variant="ghost" size="sm">+ Add Label</Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label>Visibility Rules</Label>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Public Teams Visible to All</Label>
                      <p className="text-xs text-muted-foreground">
                        Public teams visible to all org members
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Private Teams Hidden</Label>
                      <p className="text-xs text-muted-foreground">
                        Private teams only visible to members
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Show Team Member Count</Label>
                      <p className="text-xs text-muted-foreground">
                        Display member count in team list
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <Button className="w-full">Save Label Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* User Synchronization */}
          <TabsContent value="sync" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5" />
                  <CardTitle>User Synchronization</CardTitle>
                </div>
                <CardDescription>
                  Configure synchronization with Keycloak and external systems
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Keycloak SSOT:</strong> Users and organizations are synced from Keycloak.
                    Teams are self-managed and do not sync to Keycloak.
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Keycloak Sync</Label>
                    <p className="text-xs text-muted-foreground">
                      Automatically sync users from Keycloak
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

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Sync on Login</Label>
                    <p className="text-xs text-muted-foreground">
                      Sync user data when user logs in
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label>Sync Options</Label>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Sync User Attributes</Label>
                      <p className="text-xs text-muted-foreground">
                        Sync user attributes from Keycloak
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Sync Organizations</Label>
                      <p className="text-xs text-muted-foreground">
                        Sync organizations from Keycloak groups
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Sync Roles</Label>
                      <p className="text-xs text-muted-foreground">
                        Sync user roles from Keycloak
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Externally Managed Users</Label>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Users managed in Keycloak are considered externally managed.
                      Local user management is disabled.
                    </p>
                  </div>
                </div>

                <Button className="w-full">Save Sync Settings</Button>
                <Button variant="outline" className="w-full">Run Sync Now</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SettingsLayout>
  );
}
