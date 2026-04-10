import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "../../convex/_generated/api"
import { Plus, TrendingDown, Star, Trophy } from "lucide-react"
import { PageWrapper, PageHeader } from "@/components/layout/PageWrapper"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { TransactionForm } from "@/components/transactions/TransactionForm"
import { TransactionCard } from "@/components/transactions/TransactionCard"
import { EmptyState } from "@/components/shared/EmptyState"
import { PageLoader } from "@/components/shared/LoadingSpinner"
import { toast } from "@/components/ui/use-toast"
import { formatGHS } from "@/lib/helpers"

export default function Transactions() {
  const transactions = useQuery(api.transactions.getAllTransactions)
  const deleteTransaction = useMutation(api.transactions.deleteTransaction)

  const [formOpen, setFormOpen] = useState(false)

  if (transactions === undefined) return <PageLoader />

  const totalEarned = transactions.reduce((s, t) => s + t.totalReceived, 0)
  const totalFairValue = transactions.reduce((s, t) => s + t.fairValue, 0)
  const totalLost = Math.max(0, totalFairValue - totalEarned)
  const avgScore = transactions.length > 0
    ? Math.round(transactions.reduce((s, t) => s + t.fairDealScore, 0) / transactions.length)
    : 0

  // Best buyer by avg score
  const buyerMap = {}
  transactions.forEach((t) => {
    if (!buyerMap[t.buyerName]) buyerMap[t.buyerName] = { scores: [], name: t.buyerName }
    buyerMap[t.buyerName].scores.push(t.fairDealScore)
  })
  const buyers = Object.values(buyerMap).map((b) => ({
    name: b.name,
    avg: Math.round(b.scores.reduce((s, v) => s + v, 0) / b.scores.length),
  }))
  const bestBuyer = buyers.length > 0
    ? buyers.reduce((a, b) => (a.avg > b.avg ? a : b))
    : null

  const handleDelete = async (id) => {
    try {
      await deleteTransaction({ id })
      toast({ title: "Transaction deleted", variant: "success" })
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" })
    }
  }

  return (
    <PageWrapper>
      <PageHeader
        title="Sales Record"
        subtitle="Track every transaction with Fair Deal analysis"
        actions={
          <Button onClick={() => setFormOpen(true)}>
            <Plus className="h-4 w-4" />
            Record Sale
          </Button>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="gold-card p-4">
          <p className="text-xs uppercase tracking-wider text-zinc-500 mb-1">Total Earned</p>
          <p className="font-mono text-xl font-bold text-gold-400">{formatGHS(totalEarned, 0)}</p>
          <p className="text-xs text-zinc-500 mt-0.5">All time</p>
        </Card>

        <Card className="gold-card p-4">
          <p className="text-xs uppercase tracking-wider text-zinc-500 mb-1">Lost to Underpricing</p>
          <p className="font-mono text-xl font-bold text-red-400">{formatGHS(totalLost, 0)}</p>
          <p className="text-xs text-zinc-500 mt-0.5 flex items-center gap-1">
            <TrendingDown className="h-3 w-3 text-red-400" />
            vs fair market value
          </p>
        </Card>

        <Card className="gold-card p-4">
          <p className="text-xs uppercase tracking-wider text-zinc-500 mb-1">Avg Fair Deal Score</p>
          <p className={`font-mono text-xl font-bold ${
            avgScore >= 90 ? "text-green-400" : avgScore >= 70 ? "text-amber-400" : "text-red-400"
          }`}>
            {avgScore || "—"}<span className="text-sm text-zinc-600 font-normal">/100</span>
          </p>
          <p className="text-xs text-zinc-500 mt-0.5">
            <Star className="h-3 w-3 inline mr-0.5" />
            {transactions.length} transactions
          </p>
        </Card>

        <Card className="gold-card p-4">
          <p className="text-xs uppercase tracking-wider text-zinc-500 mb-1">Best Buyer</p>
          <p className="text-base font-semibold text-zinc-200 truncate">
            {bestBuyer?.name || "—"}
          </p>
          {bestBuyer && (
            <p className="text-xs text-green-400 mt-0.5 flex items-center gap-1">
              <Trophy className="h-3 w-3" />
              Avg score: {bestBuyer.avg}/100
            </p>
          )}
        </Card>
      </div>

      {/* Transaction list */}
      {transactions.length === 0 ? (
        <EmptyState
          icon="🏅"
          title="No sales recorded yet"
          description="Record your first gold sale to start tracking Fair Deal Scores."
          action={{ label: "Record First Sale", onClick: () => setFormOpen(true) }}
        />
      ) : (
        <div className="space-y-3">
          {transactions.map((tx) => (
            <TransactionCard key={tx._id} transaction={tx} onDelete={handleDelete} />
          ))}
        </div>
      )}

      <TransactionForm open={formOpen} onOpenChange={setFormOpen} />
    </PageWrapper>
  )
}
