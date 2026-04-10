import { useEffect, useState } from "react"
import { RefreshCw } from "lucide-react"
import { fetchGoldPrice } from "@/lib/goldApi"
import { formatGHS } from "@/lib/helpers"
import { cn } from "@/lib/utils"

export function PriceWidget({ refreshInterval = 60000 }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(null)

  const load = async () => {
    try {
      const result = await fetchGoldPrice()
      setData(result)
      setLastUpdated(new Date())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    const interval = setInterval(load, refreshInterval)
    return () => clearInterval(interval)
  }, [refreshInterval])

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-zinc-500 text-sm">
        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
        <span>Fetching gold price…</span>
      </div>
    )
  }

  if (!data) return null

  const isPositive = data.changePercent >= 0

  return (
    <div className="flex items-baseline gap-3 flex-wrap">
      <span className={cn(
        "font-mono text-3xl font-bold price-glow",
        isPositive ? "text-gold-400" : "text-gold-300"
      )}>
        {formatGHS(data.pricePerGramGHS, 0)}/g
      </span>
      <span className={cn(
        "text-sm font-medium",
        isPositive ? "text-green-400" : "text-red-400"
      )}>
        {isPositive ? "↑" : "↓"} {Math.abs(data.changePercent).toFixed(2)}% today
      </span>
      {lastUpdated && (
        <span className="text-xs text-zinc-600 ml-auto">
          Updated {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          {data.source === "demo" && " · demo data"}
        </span>
      )}
    </div>
  )
}
