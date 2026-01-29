"use client";

import * as React from "react";
import { Shield } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface ChangeMemberRoleDialogProps {
  teamId: string;
  memberId: string;
  memberName: string;
  currentRole: "member" | "admin";
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function ChangeMemberRoleDialog({
  teamId,
  memberId,
  memberName,
  currentRole,
  trigger,
  onSuccess,
}: ChangeMemberRoleDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [role, setRole] = React.useState<"member" | "admin">(currentRole);

  React.useEffect(() => {
    if (open) {
      setRole(currentRole);
    }
  }, [open, currentRole]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (role === currentRole) {
      setOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      const response = await fetch(`/api/v1/teams/${teamId}/members/${memberId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });

      if (!response.ok) {
        throw new Error("Failed to update member role");
      }

      toast.success(`${memberName}'s role updated to ${role}`);
      setOpen(false);
      onSuccess?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update member role");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Shield className="mr-2 h-4 w-4" />
            Change Role
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Change Member Role</DialogTitle>
          <DialogDescription>
            Update {memberName}&apos;s role in this team.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={(v) => setRole(v as "member" | "admin")} disabled={isLoading}>
                <SelectTrigger id="role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <div className="text-xs text-muted-foreground space-y-1 mt-2">
                <div><strong>Member:</strong> Can participate and view team content</div>
                <div><strong>Admin:</strong> Can manage members and invite others</div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || role === currentRole}
              className="btn-gold-lux"
            >
              {isLoading ? "Updating..." : "Update Role"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
