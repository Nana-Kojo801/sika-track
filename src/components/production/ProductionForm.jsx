import { useState } from "react"
import { useMutation } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { format } from "date-fns"
import { Lightbulb, Loader2 } from "lucide-react"
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/components/ui/use-toast"
import { getProductionTip } from "@/lib/openRouter"
import { MATERIALS } from "@/lib/constants"
import { cn } from "@/lib/utils"

const GRADES = [
  { value: "High",   label: "High",   desc: "Rich ore, high concentration", color: "border-green-500/40 text-green-400" },
  { value: "Medium", label: "Medium", desc: "Standard yield",                color: "border-amber-500/40 text-amber-400" },
  { value: "Low",    label: "Low",    desc: "Sparse concentration",          color: "border-red-500/40 text-red-400" },
]

const defaultForm = () => ({
  pitName: "",
  date: format(new Date(), "yyyy-MM-dd"),
  materialType: "Gold",
  weightGrams: "",
  estimatedGrade: "Medium",
  hoursWorked: "",
  workerCount: "",
  fuelUsed: "",
  notes: "",
})

export function ProductionForm({ open, onOpenChange }) {
  const createProduction = useMutation(api.productions.createProduction)
  const [form, setForm] = useState(defaultForm())
  const [loading, setLoading] = useState(false)
  const [tip, setTip] = useState(null)

  const set = (key) => (val) =>
    setForm((f) => ({ ...f, [key]: val }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.pitName || !form.weightGrams || !form.hoursWorked || !form.workerCount) {
      toast({ title: "Missing fields", description: "Please fill in all required fields.", variant: "destructive" })
      return
    }

    setLoading(true)
    try {
      await createProduction({
        pitName: form.pitName,
        date: form.date,
        materialType: form.materialType,
        weightGrams: Number(form.weightGrams),
        estimatedGrade: form.estimatedGrade,
        hoursWorked: Number(form.hoursWorked),
        workerCount: Number(form.workerCount),
        fuelUsed: form.fuelUsed ? Number(form.fuelUsed) : undefined,
        notes: form.notes || undefined,
        createdAt: Date.now(),
      })

      toast({ title: "Production logged ✓", variant: "success" })

      // Fetch AI tip in background
      getProductionTip({
        weightGrams: Number(form.weightGrams),
        grade: form.estimatedGrade,
        material: form.materialType,
        pitName: form.pitName,
        workers: Number(form.workerCount),
        hours: Number(form.hoursWorked),
      }).then(setTip)

      setForm(defaultForm())
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
          <SheetTitle>Log Production</SheetTitle>
          <SheetDescription>Record today's mining output</SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="pitName">Pit Name *</Label>
              <Input
                id="pitName"
                placeholder="e.g. Pit A, Main Site"
                value={form.pitName}
                onChange={(e) => set("pitName")(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={form.date}
                onChange={(e) => set("date")(e.target.value)}
                className="[color-scheme:dark]"
              />
            </div>

            <div className="space-y-1.5">
              <Label>Material Type *</Label>
              <Select value={form.materialType} onValueChange={set("materialType")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MATERIALS.map((m) => (
                    <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="weightGrams">Weight (grams) *</Label>
              <Input
                id="weightGrams"
                type="number"
                min="0"
                step="0.1"
                placeholder="0.00"
                value={form.weightGrams}
                onChange={(e) => set("weightGrams")(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="fuelUsed">Fuel Used (litres)</Label>
              <Input
                id="fuelUsed"
                type="number"
                min="0"
                step="0.1"
                placeholder="Optional"
                value={form.fuelUsed}
                onChange={(e) => set("fuelUsed")(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="hoursWorked">Hours Worked *</Label>
              <Input
                id="hoursWorked"
                type="number"
                min="0"
                max="24"
                placeholder="8"
                value={form.hoursWorked}
                onChange={(e) => set("hoursWorked")(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="workerCount">Number of Workers *</Label>
              <Input
                id="workerCount"
                type="number"
                min="1"
                placeholder="5"
                value={form.workerCount}
                onChange={(e) => set("workerCount")(e.target.value)}
              />
            </div>
          </div>

          {/* Grade selection */}
          <div className="space-y-2">
            <Label>Estimated Grade *</Label>
            <div className="grid grid-cols-3 gap-2">
              {GRADES.map((g) => (
                <button
                  key={g.value}
                  type="button"
                  onClick={() => set("estimatedGrade")(g.value)}
                  className={cn(
                    "flex flex-col items-center p-3 rounded-lg border transition-all text-left",
                    form.estimatedGrade === g.value
                      ? `${g.color} bg-opacity-10 bg-current`
                      : "border-zinc-700 text-zinc-400 hover:border-zinc-600"
                  )}
                >
                  <span className="text-sm font-semibold">{g.label}</span>
                  <span className="text-[10px] text-center mt-0.5 opacity-70">{g.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any observations about today's session…"
              value={form.notes}
              onChange={(e) => set("notes")(e.target.value)}
              rows={3}
            />
          </div>

          {/* AI Tip */}
          {tip && (
            <div className="rounded-xl border border-gold-500/20 bg-gold-500/5 p-4 animate-fade-in">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="h-4 w-4 text-gold-400" />
                <span className="text-xs font-semibold text-gold-400 uppercase tracking-wider">SikaTrack Tip</span>
              </div>
              <p className="text-sm text-zinc-300 leading-relaxed">{tip}</p>
            </div>
          )}
        </form>

        <SheetFooter className="px-6 py-4 border-t border-zinc-800 flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1"
            disabled={loading}
            onClick={handleSubmit}
          >
            {loading ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</>
            ) : (
              "Log Production"
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
