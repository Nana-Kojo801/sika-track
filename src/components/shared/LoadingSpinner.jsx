import { cn } from "@/lib/utils"

export function LoadingSpinner({ size = "md", className = "" }) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-2",
    lg: "h-12 w-12 border-3",
  }

  return (
    <div
      className={cn(
        "rounded-full border-zinc-700 border-t-gold-500 animate-spin",
        sizeClasses[size],
        className
      )}
    />
  )
}

export function PageLoader() {
  return (
    <div className="flex min-h-[200px] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <LoadingSpinner size="lg" />
        <p className="text-sm text-zinc-500 animate-pulse">Loading…</p>
      </div>
    </div>
  )
}
