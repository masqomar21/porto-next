import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-10 w-full min-w-0 rounded-none bg-muted/40 px-3.5 py-2.5 text-sm font-mono text-foreground border-0 border-b border-border/60 transition-colors outline-none placeholder:text-muted-foreground/50 placeholder:font-mono focus:border-b-2 focus:border-foreground focus:bg-muted/60 focus-visible:outline-none focus-visible:ring-0 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Input }
