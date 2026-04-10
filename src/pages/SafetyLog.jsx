import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "../../convex/_generated/api"
import { Plus, ShieldAlert, ShieldCheck, AlertTriangle, Lightbulb } from "lucide-react"
import { PageWrapper, PageHeader } from "@/components/layout/PageWrapper"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { EmptyState } from "@/components/shared/EmptyState"
import { PageLoader } from "@/components/shared/LoadingSpinner"
import { toast } from "@/components/ui/use-toast"
import { getSafetyAdvice } from "@/lib/openRouter"
import { formatDate, getThisMonthRecords, getSeverityBorder } from "@/lib/helpers"
import { INCIDENT_TYPES, SEVERITIES } from "@/lib/constants"
import { format } from "date-fns"

const defaultForm = () => ({
  date: format(new Date(), "yyyy-MM-dd"),
  incidentType: "Near-miss",
  severity: "Low",
  location: "",
  description: "",
  actionTaken: "",
  isAnonymous: false,
})

const severityBadge = {
  Critical: "bg-red-500/10 text-red-400 border-red-500/20",
  High:     "bg-orange-500/10 text-orange-400 border-orange-500/20",
  Medium:   "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Low:      "bg-zinc-500/10 text-zinc-400 border-zinc-600/20",
}

export default function SafetyLog() {
  const logs = useQuery(api.safety.getAllSafetyLogs)
  const createLog = useMutation(api.safety.createSafetyLog)

  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState(defaultForm())
  const [loading, setLoading] = useState(false)
  const [aiAdvice, setAiAdvice] = useState({}) // { [logId]: advice }

  if (logs === undefined) return <PageLoader />

  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }))

  const thisMonth = getThisMonthRecords(logs)
  const bySeverity = SEVERITIES.reduce((acc, s) => {
    acc[s.value] = thisMonth.filter((l) => l.severity === s.value).length
    return acc
  }, {})

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.location || !form.description) {
      toast({ title: "Missing fields", description: "Please fill location and description.", variant: "destructive" })
      return
    }

    setLoading(true)
    try {
      const newId = await createLog({
        date: form.date,
        incidentType: form.incidentType,
        severity: form.severity,
        location: form.location,
        description: form.description,
        isAnonymous: form.isAnonymous,
        actionTaken: form.actionTaken || undefined,
        createdAt: Date.now(),
      })

      toast({ title: "Incident reported ✓", variant: "success" })
      setFormOpen(false)

      // Fetch AI safety advice
      const advice = await getSafetyAdvice({
        severity: form.severity,
        incidentType: form.incidentType,
        description: form.description,
      })
      if (newId && advice) {
        setAiAdvice((prev) => ({ ...prev, [newId]: advice }))
      }

      setForm(defaultForm())
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageWrapper>
      <PageHeader
        title="Safety Log"
        subtitle="Report incidents and track mine safety"
        actions={
          <Button onClick={() => setFormOpen(true)} variant="destructive">
            <Plus className="h-4 w-4" />
            Report Incident
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="gold-card p-4 col-span-2 md:col-span-1">
          <p className="text-xs uppercase tracking-wider text-zinc-500 mb-1">This Month</p>
          <p className="font-mono text-2xl font-bold text-zinc-200">{thisMonth.length}</p>
          <p className="text-xs text-zinc-500">incidents reported</p>
        </Card>
        {SEVERITIES.map((s) => (
          <Card key={s.value} className="gold-card p-4">
            <p className={`text-xs uppercase tracking-wider mb-1 ${s.color}`}>{s.value}</p>
            <p className="font-mono text-2xl font-bold text-zinc-200">{bySeverity[s.value] || 0}</p>
          </Card>
        ))}
      </div>

      {/* Incident list */}
      {logs.length === 0 ? (
        <EmptyState
          icon="🛡️"
          title="No incidents reported"
          description="A safety record of zero incidents is excellent. Use this log to report any near-misses or incidents."
          action={{ label: "Report Incident", onClick: () => setFormOpen(true) }}
        />
      ) : (
        <div className="space-y-3">
          {logs.map((log) => (
            <Card
              key={log._id}
              className={`gold-card border-l-4 ${getSeverityBorder(log.severity)}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={severityBadge[log.severity]}>{log.severity}</Badge>
                      <Badge variant="secondary">{log.incidentType}</Badge>
                      {log.isAnonymous && (
                        <Badge variant="outline" className="text-zinc-500">Anonymous</Badge>
                      )}
                    </div>
                    <p className="text-xs text-zinc-500 mt-1">
                      {formatDate(log.date)} · {log.location}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-zinc-300 leading-relaxed">{log.description}</p>
                {log.actionTaken && (
                  <p className="text-xs text-zinc-500 mt-2 border-t border-zinc-800 pt-2">
                    <span className="font-medium text-zinc-400">Action taken:</span> {log.actionTaken}
                  </p>
                )}

                {/* AI Advice */}
                {aiAdvice[log._id] && (
                  <div className="mt-3 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Lightbulb className="h-3.5 w-3.5 text-amber-400" />
                      <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                        Recommended Actions
                      </span>
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-line">
                      {aiAdvice[log._id]}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Report Form */}
      <Sheet open={formOpen} onOpenChange={setFormOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col">
          <SheetHeader className="px-6 pt-6 pb-0">
            <SheetTitle className="flex items-center gap-2 text-red-400">
              <ShieldAlert className="h-4 w-4" />
              Report Incident
            </SheetTitle>
          </SheetHeader>
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="safetyDate">Date</Label>
                <Input
                  id="safetyDate"
                  type="date"
                  value={form.date}
                  onChange={(e) => set("date")(e.target.value)}
                  className="[color-scheme:dark]"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Incident Type</Label>
                <Select value={form.incidentType} onValueChange={set("incidentType")}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {INCIDENT_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Severity</Label>
                <Select value={form.severity} onValueChange={set("severity")}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {SEVERITIES.map((s) => (
                      <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="incidentLocation">Location / Pit</Label>
                <Input
                  id="incidentLocation"
                  placeholder="e.g. Pit A, Shaft 2"
                  value={form.location}
                  onChange={(e) => set("location")(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="incidentDesc">Description *</Label>
              <Textarea
                id="incidentDesc"
                placeholder="What happened? Describe the incident clearly…"
                value={form.description}
                onChange={(e) => set("description")(e.target.value)}
                rows={4}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="actionTaken">Action Taken (optional)</Label>
              <Textarea
                id="actionTaken"
                placeholder="What was done in response?"
                value={form.actionTaken}
                onChange={(e) => set("actionTaken")(e.target.value)}
                rows={2}
              />
            </div>
            <div className="flex items-center justify-between py-2 px-3 rounded-lg border border-zinc-800 bg-zinc-800/30">
              <div>
                <p className="text-sm font-medium text-zinc-300">Anonymous Report</p>
                <p className="text-xs text-zinc-500">Your name won't be associated with this report</p>
              </div>
              <Switch
                checked={form.isAnonymous}
                onCheckedChange={set("isAnonymous")}
              />
            </div>
          </form>
          <SheetFooter className="px-6 py-4 border-t border-zinc-800 flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setFormOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" className="flex-1" disabled={loading} onClick={handleSubmit}>
              {loading ? "Submitting…" : "Report Incident"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </PageWrapper>
  )
}
