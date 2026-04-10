import { cn } from "@/lib/utils"
import { getFairDealColor, getFairDealLabel, getFairDealBg } from "@/lib/helpers"
import { Progress } from "@/components/ui/progress"

export function FairDealScoreDisplay({ score, totalReceived, fairValue }) {
  const color = getFairDealColor(score)
  const label = getFairDealLabel(score)
  const bg = getFairDealBg(score)
  const diff = totalReceived - fairValue
  const isAbove = diff >= 0

  const progressColor =
    score >= 90 ? "bg-green-400" :
    score >= 70 ? "bg-amber-400" :
    score >= 50 ? "bg-orange-400" : "bg-red-400"

  return (
    <div className={cn("rounded-xl border p-4", bg)}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs uppercase tracking-wider opacity-70 mb-1">Fair Deal Score</p>
          <div className="flex items-baseline gap-2">
            <span className={cn("font-mono text-3xl font-bold", color)}>{score}</span>
            <span className="text-sm opacity-60">/100 · {label}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs opacity-60">vs fair value</p>
          <p className={cn("text-sm font-semibold font-mono", isAbove ? "text-green-400" : "text-red-400")}>
            {isAbove ? "+" : ""}{diff.toLocaleString("en-GH", { style: "currency", currency: "GHS", maximumFractionDigits: 0 })}
          </p>
        </div>
      </div>
      <Progress value={score} indicatorClassName={progressColor} />
    </div>
  )
}

export function LiveScoreRing({ score }) {
  const color = getFairDealColor(score)
  const label = getFairDealLabel(score)

  const r = 36
  const circumference = 2 * Math.PI * r
  const strokeDash = (score / 100) * circumference

  const strokeColor =
    score >= 90 ? "#4ade80" :
    score >= 70 ? "#fbbf24" :
    score >= 50 ? "#fb923c" : "#f87171"

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <svg width="96" height="96" viewBox="0 0 88 88" className="-rotate-90">
          <circle cx="44" cy="44" r={r} fill="none" stroke="#27272a" strokeWidth="7" />
          <circle
            cx="44" cy="44" r={r}
            fill="none"
            stroke={strokeColor}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={`${strokeDash} ${circumference}`}
            className="transition-all duration-700"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("font-mono font-bold text-xl leading-none", color)}>{score}</span>
          <span className="text-[9px] text-zinc-500">/100</span>
        </div>
      </div>
      <span className={cn("text-xs font-semibold mt-1.5", color)}>{label}</span>
    </div>
  )
}
