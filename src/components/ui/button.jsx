import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-950 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-gold-500 text-surface-950 shadow hover:bg-gold-400 active:bg-gold-600",
        destructive:
          "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20",
        outline:
          "border border-zinc-700 bg-transparent text-zinc-200 hover:bg-zinc-800 hover:text-zinc-100",
        secondary:
          "bg-surface-800 text-zinc-200 hover:bg-zinc-700",
        ghost:
          "text-zinc-400 hover:bg-surface-800 hover:text-zinc-200",
        link:
          "text-gold-400 underline-offset-4 hover:underline",
        gold:
          "border border-gold-500/30 bg-gold-500/10 text-gold-400 hover:bg-gold-500/20 hover:border-gold-500/50",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm:      "h-8 rounded-md px-3 text-xs",
        lg:      "h-11 rounded-lg px-6 text-base",
        xl:      "h-12 rounded-lg px-8 text-base font-semibold",
        icon:    "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button, buttonVariants }
