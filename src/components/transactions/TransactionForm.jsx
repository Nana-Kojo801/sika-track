import { useState, useEffect } from "react"
import { useMutation, useQuery } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { format } from "date-fns"
import { Loader2 } from "lucide-react"
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetDescription,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { LiveScoreRing } from "./FairDealScore"
import { fetchGoldPrice } from "@/lib/goldApi"
import { calcFairDealScore, calcFairValue, formatGHS } from "@/lib/helpers"
import { MATERIALS, PAYMENT_METHODS } from "@/lib/constants"

const defaultForm = () => ({
  buyerName: "",
  buyerContact: "",
  date: format(new Date(), "yyyy-MM-dd"),
  materialType: "Gold",
  weightGrams: "",
  purityPercent: "92",
  agreedPricePerGram: "",
  paymentMethod: "Cash",
  notes: "",
})

export function TransactionForm({ open, onOpenChange }) {
  const createTransaction = useMutation(api.transactions.createTransaction)
  const updateBuyerStats = useMutation(api.buyers.updateBuyerStats)
  const buyers = useQuery(api.buyers.getAllBuyers) || []

  const [form, setForm] = useState(defaultForm())
  const [loading, setLoading] = useState(false)
  const [marketPrice, setMarketPrice] = useState(null)

  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }))

  // Load market price on open
  useEffect(() => {
    if (open) {
      fetchGoldPrice().then((d) => setMarketPrice(d.pricePerGramGHS))
    }
  }, [open])

  // Live calculations
  const weight = Number(form.weightGrams) || 0
  const purity = Number(form.purityPercent) || 0
  const agreedPrice = Number(form.agreedPricePerGram) || 0
  const mktPrice = marketPrice || 4821

  const totalReceived = weight * agreedPrice
  const fairValue = calcFairValue(weight, purity, mktPrice)
  const fairDealScore = weight && agreedPrice ? calcFairDealScore(totalReceived, fairValue) : 0

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.buyerName || !form.weightGrams || !form.agreedPricePerGram) {
      toast({ title: "Missing fields", description: "Please fill required fields.", variant: "destructive" })
      return
    }

    setLoading(true)
    try {
      await createTransaction({
        buyerName: form.buyerName,
        buyerContact: form.buyerContact || undefined,
        date: form.date,
        materialType: form.materialType,
        weightGrams: weight,
        purityPercent: purity,
        agreedPricePerGram: agreedPrice,
        marketPricePerGram: mktPrice,
        totalReceived,
        fairValue,
        fairDealScore,
        paymentMethod: form.paymentMethod,
        notes: form.notes || undefined,
        createdAt: Date.now(),
      })

      // Update buyer stats if buyer exists
      const existingBuyer = buyers.find(
        (b) => b.name.toLowerCase() === form.buyerName.toLowerCase()
      )
      if (existingBuyer) {
        await updateBuyerStats({ id: existingBuyer._id, newScore: fairDealScore })
      }

      toast({ title: "Sale recorded ✓", variant: "success" })
      setForm(defaultForm())
      onOpenChange(false)
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col">
        <SheetHeader className="px-6 pt-6 pb-0">
          <SheetTitle>Record Sale</SheetTitle>
          <SheetDescription>Log a gold transaction with Fair Deal analysis</SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {/* Live Score Preview */}
          {weight > 0 && agreedPrice > 0 && (
            <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-700 bg-zinc-800/40 animate-fade-in">
              <div>
                <p className="text-xs text-zinc-500 mb-1">Live Preview</p>
                <p className="font-mono text-lg font-bold text-gold-400">{formatGHS(totalReceived, 0)}</p>
                <p className="text-xs text-zinc-500">Fair value: {formatGHS(fairValue, 0)}</p>
              </div>
              <LiveScoreRing score={fairDealScore} />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="buyerName">Buyer Name *</Label>
              <Input
                id="buyerName"
                placeholder="e.g. Kwame Asante"
                value={form.buyerName}
                onChange={(e) => set("buyerName")(e.target.value)}
                list="buyer-list"
              />
              <datalist id="buyer-list">
                {buyers.map((b) => (
                  <option key={b._id} value={b.name} />
                ))}
              </datalist>
            </div>

            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="buyerContact">Buyer Contact (optional)</Label>
              <Input
                id="buyerContact"
                placeholder="Phone or email"
                value={form.buyerContact}
                onChange={(e) => set("buyerContact")(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="txDate">Date *</Label>
              <Input
                id="txDate"
                type="date"
                value={form.date}
                onChange={(e) => set("date")(e.target.value)}
                className="[color-scheme:dark]"
              />
            </div>

            <div className="space-y-1.5">
              <Label>Material *</Label>
              <Select value={form.materialType} onValueChange={set("materialType")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {MATERIALS.map((m) => (
                    <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="weight">Weight (grams) *</Label>
              <Input
                id="weight"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={form.weightGrams}
                onChange={(e) => set("weightGrams")(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="purity">Purity % *</Label>
              <Input
                id="purity"
                type="number"
                min="0"
                max="100"
                placeholder="92"
                value={form.purityPercent}
                onChange={(e) => set("purityPercent")(e.target.value)}
              />
            </div>

            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="agreedPrice">Price per gram (GHS) *</Label>
              <Input
                id="agreedPrice"
                type="number"
                min="0"
                step="0.01"
                placeholder={`Market: ~${mktPrice.toFixed(0)}/g`}
                value={form.agreedPricePerGram}
                onChange={(e) => set("agreedPricePerGram")(e.target.value)}
              />
              {mktPrice && agreedPrice > 0 && (
                <p className={`text-xs ${agreedPrice >= mktPrice * 0.9 ? "text-green-400" : "text-amber-400"}`}>
                  {agreedPrice >= mktPrice * 0.9
                    ? `✓ Within 10% of market (${formatGHS(mktPrice, 0)}/g)`
                    : `⚠ Below 90% of market price (${formatGHS(mktPrice, 0)}/g)`}
                </p>
              )}
            </div>

            <div className="col-span-2 space-y-1.5">
              <Label>Payment Method *</Label>
              <Select value={form.paymentMethod} onValueChange={set("paymentMethod")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PAYMENT_METHODS.map((m) => (
                    <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="txNotes">Notes</Label>
              <Textarea
                id="txNotes"
                placeholder="Any notes about this sale…"
                value={form.notes}
                onChange={(e) => set("notes")(e.target.value)}
                rows={2}
              />
            </div>
          </div>

          {/* Min acceptable warning */}
          {fairValue > 0 && (
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
              <p className="text-xs text-amber-400 font-medium">
                Don't sell below {formatGHS(fairValue * 0.9, 0)}
              </p>
              <p className="text-xs text-zinc-500 mt-0.5">
                90% of fair value — absolute minimum for {weight}g at {purity}% purity
              </p>
            </div>
          )}
        </form>

        <SheetFooter className="px-6 py-4 border-t border-zinc-800 flex gap-3">
          <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button className="flex-1" disabled={loading} onClick={handleSubmit}>
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</> : "Record Sale"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
