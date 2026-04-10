import { useState } from "react"
import { Trash2, BadgeCheck, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import { FairDealBadge } from "@/components/dashboard/FairDealBadge"
import { formatDate, formatGHS, getMaterialClasses } from "@/lib/helpers"

export function TransactionCard({ transaction, onDelete }) {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const diff = transaction.totalReceived - transaction.fairValue
  const isAbove = diff >= 0

  const handleDelete = async () => {
    setDeleting(true)
    try { await onDelete(transaction._id) }
    finally { setDeleting(false); setConfirmOpen(false) }
  }

  return (
    <>
      <div className="group gold-card rounded-xl p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="font-semibold text-zinc-100 truncate">{transaction.buyerName}</p>
              {transaction.isVerified && (
                <BadgeCheck className="h-4 w-4 text-blue-400 shrink-0" />
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={getMaterialClasses(transaction.materialType)}>
                {transaction.materialType}
              </Badge>
              <span className="text-xs text-zinc-500">{formatDate(transaction.date)}</span>
              <span className="text-xs text-zinc-600">·</span>
              <span className="text-xs text-zinc-500">{transaction.paymentMethod}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <FairDealBadge score={transaction.fairDealScore} size="sm" showLabel={false} />
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-red-400 hover:bg-red-400/10"
              onClick={() => setConfirmOpen(true)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-0.5">You received</p>
            <p className="font-mono font-bold text-lg text-gold-400">
              {formatGHS(transaction.totalReceived, 0)}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-0.5">Fair value</p>
            <p className="font-mono text-base text-zinc-400">
              {formatGHS(transaction.fairValue, 0)}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-0.5">Difference</p>
            <p className={`font-mono text-base font-semibold flex items-center gap-0.5 ${isAbove ? "text-green-400" : "text-red-400"}`}>
              {isAbove ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
              {formatGHS(Math.abs(diff), 0)}
            </p>
          </div>
        </div>

        <div className="mt-2 pt-2 border-t border-zinc-800/60 flex items-center justify-between">
          <span className="text-xs text-zinc-500">
            {transaction.weightGrams}g · {transaction.purityPercent}% purity
          </span>
          <FairDealBadge score={transaction.fairDealScore} size="sm" showLabel />
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete this transaction?"
        description="This sale record will be permanently removed."
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={handleDelete}
      />
    </>
  )
}
