import { useState, useEffect } from "react"
import { Calculator, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { formatGHS } from "@/lib/helpers"

export function OreCalculator({ marketPricePerGram = 4821, material = "Gold" }) {
  const [weight, setWeight] = useState("")
  const [purity, setPurity] = useState(92)

  const w = Number(weight) || 0
  const fairValue = w * (purity / 100) * marketPricePerGram
  const minAcceptable = fairValue * 0.9
  const maxEstimate = fairValue * 1.05

  return (
    <Card className="gold-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Calculator className="h-4 w-4 text-gold-400" />
          What Is Your Ore Worth?
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="oreWeight">Weight (grams)</Label>
            <Input
              id="oreWeight"
              type="number"
              min="0"
              step="0.1"
              placeholder="Enter weight"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Material</Label>
            <div className="h-9 flex items-center px-3 rounded-lg border border-zinc-700 bg-surface-800 text-sm text-zinc-300">
              {material}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label>Estimated Purity</Label>
            <span className="font-mono text-sm text-gold-400 font-bold">{purity}%</span>
          </div>
          <Slider
            min={0}
            max={100}
            step={1}
            value={[purity]}
            onValueChange={([v]) => setPurity(v)}
          />
          <div className="flex justify-between text-[10px] text-zinc-600">
            <span>0% (raw ore)</span>
            <span>99.9% (fine gold)</span>
          </div>
        </div>

        {w > 0 ? (
          <div className="rounded-xl border border-gold-500/20 bg-gold-500/5 p-4 space-y-3">
            <div>
              <p className="text-xs uppercase tracking-wider text-zinc-500 mb-1">Estimated Fair Value</p>
              <p className="font-mono text-2xl font-bold text-gold-400 animate-gold-pulse">
                {formatGHS(minAcceptable, 0)} – {formatGHS(maxEstimate, 0)}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-zinc-800/60">
              <div>
                <p className="text-[10px] text-zinc-500">At today's spot</p>
                <p className="font-mono text-sm font-semibold text-zinc-200">
                  {formatGHS(fairValue, 0)}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-zinc-500">Minimum acceptable</p>
                <p className="font-mono text-sm font-semibold text-amber-400">
                  {formatGHS(minAcceptable, 0)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 p-2.5 mt-2">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-400 mt-0.5 shrink-0" />
              <p className="text-xs text-amber-400 font-medium">
                Don't sell below {formatGHS(minAcceptable, 0)}
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-zinc-800 bg-zinc-800/30 p-6 text-center">
            <p className="text-sm text-zinc-500">Enter weight to calculate ore value</p>
          </div>
        )}

        <div className="text-[10px] text-zinc-600">
          Based on market price of {formatGHS(marketPricePerGram, 0)}/g for {material}.
          Actual value may vary based on buyer, processing method, and ore composition.
        </div>
      </CardContent>
    </Card>
  )
}
