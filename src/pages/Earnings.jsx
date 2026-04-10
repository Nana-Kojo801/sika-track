import { useState, useEffect } from "react"
import { useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"
import { Sparkles, TrendingUp, TrendingDown, DollarSign } from "lucide-react"
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend,
} from "recharts"
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval, parseISO } from "date-fns"
import { PageWrapper, PageHeader } from "@/components/layout/PageWrapper"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageLoader } from "@/components/shared/LoadingSpinner"
import { getEarningsInsight } from "@/lib/openRouter"
import { formatGHS, getThisMonthRecords } from "@/lib/helpers"
import { cn } from "@/lib/utils"

const PERIODS = [
  { id: "week", label: "This Week" },
  { id: "month", label: "This Month" },
  { id: "last", label: "Last Month" },
  { id: "all", label: "All Time" },
]

const CHART_COLORS = ["#f59e0b", "#c2895a", "#fbbf24", "#d97706", "#8b5e3c"]

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-zinc-700 bg-surface-900 px-3 py-2 shadow-xl">
      <p className="text-xs text-zinc-500 mb-0.5">{label}</p>
      <p className="font-mono text-sm font-semibold text-gold-400">
        {formatGHS(payload[0].value, 0)}
      </p>
    </div>
  )
}

export default function Earnings() {
  const transactions = useQuery(api.transactions.getAllTransactions)
  const productions = useQuery(api.productions.getAllProductions)

  const [period, setPeriod] = useState("month")
  const [insight, setInsight] = useState(null)
  const [loadingInsight, setLoadingInsight] = useState(false)

  if (transactions === undefined || productions === undefined) return <PageLoader />

  // Filter by period
  const filterByPeriod = (records, field = "date") => {
    const now = new Date()
    return records.filter((r) => {
      try {
        const d = typeof r[field] === "string" ? parseISO(r[field]) : new Date(r[field])
        if (period === "week") {
          const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000)
          return d >= weekAgo
        }
        if (period === "month") return isWithinInterval(d, { start: startOfMonth(now), end: endOfMonth(now) })
        if (period === "last") {
          const lastMonth = subMonths(now, 1)
          return isWithinInterval(d, { start: startOfMonth(lastMonth), end: endOfMonth(lastMonth) })
        }
        return true
      } catch { return false }
    })
  }

  const filteredTx = filterByPeriod(transactions)
  const filteredProds = filterByPeriod(productions)

  const grossRevenue = filteredTx.reduce((s, t) => s + t.totalReceived, 0)
  const estimatedExpenses = filteredProds.reduce((s, p) => s + (p.fuelUsed || 0) * 12, 0) // GHS 12/litre estimate
  const netProfit = grossRevenue - estimatedExpenses
  const avgScore = filteredTx.length > 0
    ? Math.round(filteredTx.reduce((s, t) => s + t.fairDealScore, 0) / filteredTx.length)
    : 0

  // Monthly bar chart data (last 6 months)
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const month = subMonths(new Date(), 5 - i)
    const start = startOfMonth(month)
    const end = endOfMonth(month)
    const earned = transactions
      .filter((t) => {
        try {
          const d = parseISO(t.date)
          return isWithinInterval(d, { start, end })
        } catch { return false }
      })
      .reduce((s, t) => s + t.totalReceived, 0)
    return { month: format(month, "MMM"), earned }
  })

  // Fair deal trend (last 10 transactions)
  const scoreTrend = transactions.slice(0, 10).reverse().map((t, i) => ({
    n: i + 1,
    score: t.fairDealScore,
    buyer: t.buyerName,
  }))

  // Revenue by material
  const materialRevenue = {}
  filteredTx.forEach((t) => {
    materialRevenue[t.materialType] = (materialRevenue[t.materialType] || 0) + t.totalReceived
  })
  const pieData = Object.entries(materialRevenue).map(([name, value]) => ({ name, value }))

  const loadInsight = async () => {
    setLoadingInsight(true)
    const totalGrams = filteredProds.reduce((s, p) => s + p.weightGrams, 0)
    const text = await getEarningsInsight({
      totalEarned: grossRevenue,
      transactionCount: filteredTx.length,
      avgScore,
      totalGrams,
    })
    setInsight(text)
    setLoadingInsight(false)
  }

  const ScoreTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null
    return (
      <div className="rounded-lg border border-zinc-700 bg-surface-900 px-3 py-2 shadow-xl">
        <p className="text-xs text-zinc-500">{payload[0].payload.buyer}</p>
        <p className="font-mono text-sm font-bold text-gold-400">{payload[0].value}/100</p>
      </div>
    )
  }

  return (
    <PageWrapper>
      <PageHeader title="Earnings" subtitle="Financial overview of your mining operations" />

      {/* Period selector */}
      <div className="mb-6">
        <Tabs value={period} onValueChange={setPeriod}>
          <TabsList>
            {PERIODS.map((p) => (
              <TabsTrigger key={p.id} value={p.id}>{p.label}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Gross Revenue", value: formatGHS(grossRevenue, 0), icon: DollarSign, color: "text-gold-400" },
          { label: "Est. Expenses", value: formatGHS(estimatedExpenses, 0), icon: TrendingDown, color: "text-red-400" },
          { label: "Net Profit", value: formatGHS(netProfit, 0), icon: TrendingUp, color: netProfit >= 0 ? "text-green-400" : "text-red-400" },
          { label: "Avg Fair Deal", value: `${avgScore}/100`, icon: Sparkles, color: avgScore >= 80 ? "text-green-400" : "text-amber-400" },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="gold-card p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs uppercase tracking-wider text-zinc-500">{label}</p>
              <Icon className={cn("h-4 w-4", color)} />
            </div>
            <p className={cn("font-mono text-xl font-bold", color)}>{value}</p>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Monthly earnings bar chart */}
        <Card className="gold-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm uppercase tracking-wider text-zinc-400">
              Monthly Earnings (6 months)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthlyData} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#52525b" }} tickLine={false} axisLine={false} />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="earned" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Fair deal score trend */}
        <Card className="gold-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm uppercase tracking-wider text-zinc-400">
              Fair Deal Score Trend
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={scoreTrend} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
                <XAxis dataKey="n" tick={{ fontSize: 11, fill: "#52525b" }} tickLine={false} axisLine={false} />
                <YAxis domain={[0, 100]} hide />
                <Tooltip content={<ScoreTooltip />} />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{ fill: "#f59e0b", r: 3, strokeWidth: 0 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Revenue by material */}
      {pieData.length > 0 && (
        <Card className="gold-card mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm uppercase tracking-wider text-zinc-400">
              Revenue by Material
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 flex justify-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Legend
                  formatter={(value) => <span className="text-xs text-zinc-400">{value}</span>}
                />
                <Tooltip formatter={(value) => formatGHS(value, 0)} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* AI Insight */}
      <Card className="gold-card border-gold-500/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base text-gold-400">
              <Sparkles className="h-4 w-4" />
              SikaTrack Insight
            </CardTitle>
            <Button variant="gold" size="sm" onClick={loadInsight} disabled={loadingInsight}>
              {loadingInsight ? "Generating…" : insight ? "Refresh" : "Get Insight"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {insight ? (
            <p className="text-sm text-zinc-300 leading-relaxed animate-fade-in">{insight}</p>
          ) : (
            <p className="text-sm text-zinc-500">
              Click "Get Insight" to receive a personalized financial analysis powered by AI.
            </p>
          )}
        </CardContent>
      </Card>
    </PageWrapper>
  )
}
