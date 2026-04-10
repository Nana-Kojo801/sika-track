import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { StatBadge } from "@/components/shared/StatBadge"
import { Skeleton } from "@/components/ui/skeleton"

export function StatCard({
  title,
  value,
  subtitle,
  change,
  icon: Icon,
  variant = "default",
  pulse = false,
  loading = false,
  className = "",
  children,
}) {
  if (loading) {
    return (
      <Card className={cn("gold-card p-5", className)}>
        <Skeleton className="h-4 w-24 mb-3" />
        <Skeleton className="h-8 w-32 mb-2" />
        <Skeleton className="h-3 w-20" />
      </Card>
    )
  }

  return (
    <Card className={cn("gold-card p-5 transition-all", className)}>
      <div className="flex items-start justify-between mb-1">
        <p className="text-xs uppercase tracking-wider text-zinc-500 font-medium">{title}</p>
        {Icon && (
          <div className="h-7 w-7 rounded-lg bg-gold-500/10 flex items-center justify-center shrink-0">
            <Icon className="h-4 w-4 text-gold-500" />
          </div>
        )}
      </div>

      <div className={cn(
        "font-mono text-2xl font-bold text-gold-400 mt-2 mb-1 leading-none",
        pulse && "animate-gold-pulse"
      )}>
        {value}
      </div>

      <div className="flex items-center gap-2 mt-1.5">
        {subtitle && <span className="text-xs text-zinc-500">{subtitle}</span>}
        {change !== undefined && <StatBadge value={change} />}
      </div>

      {children && <div className="mt-3">{children}</div>}
    </Card>
  )
}
