import { useState, useEffect } from "react"
import { useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"
import { RefreshCw } from "lucide-react"
import { PageWrapper } from "@/components/layout/PageWrapper"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PriceChart } from "@/components/market/PriceChart"
import { OreCalculator } from "@/components/market/OreCalculator"
import { PriceAlerts } from "@/components/market/PriceAlert"
import { StatBadge } from "@/components/shared/StatBadge"
import { fetchGoldPrice } from "@/lib/goldApi"
import { formatGHS, formatUSD } from "@/lib/helpers"
import { DEMO_MATERIAL_PRICES } from "@/lib/goldApi"

const MATERIALS_DATA = [
  {
    id: "Gold", label: "Gold",
    description: "International spot price · XAU",
  },
  { id: "Diamond", label: "Diamond", description: "Industrial grade estimate" },
  { id: "Bauxite", label: "Bauxite", description: "Ghana standard grade" },
  { id: "Manganese", label: "Manganese", description: "Manganese ore grade" },
]

export default function MarketPrice() {
  const alerts = useQuery(api.alerts.getAllAlerts) || []
  const [activeMaterial, setActiveMaterial] = useState("Gold")
  const [goldData, setGoldData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const data = await fetchGoldPrice()
        setGoldData(data)
        setLastUpdated(new Date())
      } finally {
        setLoading(false)
      }
    }
    load()
    const interval = setInterval(load, 60000)
    return () => clearInterval(interval)
  }, [])

  const currentMaterialData = DEMO_MATERIAL_PRICES[activeMaterial] || DEMO_MATERIAL_PRICES.Gold
  const ghsPerGram = activeMaterial === "Gold" && goldData
    ? goldData.pricePerGramGHS
    : currentMaterialData.ghsPerGram

  const changePercent = activeMaterial === "Gold" && goldData
    ? goldData.changePercent
    : currentMaterialData.changePercent

  return (
    <PageWrapper>
      {/* Live price hero */}
      <div className="mb-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-zinc-500 mb-2">Live Gold Price</p>
            <p className="font-mono text-4xl md:text-5xl font-bold text-gold-400 animate-shimmer">
              {loading ? "Loading…" : formatGHS(ghsPerGram, 0)}
              <span className="text-lg text-zinc-500 font-normal">/g</span>
            </p>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <StatBadge value={changePercent} />
              {goldData && (
                <span className="text-xs text-zinc-600">
                  ${goldData.pricePerGramUSD.toFixed(2)}/g
                </span>
              )}
              {lastUpdated && (
                <span className="text-xs text-zinc-600 flex items-center gap-1">
                  <RefreshCw className="h-2.5 w-2.5" />
                  {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  {goldData?.source === "demo" && " · demo"}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Material Tabs */}
      <Tabs value={activeMaterial} onValueChange={setActiveMaterial} className="mb-6">
        <TabsList className="w-full sm:w-auto">
          {MATERIALS_DATA.map((m) => (
            <TabsTrigger key={m.id} value={m.id} className="flex-1 sm:flex-none">
              {m.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {MATERIALS_DATA.map((material) => {
          const price = material.id === "Gold" && goldData
            ? goldData.pricePerGramGHS
            : (DEMO_MATERIAL_PRICES[material.id]?.ghsPerGram || 4821)
          const change = material.id === "Gold" && goldData
            ? goldData.changePercent
            : (DEMO_MATERIAL_PRICES[material.id]?.changePercent || 0)

          return (
            <TabsContent key={material.id} value={material.id} className="space-y-6">
              {/* Price summary card */}
              <Card className="gold-card">
                <CardContent className="pt-5">
                  <p className="text-xs text-zinc-500 mb-1">{material.description}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-zinc-600">GHS / gram</p>
                      <p className="font-mono text-xl font-bold text-gold-400 mt-0.5">
                        {formatGHS(price, 0)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-zinc-600">Today</p>
                      <StatBadge value={change} className="mt-1" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-zinc-600">7-day trend</p>
                      <StatBadge value={change * 2.1} className="mt-1" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-zinc-600">30-day trend</p>
                      <StatBadge value={change * 4.7} className="mt-1" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 30-day chart */}
              <Card className="gold-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm uppercase tracking-wider text-zinc-400">
                    30-Day Price History
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <PriceChart basePrice={price} days={30} height={220} />
                </CardContent>
              </Card>
            </TabsContent>
          )
        })}
      </Tabs>

      {/* Ore Calculator */}
      <div className="mb-6">
        <OreCalculator
          marketPricePerGram={ghsPerGram}
          material={activeMaterial}
        />
      </div>

      {/* Price Alerts */}
      <PriceAlerts alerts={alerts} />
    </PageWrapper>
  )
}
