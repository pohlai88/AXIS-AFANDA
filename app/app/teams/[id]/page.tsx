'use client';

import { useEffect, useState } from 'react';
import { notFound } from "next/navigation";
import { InviteTeamMembersDialog } from "@/app/components/invite-team-members-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Settings, Loader2 } from "lucide-react";
import Link from "next/link";
import { TeamMemberRow } from "@/app/components/team-member-row";
import { useTeamsStore } from '@/app/lib/stores/teams-store';
import { useTeamUpdates } from '@/app/hooks/use-team-updates';
import { ConnectionStatus } from '@/app/components/common/connection-status';
import { ListSkeleton } from '@/app/components/common/skeletons';

// Mock data - will be replaced with API call
interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'member';
  avatar: string;
}

interface TeamData {
  id: string;
  name: string;
  description: string;
  visibility: 'private' | 'public';
  memberCount: number;
  role: 'owner' | 'admin' | 'member';
  members: TeamMember[];
}

const getTeamData = (id: string): TeamData | undefined => {
  const teams: Record<string, TeamData> = {
    "1": {
      id: "1",
      name: "Engineering Team",
      description: "Core engineering team working on product development",
      visibility: "private" as const,
      memberCount: 12,
      role: "owner" as const,
      members: [
        { id: "1", name: "John Doe", email: "john@example.com", role: "owner" as const, avatar: "" },
        { id: "2", name: "Jane Smith", email: "jane@example.com", role: "admin" as const, avatar: "" },
        { id: "3", name: "Bob Johnson", email: "bob@example.com", role: "member" as const, avatar: "" },
        { id: "4", name: "Alice Williams", email: "alice@example.com", role: "member" as const, avatar: "" },
      ],
    },
  };
  return teams[id];
};

export default function TeamDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [notFoundState, setNotFoundState] = useState(false);

  // Use Zustand store for state management
  const {
    selectedTeam,
    teamMembers,
    loading,
    fetchTeam,
    fetchTeamMembers,
  } = useTeamsStore();

  // Real-time updates via SSE
  const { isConnected } = useTeamUpdates({
    enabled: true,
    showToasts: true,
    onUpdate: (update) => {
      console.log('Team update:', update);
      // Refresh team data when updates received
      fetchTeam(id).catch(console.error);
      fetchTeamMembers(id).catch(console.error);
    },
  });

  // Fetch team data on mount
  useEffect(() => {
    const loadTeam = async () => {
      try {
        await Promise.all([
          fetchTeam(id),
          fetchTeamMembers(id),
        ]);
      } catch (error) {
        console.error('Failed to load team:', error);
        setNotFoundState(true);
      }
    };
    loadTeam();
  }, [id, fetchTeam, fetchTeamMembers]);

  // Use store data, fallback to mock for development
  const mockTeam = getTeamData(id);
  const team = selectedTeam || mockTeam;
  const members = teamMembers[id] || team?.members || [];

  if (notFoundState || (!team && !loading)) {
    notFound();
  }

  if (loading && !team) {
    return (
      <div className="layout-container layout-section">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!team) return null;

  const canManage = team.role === "owner" || team.role === "admin";
  const isOwner = team.role === "owner";

  return (
    <div className="layout-container layout-section">
      <div className="layout-stack">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-semibold text-foreground">{team.name}</h1>
              <Badge variant="outline">{team.visibility === "private" ? "Private" : "Public"}</Badge>
              <ConnectionStatus isConnected={isConnected} />
            </div>
            {team.description && (
              <p className="text-muted-foreground">{team.description}</p>
            )}
            <div className="mt-2 text-sm text-muted-foreground">
              {team.memberCount} member{team.memberCount !== 1 ? "s" : ""}
            </div>
          </div>
          <div className="flex gap-2">
            {canManage && (
              <InviteTeamMembersDialog
                teamId={team.id}
                teamName={team.name}
                trigger={
                  <Button className="btn-gold-lux">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Invite Members
                  </Button>
                }
              />
            )}
            {isOwner && (
              <Button variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            )}
          </div>
        </div>

        {/* Members List */}
        <Card className="card-glow-lux mt-8">
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>
              Manage team members and their roles. {!canManage && "You can view members but cannot manage them."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading && members.length === 0 ? (
              <ListSkeleton count={5} showAvatar showActions />
            ) : (
              <div className="space-y-4">
                {members.map((member) => (
                  <TeamMemberRow
                    key={member.id}
                    member={member}
                    teamId={team.id}
                    teamName={team.name}
                    canManage={canManage}
                    isOwner={isOwner}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Back Link */}
        <div className="mt-6">
          <Link href="/app/settings/teams">
            <Button variant="ghost">
              ← Back to Teams
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
