"use client";

import * as React from "react";
import { Mail, X, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface InviteTeamMembersDialogProps {
  teamId: string;
  teamName: string;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function InviteTeamMembersDialog({
  teamId,
  teamName,
  trigger,
  onSuccess,
}: InviteTeamMembersDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [emails, setEmails] = React.useState<string[]>([]);
  const [role, setRole] = React.useState<"member" | "admin">("member");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const addEmail = () => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) return;

    if (!emailRegex.test(trimmed)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (emails.includes(trimmed)) {
      toast.error("This email is already in the list");
      return;
    }

    setEmails([...emails, trimmed]);
    setEmail("");
  };

  const removeEmail = (emailToRemove: string) => {
    setEmails(emails.filter((e) => e !== emailToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addEmail();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (emails.length === 0) {
      toast.error("Please add at least one email address");
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      const response = await fetch(`/api/v1/teams/${teamId}/invitations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emails,
          role,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send invitations");
      }

      toast.success(`Invited ${emails.length} member${emails.length > 1 ? "s" : ""} to ${teamName}`);

      setOpen(false);
      setEmails([]);
      setEmail("");
      setRole("member");
      onSuccess?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to send invitations");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
            <UserPlus className="mr-2 h-4 w-4" />
            Invite Members
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Invite Team Members</DialogTitle>
          <DialogDescription>
            Send invitations to join <strong>{teamName}</strong>. Invitations expire after 7 days.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="flex gap-2">
                <Input
                  id="email"
                  type="email"
                  placeholder="colleague@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading}
                />
                <Button type="button" onClick={addEmail} disabled={isLoading || !email.trim()}>
                  Add
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Press Enter or comma to add. You can add multiple emails.
              </p>
            </div>

            {emails.length > 0 && (
              <div className="grid gap-2">
                <Label>Invitees ({emails.length})</Label>
                <div className="flex flex-wrap gap-2 p-3 border rounded-md min-h-[60px]">
                  {emails.map((emailAddr) => (
                    <Badge key={emailAddr} variant="secondary" className="gap-1 pr-1">
                      <Mail className="h-3 w-3" />
                      {emailAddr}
                      <button
                        type="button"
                        onClick={() => removeEmail(emailAddr)}
                        className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                        disabled={isLoading}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="role">Default Role</Label>
              <Select value={role} onValueChange={(v) => setRole(v as "member" | "admin")} disabled={isLoading}>
                <SelectTrigger id="role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                New members will be assigned this role. You can change it later.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || emails.length === 0} className="btn-gold-lux">
              {isLoading ? "Sending..." : `Send ${emails.length > 0 ? `${emails.length} ` : ""}Invitation${emails.length !== 1 ? "s" : ""}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
