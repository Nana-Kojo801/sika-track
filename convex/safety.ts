import { query, mutation } from "./_generated/server"
import { v } from "convex/values"

export const getAllSafetyLogs = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("safetyLogs").order("desc").collect()
  },
})

export const createSafetyLog = mutation({
  args: {
    date:         v.string(),
    incidentType: v.string(),
    severity:     v.string(),
    location:     v.string(),
    description:  v.string(),
    isAnonymous:  v.boolean(),
    actionTaken:  v.optional(v.string()),
    createdAt:    v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("safetyLogs", args)
  },
})

export const getSafetyStats = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("safetyLogs").collect()

    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10)
    const thisMonth = all.filter((l) => l.date >= monthStart)

    const bySeverity: Record<string, number> = {}
    const byType: Record<string, number> = {}

    thisMonth.forEach((l) => {
      bySeverity[l.severity] = (bySeverity[l.severity] || 0) + 1
      byType[l.incidentType] = (byType[l.incidentType] || 0) + 1
    })

    return {
      totalThisMonth: thisMonth.length,
      bySeverity,
      byType,
    }
  },
})
