"use client";

import * as React from "react";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/app/components/ui/dropdown-menu";
import { MoreVertical, Shield, Trash2, Mail, MessageSquare } from "lucide-react";
import { ChangeMemberRoleDialog } from "@/app/components/change-member-role-dialog";
import { toast } from "sonner";

interface TeamMemberRowProps {
  member: {
    id: string;
    name: string;
    email: string;
    role: "owner" | "admin" | "member";
    avatar?: string;
  };
  teamId: string;
  teamName: string;
  canManage: boolean;
  isOwner: boolean;
}

export function TeamMemberRow({ member, teamId, teamName, canManage, isOwner }: TeamMemberRowProps) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-4">
        <Avatar>
          <AvatarImage src={member.avatar} />
          <AvatarFallback>
            {member.name
              .split(" ")
              .map((n: string) => n[0])
              .join("")
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium">{member.name}</span>
            {member.role === "owner" && (
              <Badge variant="default" className="text-xs">
                Owner
              </Badge>
            )}
            {member.role === "admin" && (
              <Badge variant="secondary" className="text-xs">
                Admin
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-3 w-3" />
            {member.email}
          </div>
        </div>
      </div>
      {canManage && member.role !== "owner" && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {isOwner && (
              <>
                <ChangeMemberRoleDialog
                  teamId={teamId}
                  memberId={member.id}
                  memberName={member.name}
                  currentRole={member.role}
                  trigger={
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      <Shield className="mr-2 h-4 w-4" />
                      Change Role
                    </DropdownMenuItem>
                  }
                />
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <MessageSquare className="mr-2 h-4 w-4" />
                Contact member
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem
                  onSelect={() => {
                    window.location.href = `mailto:${member.email}`;
                  }}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Send email
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => {
                    // TODO: Open Afenda chat/message interface
                    toast.info(`Opening Afenda for ${member.name}...`);
                  }}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Afenda
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onSelect={async () => {
                if (confirm(`Remove ${member.name} from ${teamName}?`)) {
                  // TODO: API call to remove member
                  toast.success(`${member.name} removed from team`);
                }
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Remove from Team
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
