import { query, mutation } from "./_generated/server"
import { v } from "convex/values"

export const getAllTransactions = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("transactions")
      .order("desc")
      .collect()
  },
})

export const createTransaction = mutation({
  args: {
    buyerName:           v.string(),
    buyerContact:        v.optional(v.string()),
    date:                v.string(),
    materialType:        v.string(),
    weightGrams:         v.number(),
    purityPercent:       v.number(),
    agreedPricePerGram:  v.number(),
    marketPricePerGram:  v.number(),
    totalReceived:       v.number(),
    fairValue:           v.number(),
    fairDealScore:       v.number(),
    paymentMethod:       v.string(),
    receiptPhoto:        v.optional(v.string()),
    notes:               v.optional(v.string()),
    createdAt:           v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("transactions", args)
  },
})

export const deleteTransaction = mutation({
  args: { id: v.id("transactions") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id)
  },
})

export const getTransactionStats = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("transactions").collect()

    const totalEarned = all.reduce((s, t) => s + t.totalReceived, 0)
    const totalFairValue = all.reduce((s, t) => s + t.fairValue, 0)
    const totalLost = Math.max(0, totalFairValue - totalEarned)
    const avgFairDealScore = all.length > 0
      ? Math.round(all.reduce((s, t) => s + t.fairDealScore, 0) / all.length)
      : 0

    // Best and worst buyers
    const buyerScores: Record<string, number[]> = {}
    all.forEach((t) => {
      if (!buyerScores[t.buyerName]) buyerScores[t.buyerName] = []
      buyerScores[t.buyerName].push(t.fairDealScore)
    })

    const buyerAvgs = Object.entries(buyerScores).map(([name, scores]) => ({
      name,
      avg: scores.reduce((s, v) => s + v, 0) / scores.length,
    }))

    const bestBuyer = buyerAvgs.sort((a, b) => b.avg - a.avg)[0]?.name || null
    const worstBuyer = buyerAvgs.sort((a, b) => a.avg - b.avg)[0]?.name || null

    return {
      totalEarned,
      totalFairValue,
      totalLost,
      avgFairDealScore,
      bestBuyer,
      worstBuyer,
    }
  },
})
