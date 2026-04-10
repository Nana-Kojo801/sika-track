import { useState, useEffect } from "react"
import { CheckCircle2, Circle, ChevronDown, ChevronUp, ExternalLink, Lightbulb, Phone, Globe, MapPin } from "lucide-react"
import { PageWrapper, PageHeader } from "@/components/layout/PageWrapper"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { getFormalisationTip } from "@/lib/openRouter"
import { FORMALISATION_STEPS } from "@/lib/constants"

const STORAGE_KEY = "sikatrack_formalisation_steps"

export default function Formalisation() {
  const [completedSteps, setCompletedSteps] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch { return [] }
  })
  const [expandedStep, setExpandedStep] = useState(null)
  const [tip, setTip] = useState(null)
  const [loadingTip, setLoadingTip] = useState(false)

  const progress = Math.round((completedSteps.length / FORMALISATION_STEPS.length) * 100)

  const toggleStep = (id) => {
    setCompletedSteps((prev) => {
      const next = prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }

  const loadTip = async () => {
    setLoadingTip(true)
    try {
      const t = await getFormalisationTip()
      setTip(t)
    } finally {
      setLoadingTip(false)
    }
  }

  useEffect(() => {
    loadTip()
  }, [])

  return (
    <PageWrapper>
      <PageHeader
        title="Get Licensed"
        subtitle="Your step-by-step guide to small-scale mining formalisation"
      />

      {/* Progress ring + summary */}
      <Card className="gold-card mb-6 p-5">
        <div className="flex items-center gap-6">
          {/* Progress ring */}
          <div className="relative shrink-0">
            <svg width="80" height="80" viewBox="0 0 80 80" className="-rotate-90">
              <circle cx="40" cy="40" r="34" fill="none" stroke="#27272a" strokeWidth="6" />
              <circle
                cx="40" cy="40" r="34"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${(progress / 100) * 2 * Math.PI * 34} ${2 * Math.PI * 34}`}
                className="transition-all duration-700"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-mono font-bold text-lg text-gold-400">{progress}%</span>
            </div>
          </div>
          <div>
            <p className="text-lg font-semibold text-zinc-100">
              {completedSteps.length} of {FORMALISATION_STEPS.length} steps complete
            </p>
            <p className="text-sm text-zinc-500 mt-0.5">
              {progress === 100
                ? "Congratulations! You've completed all formalisation steps."
                : `${FORMALISATION_STEPS.length - completedSteps.length} steps remaining to obtain your licence`}
            </p>
          </div>
        </div>
        <Progress value={progress} className="mt-4 h-2" />
      </Card>

      {/* AI Tip */}
      {tip && (
        <Card className="gold-card border-gold-500/20 mb-6">
          <CardContent className="p-4 flex items-start gap-3">
            <Lightbulb className="h-4 w-4 text-gold-400 mt-0.5 shrink-0" />
            <p className="text-sm text-zinc-300 leading-relaxed">{tip}</p>
          </CardContent>
        </Card>
      )}

      {/* Steps */}
      <div className="space-y-3 mb-8">
        {FORMALISATION_STEPS.map((step) => {
          const isCompleted = completedSteps.includes(step.id)
          const isExpanded = expandedStep === step.id

          return (
            <Card
              key={step.id}
              className={`gold-card transition-all ${isCompleted ? "opacity-80" : ""}`}
            >
              <CardContent className="p-0">
                {/* Header row */}
                <div
                  className="flex items-start gap-4 p-4 cursor-pointer select-none"
                  onClick={() => setExpandedStep(isExpanded ? null : step.id)}
                >
                  <div className="mt-0.5 shrink-0">
                    <Checkbox
                      checked={isCompleted}
                      onCheckedChange={() => toggleStep(step.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="h-5 w-5"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-medium text-zinc-500">Step {step.id}</span>
                      {isCompleted && (
                        <Badge variant="success" className="text-[10px] px-1.5 py-0">
                          <CheckCircle2 className="h-2.5 w-2.5 mr-0.5" />
                          Done
                        </Badge>
                      )}
                    </div>
                    <p className={`text-sm font-medium mt-0.5 ${isCompleted ? "text-zinc-500 line-through" : "text-zinc-200"}`}>
                      {step.title}
                    </p>
                    {!isExpanded && (
                      <p className="text-xs text-zinc-500 mt-1 line-clamp-1">{step.description}</p>
                    )}
                  </div>
                  <div className="shrink-0 text-zinc-600">
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                </div>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-0 border-t border-zinc-800/60 space-y-3 animate-fade-in">
                    <p className="text-sm text-zinc-400 leading-relaxed pt-3">{step.description}</p>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-zinc-800/40 rounded-lg p-3">
                        <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">Estimated Cost</p>
                        <p className="text-sm font-medium text-gold-400">{step.estimatedCost}</p>
                      </div>
                      <div className="bg-zinc-800/40 rounded-lg p-3">
                        <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">Timeline</p>
                        <p className="text-sm font-medium text-zinc-300">{step.timeline}</p>
                      </div>
                    </div>

                    <div className="bg-zinc-800/30 rounded-lg p-3">
                      <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-2">What You Need</p>
                      <ul className="space-y-1">
                        {step.whatYouNeed.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-zinc-300">
                            <span className="text-gold-500 mt-0.5">·</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {step.formUrl && (
                      <a
                        href={step.formUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-xs text-gold-400 hover:text-gold-300 font-medium"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        Visit official website
                      </a>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Contact card */}
      <Card className="gold-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Minerals Commission Ghana</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-gold-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-zinc-500">Address</p>
                <p className="text-sm text-zinc-300">PMB 194, Accra, Ghana</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Phone className="h-4 w-4 text-gold-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-zinc-500">Phone</p>
                <p className="text-sm text-zinc-300">+233 302 772 783</p>
              </div>
            </div>
          </div>
          <a
            href="https://www.mincomgh.org"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-gold-400 hover:text-gold-300 font-medium"
          >
            <Globe className="h-4 w-4" />
            www.mincomgh.org
          </a>
        </CardContent>
      </Card>
    </PageWrapper>
  )
}
