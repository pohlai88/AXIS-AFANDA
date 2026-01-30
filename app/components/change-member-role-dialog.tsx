"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Shield } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { toast } from "sonner";

const changeMemberRoleSchema = z.object({
  role: z.enum(["member", "admin"]),
});

type ChangeMemberRoleFormValues = z.infer<typeof changeMemberRoleSchema>;

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
  const form = useForm<ChangeMemberRoleFormValues>({
    resolver: zodResolver(changeMemberRoleSchema),
    defaultValues: {
      role: currentRole,
    },
  });

  React.useEffect(() => {
    if (open) {
      form.reset({ role: currentRole });
    }
  }, [open, currentRole, form]);

  const onSubmit = async (values: ChangeMemberRoleFormValues) => {
    if (values.role === currentRole) {
      setOpen(false);
      return;
    }

    try {
      const response = await fetch(`/api/v1/teams/${teamId}/members/${memberId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: values.role }),
      });

      if (!response.ok) {
        throw new Error("Failed to update member role");
      }

      toast.success(`${memberName}'s role updated to ${values.role}`);
      setOpen(false);
      onSuccess?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update member role");
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change Member Role</DialogTitle>
          <DialogDescription>
            Update {memberName}&apos;s role in this team.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
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
                  <div className="text-xs text-muted-foreground space-y-1 mt-2">
                    <div><strong>Member:</strong> Can participate and view team content</div>
                    <div><strong>Admin:</strong> Can manage members and invite others</div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={form.formState.isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting} className="btn-gold-lux">
                {form.formState.isSubmitting ? "Updating..." : "Update Role"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
