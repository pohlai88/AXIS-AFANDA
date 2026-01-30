"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Users, Lock, Globe } from "lucide-react";
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
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import { toast } from "sonner";

const createTeamSchema = z.object({
  name: z.string().min(1, "Team name is required").min(2, "Team name must be at least 2 characters"),
  description: z.string().optional(),
  visibility: z.enum(["public", "private"]),
});

type CreateTeamFormValues = z.infer<typeof createTeamSchema>;

interface CreateTeamDialogProps {
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function CreateTeamDialog({ trigger, onSuccess }: CreateTeamDialogProps) {
  const [open, setOpen] = React.useState(false);
  const form = useForm<CreateTeamFormValues>({
    resolver: zodResolver(createTeamSchema),
    defaultValues: {
      name: "",
      description: "",
      visibility: "private",
    },
  });

  const onSubmit = async (values: CreateTeamFormValues) => {
    try {
      const response = await fetch("/api/v1/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name.trim(),
          description: values.description?.trim() || undefined,
          visibility: values.visibility,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create team");
      }

      toast.success(`Team "${values.name}" created successfully`);
      setOpen(false);
      form.reset();
      onSuccess?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create team");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="default" className="btn-gold-lux">
            <Users className="mr-2 h-4 w-4" />
            Create Team
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Team</DialogTitle>
          <DialogDescription>
            Create a team to collaborate with others. Teams can be public or private.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Engineering Team" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="What is this team for?" {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="visibility"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Visibility</FormLabel>
                  <FormControl>
                    <RadioGroup value={field.value} onValueChange={field.onChange}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="private" id="private" />
                        <FormLabel htmlFor="private" className="flex items-center gap-2 font-normal cursor-pointer mb-0">
                          <Lock className="h-4 w-4" />
                          <div>
                            <div className="font-medium">Private</div>
                            <div className="text-xs text-muted-foreground">Only team members can see this team</div>
                          </div>
                        </FormLabel>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="public" id="public" />
                        <FormLabel htmlFor="public" className="flex items-center gap-2 font-normal cursor-pointer mb-0">
                          <Globe className="h-4 w-4" />
                          <div>
                            <div className="font-medium">Public</div>
                            <div className="text-xs text-muted-foreground">Visible to all members of parent organization</div>
                          </div>
                        </FormLabel>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={form.formState.isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting} className="btn-gold-lux">
                {form.formState.isSubmitting ? "Creating..." : "Create Team"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
