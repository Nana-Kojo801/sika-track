import { useState, useEffect } from "react"
import { useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"
import {
  TrendingUp, Pickaxe, DollarSign, Star, Plus, Calculator,
  ShieldAlert, ArrowRight,
} from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { PageWrapper } from "@/components/layout/PageWrapper"
import { StatCard } from "@/components/dashboard/StatCard"
import { PriceWidget } from "@/components/dashboard/PriceWidget"
import { RecentTransactions, RecentProductions } from "@/components/dashboard/RecentActivity"
import { FairDealBadge } from "@/components/dashboard/FairDealBadge"
import { AlertBanner } from "@/components/dashboard/AlertBanner"
import { PriceChart } from "@/components/market/PriceChart"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatGHS, formatGrams, getThisMonthRecords } from "@/lib/helpers"
import { fetchGoldPrice } from "@/lib/goldApi"

export default function Dashboard() {
  const navigate = useNavigate()
  const productions = useQuery(api.productions.getAllProductions) || []
  const transactions = useQuery(api.transactions.getAllTransactions) || []
  const alerts = useQuery(api.alerts.getAllAlerts) || []

  const [goldData, setGoldData] = useState(null)

  useEffect(() => {
    fetchGoldPrice().then(setGoldData)
    const interval = setInterval(() => fetchGoldPrice().then(setGoldData), 60000)
    return () => clearInterval(interval)
  }, [])

  const isLoading = productions === undefined || transactions === undefined

  // Compute stats
  const thisMonthProds = getThisMonthRecords(productions)
  const thisMonthTx = getThisMonthRecords(transactions)

  const totalWeightMonth = thisMonthProds.reduce((s, p) => s + p.weightGrams, 0)
  const totalEarnedMonth = thisMonthTx.reduce((s, t) => s + t.totalReceived, 0)
  const avgFairDealScore = thisMonthTx.length > 0
    ? Math.round(thisMonthTx.reduce((s, t) => s + t.fairDealScore, 0) / thisMonthTx.length)
    : 0

  // Active price alert check
  const triggeredAlert = goldData
    ? alerts.find((a) => {
        if (!a.isActive) return false
        const price = a.currency === "USD" ? goldData.pricePerGramUSD : goldData.pricePerGramGHS
        return a.direction === "above" ? price >= a.targetPrice : price <= a.targetPrice
      })
    : null

  const alertMessage = triggeredAlert
    ? `Price Alert: ${triggeredAlert.materialType} is ${triggeredAlert.direction} ${triggeredAlert.currency} ${triggeredAlert.targetPrice.toLocaleString()}/g`
    : null

  return (
    <PageWrapper>
      {/* Alert banner */}
      <AlertBanner message={alertMessage} />

      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-50">Dashboard</h1>
        <p className="text-sm text-zinc-500 mt-0.5">Real-time mining intelligence · Ghana</p>
      </div>

      {/* Live Gold Price Hero */}
      <Card className="gold-card mb-6 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-zinc-500 mb-2">Live Gold Price</p>
            <PriceWidget refreshInterval={60000} />
          </div>
          <div className="shrink-0">
            <TrendingUp className="h-8 w-8 text-gold-500/40" />
          </div>
        </div>
      </Card>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="This Month's Output"
          value={isLoading ? "—" : formatGrams(totalWeightMonth)}
          subtitle={`${thisMonthProds.length} session${thisMonthProds.length !== 1 ? "s" : ""} logged`}
          icon={Pickaxe}
          loading={isLoading}
        />
        <StatCard
          title="Monthly Earnings"
          value={isLoading ? "—" : formatGHS(totalEarnedMonth, 0)}
          subtitle={`${thisMonthTx.length} sale${thisMonthTx.length !== 1 ? "s" : ""} recorded`}
          icon={DollarSign}
          loading={isLoading}
        />
        <StatCard
          title="Fair Deal Score"
          value={isLoading ? "—" : avgFairDealScore || "—"}
          subtitle="Average this month"
          icon={Star}
          loading={isLoading}
        >
          {!isLoading && avgFairDealScore > 0 && (
            <Progress
              value={avgFairDealScore}
              className="h-1"
              indicatorClassName={
                avgFairDealScore >= 90 ? "bg-green-400" :
                avgFairDealScore >= 70 ? "bg-amber-400" : "bg-red-400"
              }
            />
          )}
        </StatCard>
        <StatCard
          title="Total Earnings"
          value={isLoading ? "—" : formatGHS(transactions.reduce((s, t) => s + t.totalReceived, 0), 0)}
          subtitle="All time"
          icon={TrendingUp}
          loading={isLoading}
        />
      </div>

      {/* Charts + Recent Transactions */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <Card className="gold-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm uppercase tracking-wider text-zinc-400">30-Day Gold Price</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <PriceChart basePrice={goldData?.pricePerGramGHS || 4821} days={30} height={180} />
          </CardContent>
        </Card>

        <RecentTransactions transactions={transactions} />
      </div>

      {/* Recent Production + Quick Actions */}
      <div className="grid lg:grid-cols-2 gap-6">
        <RecentProductions productions={productions} />

        {/* Quick Actions */}
        <Card className="gold-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm uppercase tracking-wider text-zinc-400">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            {[
              { icon: Pickaxe, label: "Log Production", to: "/production", color: "text-gold-400" },
              { icon: DollarSign, label: "Record Sale", to: "/transactions", color: "text-green-400" },
              { icon: Calculator, label: "Check Ore Value", to: "/market", color: "text-blue-400" },
              { icon: ShieldAlert, label: "Report Incident", to: "/safety", color: "text-red-400" },
            ].map(({ icon: Icon, label, to, color }) => (
              <Link key={to} to={to}>
                <div className="group flex items-center gap-3 p-4 rounded-xl border border-zinc-800 bg-zinc-800/30 hover:bg-zinc-800/60 hover:border-zinc-700 transition-all cursor-pointer">
                  <div className={`${color} bg-current/10 rounded-lg p-2`}>
                    <Icon className={`h-4 w-4 ${color}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-zinc-200 truncate">{label}</p>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-zinc-600 ml-auto shrink-0 group-hover:text-zinc-400 transition-colors" />
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  )
}
