import { query, mutation } from "./_generated/server"
import { v } from "convex/values"

export const getAllBuyers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("buyers").order("desc").collect()
  },
})

export const createBuyer = mutation({
  args: {
    name:             v.string(),
    contact:          v.string(),
    location:         v.string(),
    licenceNumber:    v.optional(v.string()),
    isVerified:       v.boolean(),
    totalDeals:       v.number(),
    avgFairDealScore: v.number(),
    createdAt:        v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("buyers", args)
  },
})

export const updateBuyerStats = mutation({
  args: {
    id:       v.id("buyers"),
    newScore: v.number(),
  },
  handler: async (ctx, { id, newScore }) => {
    const buyer = await ctx.db.get(id)
    if (!buyer) return

    const totalDeals = buyer.totalDeals + 1
    // Recalculate weighted average
    const newAvg = Math.round(
      (buyer.avgFairDealScore * buyer.totalDeals + newScore) / totalDeals
    )

    await ctx.db.patch(id, {
      totalDeals,
      avgFairDealScore: newAvg,
    })
  },
})
