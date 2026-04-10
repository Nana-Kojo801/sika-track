import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "../../convex/_generated/api"
import { Plus, LayoutGrid, Table2, Pickaxe } from "lucide-react"
import { PageWrapper, PageHeader } from "@/components/layout/PageWrapper"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ProductionForm } from "@/components/production/ProductionForm"
import { ProductionCard } from "@/components/production/ProductionCard"
import { ProductionTable } from "@/components/production/ProductionTable"
import { EmptyState } from "@/components/shared/EmptyState"
import { PageLoader } from "@/components/shared/LoadingSpinner"
import { toast } from "@/components/ui/use-toast"
import { formatGrams, getThisMonthRecords } from "@/lib/helpers"

export default function ProductionLog() {
  const productions = useQuery(api.productions.getAllProductions)
  const deleteProduction = useMutation(api.productions.deleteProduction)

  const [formOpen, setFormOpen] = useState(false)
  const [view, setView] = useState("cards")

  if (productions === undefined) return <PageLoader />

  const thisMonth = getThisMonthRecords(productions)
  const totalWeightMonth = thisMonth.reduce((s, p) => s + p.weightGrams, 0)
  const pits = [...new Set(productions.map((p) => p.pitName))].length
  const avgDaily = thisMonth.length > 0
    ? totalWeightMonth / new Date().getDate()
    : 0

  const handleDelete = async (id) => {
    try {
      await deleteProduction({ id })
      toast({ title: "Entry deleted", variant: "success" })
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" })
    }
  }

  return (
    <PageWrapper>
      <PageHeader
        title="Production Log"
        subtitle="Track your daily mining output"
        actions={
          <Button onClick={() => setFormOpen(true)}>
            <Plus className="h-4 w-4" />
            Log Output
          </Button>
        }
      />

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Weight This Month", value: formatGrams(totalWeightMonth) },
          { label: "Active Pits", value: pits || "—" },
          { label: "Avg Daily Output", value: avgDaily > 0 ? `${avgDaily.toFixed(1)}g` : "—" },
        ].map(({ label, value }) => (
          <Card key={label} className="gold-card text-center p-4">
            <p className="text-xs uppercase tracking-wider text-zinc-500 mb-1">{label}</p>
            <p className="font-mono text-xl font-bold text-gold-400">{value}</p>
          </Card>
        ))}
      </div>

      {/* View toggle */}
      {productions.length > 0 && (
        <div className="flex items-center gap-2 mb-4">
          <Button
            variant={view === "cards" ? "gold" : "ghost"}
            size="sm"
            onClick={() => setView("cards")}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            Cards
          </Button>
          <Button
            variant={view === "table" ? "gold" : "ghost"}
            size="sm"
            onClick={() => setView("table")}
          >
            <Table2 className="h-3.5 w-3.5" />
            Table
          </Button>
        </div>
      )}

      {/* Content */}
      {productions.length === 0 ? (
        <EmptyState
          icon="⛏️"
          title="No production logged yet"
          description="Start tracking your daily mining output to see statistics and insights."
          action={{ label: "Log First Output", onClick: () => setFormOpen(true) }}
        />
      ) : view === "cards" ? (
        <div className="space-y-3">
          {productions.map((p) => (
            <ProductionCard key={p._id} production={p} onDelete={handleDelete} />
          ))}
        </div>
      ) : (
        <ProductionTable productions={productions} />
      )}

      <ProductionForm open={formOpen} onOpenChange={setFormOpen} />
    </PageWrapper>
  )
}
