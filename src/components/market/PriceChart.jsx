import { useMemo } from "react"
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts"
import { generatePriceHistory } from "@/lib/helpers"

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-zinc-700 bg-surface-900 px-3 py-2 shadow-xl">
      <p className="text-xs text-zinc-500 mb-0.5">{label}</p>
      <p className="font-mono text-sm font-semibold text-gold-400">
        GHS {payload[0].value.toLocaleString("en-GH", { maximumFractionDigits: 0 })}
      </p>
    </div>
  )
}

export function PriceChart({ basePrice = 4821, days = 30, height = 200 }) {
  const data = useMemo(() => generatePriceHistory(basePrice, days), [basePrice, days])
  const minPrice = Math.min(...data.map((d) => d.price))
  const maxPrice = Math.max(...data.map((d) => d.price))

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 4, left: 4, bottom: 0 }}>
          <defs>
            <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#f59e0b" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: "#52525b" }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis hide domain={["auto", "auto"]} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="price"
            stroke="#f59e0b"
            strokeWidth={2}
            fill="url(#goldGrad)"
            dot={false}
            activeDot={{ r: 4, fill: "#f59e0b", strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
