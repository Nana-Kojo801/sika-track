import { useState } from "react"
import { useMutation } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import { formatDate, getMaterialClasses } from "@/lib/helpers"
import { toast } from "@/components/ui/use-toast"

const gradeColors = {
  High:   "bg-green-500/10 text-green-400 border-green-500/20",
  Medium: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Low:    "bg-red-500/10 text-red-400 border-red-500/20",
}

export function ProductionTable({ productions }) {
  const deleteProduction = useMutation(api.productions.deleteProduction)
  const [confirmId, setConfirmId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteProduction({ id: confirmId })
      toast({ title: "Entry deleted", variant: "success" })
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" })
    } finally {
      setDeleting(false)
      setConfirmId(null)
    }
  }

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-zinc-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-surface-900">
              <th className="text-left px-4 py-3 text-xs text-zinc-500 uppercase tracking-wider font-medium">Date / Pit</th>
              <th className="text-left px-4 py-3 text-xs text-zinc-500 uppercase tracking-wider font-medium">Material</th>
              <th className="text-right px-4 py-3 text-xs text-zinc-500 uppercase tracking-wider font-medium">Weight</th>
              <th className="text-left px-4 py-3 text-xs text-zinc-500 uppercase tracking-wider font-medium">Grade</th>
              <th className="text-left px-4 py-3 text-xs text-zinc-500 uppercase tracking-wider font-medium hidden md:table-cell">Workers × Hours</th>
              <th className="px-4 py-3 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {productions.map((p) => (
              <tr key={p._id} className="group hover:bg-zinc-800/20 transition-colors">
                <td className="px-4 py-3">
                  <p className="font-medium text-zinc-200">{p.pitName}</p>
                  <p className="text-xs text-zinc-500">{formatDate(p.date)}</p>
                </td>
                <td className="px-4 py-3">
                  <Badge className={getMaterialClasses(p.materialType)}>{p.materialType}</Badge>
                </td>
                <td className="px-4 py-3 text-right font-mono font-semibold text-gold-400">
                  {p.weightGrams.toLocaleString()}g
                </td>
                <td className="px-4 py-3">
                  <Badge className={gradeColors[p.estimatedGrade] || gradeColors.Medium}>
                    {p.estimatedGrade}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-zinc-400 text-xs hidden md:table-cell">
                  {p.workerCount} × {p.hoursWorked}h
                </td>
                <td className="px-4 py-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-red-400 hover:bg-red-400/10"
                    onClick={() => setConfirmId(p._id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={!!confirmId}
        onOpenChange={() => setConfirmId(null)}
        title="Delete production log?"
        description="This entry will be permanently removed."
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={handleDelete}
      />
    </>
  )
}
