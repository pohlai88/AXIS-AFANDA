import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        // Base styles
        "flex min-h-16 w-full rounded-md border border-input bg-background px-3 py-2 text-base outline-none transition-colors",
        // Text and placeholder
        "placeholder:text-muted-foreground text-foreground",
        // Focus states
        "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        // Invalid states
        "aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive aria-invalid:ring-offset-2",
        // Disabled states
        "disabled:cursor-not-allowed disabled:opacity-50",
        // Responsive text size
        "md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
