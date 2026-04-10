import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

export function StatBadge({ value, suffix = "%", className = "" }) {
  const isPositive = value > 0
  const isNegative = value < 0
  const isNeutral = value === 0

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-xs font-medium",
        isPositive && "text-green-400",
        isNegative && "text-red-400",
        isNeutral && "text-zinc-400",
        className
      )}
    >
      {isPositive && <TrendingUp className="h-3 w-3" />}
      {isNegative && <TrendingDown className="h-3 w-3" />}
      {isNeutral && <Minus className="h-3 w-3" />}
      {isPositive && "+"}
      {value.toFixed(1)}{suffix}
    </span>
  )
}
