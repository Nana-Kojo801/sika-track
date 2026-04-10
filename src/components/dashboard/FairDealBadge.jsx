import { cn } from "@/lib/utils"
import { getFairDealColor, getFairDealLabel, getFairDealBg } from "@/lib/helpers"
import { Progress } from "@/components/ui/progress"

export function FairDealBadge({ score, showLabel = true, showBar = false, size = "md" }) {
  const colorClass = getFairDealColor(score)
  const label = getFairDealLabel(score)
  const bgClass = getFairDealBg(score)

  const textSizes = { sm: "text-sm", md: "text-lg", lg: "text-2xl", xl: "text-4xl" }

  return (
    <div className="flex flex-col gap-2">
      <div className={cn("inline-flex items-center gap-2 rounded-md border px-2.5 py-1", bgClass)}>
        <span className={cn("font-mono font-bold", textSizes[size], colorClass)}>
          {score}
        </span>
        <span className="text-xs opacity-60">/100</span>
        {showLabel && (
          <span className="text-xs font-medium ml-1">{label}</span>
        )}
      </div>

      {showBar && (
        <Progress
          value={score}
          className="h-1.5"
          indicatorClassName={cn(
            score >= 90 ? "bg-green-400" :
            score >= 70 ? "bg-amber-400" :
            score >= 50 ? "bg-orange-400" : "bg-red-400"
          )}
        />
      )}
    </div>
  )
}

export function FairDealRing({ score, size = 80 }) {
  const colorClass = getFairDealColor(score)
  const label = getFairDealLabel(score)

  // SVG circle stroke
  const r = 34
  const circumference = 2 * Math.PI * r
  const strokeDash = (score / 100) * circumference

  const strokeColor =
    score >= 90 ? "#4ade80" :
    score >= 70 ? "#fbbf24" :
    score >= 50 ? "#fb923c" : "#f87171"

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox="0 0 80 80" className="-rotate-90">
          <circle cx="40" cy="40" r={r} fill="none" stroke="#27272a" strokeWidth="6" />
          <circle
            cx="40" cy="40" r={r}
            fill="none"
            stroke={strokeColor}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${strokeDash} ${circumference}`}
            className="transition-all duration-700"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("font-mono font-bold text-lg leading-none", colorClass)}>{score}</span>
          <span className="text-[9px] text-zinc-500">/100</span>
        </div>
      </div>
      <span className={cn("text-xs font-medium", colorClass)}>{label}</span>
    </div>
  )
}
