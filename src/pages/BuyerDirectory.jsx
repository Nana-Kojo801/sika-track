import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "../../convex/_generated/api"
import { Plus, Search, BadgeCheck, Phone } from "lucide-react"
import { PageWrapper, PageHeader } from "@/components/layout/PageWrapper"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import { EmptyState } from "@/components/shared/EmptyState"
import { PageLoader } from "@/components/shared/LoadingSpinner"
import { toast } from "@/components/ui/use-toast"
import { getFairDealColor, getFairDealBg } from "@/lib/helpers"
import { cn } from "@/lib/utils"

export default function BuyerDirectory() {
  const buyers = useQuery(api.buyers.getAllBuyers)
  const createBuyer = useMutation(api.buyers.createBuyer)

  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: "", contact: "", location: "", licenceNumber: "" })
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  if (buyers === undefined) return <PageLoader />

  const filtered = buyers.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.location.toLowerCase().includes(search.toLowerCase())
  )

  const handleCreate = async () => {
    if (!form.name || !form.contact || !form.location) {
      toast({ title: "Missing fields", description: "Name, contact, and location required.", variant: "destructive" })
      return
    }
    setLoading(true)
    try {
      await createBuyer({
        name: form.name,
        contact: form.contact,
        location: form.location,
        licenceNumber: form.licenceNumber || undefined,
        isVerified: !!form.licenceNumber,
        totalDeals: 0,
        avgFairDealScore: 0,
        createdAt: Date.now(),
      })
      toast({ title: "Buyer added ✓", variant: "success" })
      setDialogOpen(false)
      setForm({ name: "", contact: "", location: "", licenceNumber: "" })
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageWrapper>
      <PageHeader
        title="Buyer Directory"
        subtitle="Track and rate gold buyers in your area"
        actions={
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            Add Buyer
          </Button>
        }
      />

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
        <Input
          placeholder="Search buyers by name or location…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Buyer cards */}
      {buyers.length === 0 ? (
        <EmptyState
          icon="🤝"
          title="No buyers added yet"
          description="Add the buyers you work with to track their Fair Deal Scores over time."
          action={{ label: "Add First Buyer", onClick: () => setDialogOpen(true) }}
        />
      ) : filtered.length === 0 ? (
        <p className="text-center text-zinc-500 py-12">No buyers match your search.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((buyer) => {
            const score = buyer.avgFairDealScore
            const colorClass = getFairDealColor(score)
            const bgClass = getFairDealBg(score)
            const progressColor =
              score >= 90 ? "bg-green-400" :
              score >= 70 ? "bg-amber-400" :
              score >= 50 ? "bg-orange-400" : "bg-red-400"

            return (
              <Card key={buyer._id} className="gold-card hover:border-zinc-600 transition-all">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-semibold text-zinc-100 truncate">{buyer.name}</h3>
                        {buyer.isVerified && (
                          <BadgeCheck className="h-4 w-4 text-blue-400 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-zinc-500 mt-0.5">{buyer.location}</p>
                    </div>
                    <div className={cn("rounded-md px-2 py-1 text-center min-w-[48px] border", bgClass)}>
                      <p className={cn("font-mono text-lg font-bold", colorClass)}>{score}</p>
                      <p className="text-[9px] opacity-60">avg</p>
                    </div>
                  </div>

                  <Progress
                    value={score}
                    className="h-1.5 mb-3"
                    indicatorClassName={progressColor}
                  />

                  <div className="flex items-center justify-between text-xs text-zinc-500">
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {buyer.contact}
                    </span>
                    <span>{buyer.totalDeals} deal{buyer.totalDeals !== 1 ? "s" : ""}</span>
                  </div>

                  {buyer.licenceNumber && (
                    <p className="text-[10px] text-zinc-600 mt-2">
                      Licence: {buyer.licenceNumber}
                    </p>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Add Buyer Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Add Buyer</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 px-6 pb-2">
            <div className="space-y-1.5">
              <Label htmlFor="buyerName2">Full Name *</Label>
              <Input id="buyerName2" placeholder="e.g. Kwame Asante" value={form.name} onChange={set("name")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="buyerPhone">Contact *</Label>
              <Input id="buyerPhone" placeholder="Phone number or email" value={form.contact} onChange={set("contact")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="buyerLocation">Location *</Label>
              <Input id="buyerLocation" placeholder="Town or district" value={form.location} onChange={set("location")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="buyerLicence">Licence Number (optional)</Label>
              <Input id="buyerLicence" placeholder="Minerals Commission licence" value={form.licenceNumber} onChange={set("licenceNumber")} />
              <p className="text-xs text-zinc-500">Buyers with a licence number will be marked as verified.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={loading}>
              {loading ? "Adding…" : "Add Buyer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageWrapper>
  )
}
