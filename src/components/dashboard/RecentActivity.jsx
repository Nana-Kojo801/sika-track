import { ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FairDealBadge } from "./FairDealBadge"
import { formatGHS, formatRelativeDate, getMaterialClasses } from "@/lib/helpers"
import { EmptyState } from "@/components/shared/EmptyState"

export function RecentTransactions({ transactions = [] }) {
  return (
    <Card className="gold-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm uppercase tracking-wider text-zinc-400">Recent Sales</CardTitle>
          <Link to="/transactions" className="text-xs text-gold-400 hover:text-gold-300 flex items-center gap-1">
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {transactions.length === 0 ? (
          <p className="text-sm text-zinc-500 py-4 text-center">No sales recorded yet</p>
        ) : (
          transactions.slice(0, 3).map((tx) => (
            <div
              key={tx._id}
              className="flex items-center justify-between gap-3 p-3 rounded-lg bg-zinc-800/40 hover:bg-zinc-800/60 transition-colors"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-medium text-zinc-200 truncate">{tx.buyerName}</p>
                  {tx.isVerified && (
                    <Badge variant="success" className="text-[9px] px-1 py-0">✓</Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getMaterialClasses(tx.materialType)}>{tx.materialType}</Badge>
                  <span className="text-xs text-zinc-500">{formatRelativeDate(tx.date)}</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="font-mono text-sm font-semibold text-gold-400">
                  {formatGHS(tx.totalReceived, 0)}
                </p>
                <FairDealBadge score={tx.fairDealScore} showLabel={false} size="sm" />
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}

export function RecentProductions({ productions = [] }) {
  return (
    <Card className="gold-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm uppercase tracking-wider text-zinc-400">Recent Production</CardTitle>
          <Link to="/production" className="text-xs text-gold-400 hover:text-gold-300 flex items-center gap-1">
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {productions.length === 0 ? (
          <p className="text-sm text-zinc-500 py-4 text-center">No production logged yet</p>
        ) : (
          productions.slice(0, 3).map((p) => (
            <div
              key={p._id}
              className="flex items-center justify-between gap-3 p-3 rounded-lg bg-zinc-800/40 hover:bg-zinc-800/60 transition-colors"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-zinc-200 truncate">{p.pitName}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <Badge className={getMaterialClasses(p.materialType)}>{p.materialType}</Badge>
                  <span className="text-xs text-zinc-500">{formatRelativeDate(p.date)}</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="font-mono text-sm font-semibold text-gold-400">
                  {p.weightGrams.toLocaleString()}g
                </p>
                <p className="text-xs text-zinc-500">{p.estimatedGrade} grade</p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
