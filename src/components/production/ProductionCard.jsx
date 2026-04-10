import { useState } from "react"
import { Trash2, MapPin, Users, Clock, Fuel } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import { formatDate, getMaterialClasses } from "@/lib/helpers"
import { cn } from "@/lib/utils"

const gradeColors = {
  High:   "bg-green-500/10 text-green-400 border-green-500/20",
  Medium: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Low:    "bg-red-500/10 text-red-400 border-red-500/20",
}

export function ProductionCard({ production, onDelete }) {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await onDelete(production._id)
    } finally {
      setDeleting(false)
      setConfirmOpen(false)
    }
  }

  return (
    <>
      <div className="group gold-card rounded-xl p-4 flex items-start gap-4">
        {/* Weight display */}
        <div className="shrink-0 flex flex-col items-center bg-gold-500/10 rounded-lg px-3 py-2 border border-gold-500/20 min-w-[72px]">
          <span className="font-mono text-xl font-bold text-gold-400 leading-none">
            {production.weightGrams.toLocaleString()}
          </span>
          <span className="text-[10px] text-zinc-500 mt-0.5">grams</span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-semibold text-zinc-100 truncate">{production.pitName}</p>
              <p className="text-xs text-zinc-500 mt-0.5">{formatDate(production.date)}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-zinc-600 hover:text-red-400 hover:bg-red-400/10 shrink-0"
              onClick={() => setConfirmOpen(true)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-2">
            <Badge className={getMaterialClasses(production.materialType)}>
              {production.materialType}
            </Badge>
            <Badge className={gradeColors[production.estimatedGrade] || gradeColors.Medium}>
              {production.estimatedGrade} grade
            </Badge>
          </div>

          <div className="flex items-center gap-4 mt-2 flex-wrap">
            <span className="flex items-center gap-1 text-xs text-zinc-500">
              <Users className="h-3 w-3" />
              {production.workerCount} workers
            </span>
            <span className="flex items-center gap-1 text-xs text-zinc-500">
              <Clock className="h-3 w-3" />
              {production.hoursWorked}h
            </span>
            {production.fuelUsed && (
              <span className="flex items-center gap-1 text-xs text-zinc-500">
                <Fuel className="h-3 w-3" />
                {production.fuelUsed}L fuel
              </span>
            )}
          </div>

          {production.notes && (
            <p className="text-xs text-zinc-500 mt-2 italic truncate">"{production.notes}"</p>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete production log?"
        description={`This will permanently remove the ${production.weightGrams}g entry from ${production.pitName}.`}
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={handleDelete}
      />
    </>
  )
}
