import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-24 w-full rounded-none bg-muted/40 px-3.5 py-2.5 text-sm font-mono text-foreground border-0 border-b border-border/60 transition-colors outline-none placeholder:text-muted-foreground/50 placeholder:font-mono focus:border-b-2 focus:border-foreground focus:bg-muted/60 focus-visible:outline-none focus-visible:ring-0 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
