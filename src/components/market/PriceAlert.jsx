import { useState } from "react"
import { useMutation } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { Bell, BellOff, Trash2, Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import { toast } from "@/components/ui/use-toast"
import { formatGHS } from "@/lib/helpers"
import { MATERIALS } from "@/lib/constants"

export function PriceAlerts({ alerts = [] }) {
  const createAlert = useMutation(api.alerts.createAlert)
  const toggleAlert = useMutation(api.alerts.toggleAlert)
  const deleteAlert = useMutation(api.alerts.deleteAlert)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [confirmId, setConfirmId] = useState(null)
  const [form, setForm] = useState({ materialType: "Gold", targetPrice: "", currency: "GHS", direction: "above" })

  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }))

  const handleCreate = async () => {
    if (!form.targetPrice) return
    try {
      await createAlert({
        materialType: form.materialType,
        targetPrice: Number(form.targetPrice),
        currency: form.currency,
        direction: form.direction,
        isActive: true,
        createdAt: Date.now(),
      })
      toast({ title: "Alert created ✓", variant: "success" })
      setDialogOpen(false)
      setForm({ materialType: "Gold", targetPrice: "", currency: "GHS", direction: "above" })
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" })
    }
  }

  return (
    <>
      <Card className="gold-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <Bell className="h-4 w-4 text-gold-400" />
              Price Alerts
            </CardTitle>
            <Button variant="gold" size="sm" onClick={() => setDialogOpen(true)}>
              <Plus className="h-3.5 w-3.5" />
              Add Alert
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {alerts.length === 0 ? (
            <p className="text-sm text-zinc-500 text-center py-4">
              No alerts set. Add one to get notified when prices move.
            </p>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert._id}
                className="group flex items-center justify-between gap-3 p-3 rounded-lg border border-zinc-800 bg-zinc-800/30"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-zinc-200">
                    {alert.materialType} {alert.direction} {formatGHS(alert.targetPrice, 0)}
                  </p>
                  <p className="text-xs text-zinc-500">{alert.currency} · {alert.isActive ? "Active" : "Paused"}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Switch
                    checked={alert.isActive}
                    onCheckedChange={(v) => toggleAlert({ id: alert._id, isActive: v })}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-red-400"
                    onClick={() => setConfirmId(alert._id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Add Alert Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Add Price Alert</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 px-6 pb-2">
            <div className="space-y-1.5">
              <Label>Material</Label>
              <Select value={form.materialType} onValueChange={set("materialType")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {MATERIALS.map((m) => (
                    <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Alert when price goes</Label>
                <Select value={form.direction} onValueChange={set("direction")}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="above">Above</SelectItem>
                    <SelectItem value="below">Below</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Currency</Label>
                <Select value={form.currency} onValueChange={set("currency")}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GHS">GHS</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="targetPrice">Target Price</Label>
              <Input
                id="targetPrice"
                type="number"
                placeholder="e.g. 5000"
                value={form.targetPrice}
                onChange={(e) => set("targetPrice")(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate}>Create Alert</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!confirmId}
        onOpenChange={() => setConfirmId(null)}
        title="Delete alert?"
        description="This price alert will be removed."
        confirmLabel="Delete"
        onConfirm={async () => {
          await deleteAlert({ id: confirmId })
          setConfirmId(null)
          toast({ title: "Alert deleted", variant: "success" })
        }}
      />
    </>
  )
}
