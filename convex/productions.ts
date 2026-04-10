import { query, mutation } from "./_generated/server"
import { v } from "convex/values"

export const getAllProductions = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("productions")
      .order("desc")
      .collect()
  },
})

export const createProduction = mutation({
  args: {
    pitName:        v.string(),
    date:           v.string(),
    materialType:   v.string(),
    weightGrams:    v.number(),
    estimatedGrade: v.string(),
    hoursWorked:    v.number(),
    workerCount:    v.number(),
    fuelUsed:       v.optional(v.number()),
    notes:          v.optional(v.string()),
    createdAt:      v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("productions", args)
  },
})

export const deleteProduction = mutation({
  args: { id: v.id("productions") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id)
  },
})

export const getProductionStats = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("productions").collect()

    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10)
    const thisMonth = all.filter((p) => p.date >= monthStart)

    const totalWeightThisMonth = thisMonth.reduce((s, p) => s + p.weightGrams, 0)
    const totalWeightAllTime = all.reduce((s, p) => s + p.weightGrams, 0)

    const daysInMonth = now.getDate()
    const avgDailyOutput = daysInMonth > 0 ? totalWeightThisMonth / daysInMonth : 0

    // Top performing pit by total weight
    const pitWeights: Record<string, number> = {}
    all.forEach((p) => {
      pitWeights[p.pitName] = (pitWeights[p.pitName] || 0) + p.weightGrams
    })
    const topPerformingPit = Object.entries(pitWeights).sort((a, b) => b[1] - a[1])[0]?.[0] || null

    return {
      totalWeightThisMonth,
      totalWeightAllTime,
      avgDailyOutput,
      topPerformingPit,
    }
  },
})
