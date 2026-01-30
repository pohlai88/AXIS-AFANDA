"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inviteTeamMembersSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.enum(["member", "admin"]),
});

type InviteTeamMembersFormValues = z.infer<typeof inviteTeamMembersSchema>;

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
  const [emails, setEmails] = React.useState<string[]>([]);

  const form = useForm<InviteTeamMembersFormValues>({
    resolver: zodResolver(inviteTeamMembersSchema),
    defaultValues: {
      email: "",
      role: "member",
    },
  });

  const addEmail = (newEmail: string) => {
    const trimmed = newEmail.trim().toLowerCase();
    if (!trimmed || !emailRegex.test(trimmed)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (emails.includes(trimmed)) {
      toast.error("This email is already in the list");
      return;
    }

    setEmails([...emails, trimmed]);
    form.setValue("email", "");
  };

  const removeEmail = (emailToRemove: string) => {
    setEmails(emails.filter((e) => e !== emailToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && form.watch("email")) {
      e.preventDefault();
      addEmail(form.watch("email"));
    }
  };

  const onSubmit = async (values: InviteTeamMembersFormValues) => {
    if (emails.length === 0) {
      toast.error("Please add at least one email address");
      return;
    }

    try {
      const response = await fetch(`/api/v1/teams/${teamId}/invitations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emails,
          role: values.role,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send invitations");
      }

      toast.success(`Invited ${emails.length} member${emails.length > 1 ? "s" : ""} to ${teamName}`);

      setOpen(false);
      setEmails([]);
      form.reset();
      onSuccess?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to send invitations");
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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Invite Team Members</DialogTitle>
          <DialogDescription>
            Send invitations to join <strong>{teamName}</strong>. Invitations expire after 7 days.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <FormLabel>Email Addresses</FormLabel>
              <div className="flex gap-2">
                <Input
                  placeholder="colleague@example.com"
                  value={form.watch("email")}
                  onChange={(e) => form.setValue("email", e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={form.formState.isSubmitting}
                />
                <Button 
                  type="button" 
                  onClick={() => addEmail(form.watch("email"))} 
                  disabled={form.formState.isSubmitting || !form.watch("email").trim()}
                >
                  Add
                </Button>
              </div>
              <FormDescription>
                Press Enter or comma to add. You can add multiple emails.
              </FormDescription>
            </div>

            {emails.length > 0 && (
              <div className="space-y-2">
                <FormLabel>Invitees ({emails.length})</FormLabel>
                <div className="flex flex-wrap gap-2 p-3 border rounded-md min-h-16">
                  {emails.map((emailAddr) => (
                    <Badge key={emailAddr} variant="secondary" className="gap-1 pr-1">
                      <Mail className="h-3 w-3" />
                      {emailAddr}
                      <button
                        type="button"
                        onClick={() => removeEmail(emailAddr)}
                        className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                        disabled={form.formState.isSubmitting}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Default Role</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange} disabled={form.formState.isSubmitting}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="member">Member</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    New members will be assigned this role. You can change it later.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={form.formState.isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting || emails.length === 0} className="btn-gold-lux">
                {form.formState.isSubmitting ? "Sending..." : `Send ${emails.length > 0 ? `${emails.length} ` : ""}Invitation${emails.length !== 1 ? "s" : ""}`}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
