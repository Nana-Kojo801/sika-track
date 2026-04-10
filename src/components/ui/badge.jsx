import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default:     "border-gold-500/20 bg-gold-500/10 text-gold-400",
        secondary:   "border-zinc-700 bg-zinc-800 text-zinc-300",
        destructive: "border-red-500/20 bg-red-500/10 text-red-400",
        outline:     "border-zinc-700 text-zinc-300",
        success:     "border-green-500/20 bg-green-500/10 text-green-400",
        warning:     "border-amber-500/20 bg-amber-500/10 text-amber-400",
        danger:      "border-red-500/20 bg-red-500/10 text-red-400",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

function Badge({ className, variant, ...props }) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
