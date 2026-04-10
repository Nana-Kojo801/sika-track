import { query, mutation } from "./_generated/server"
import { v } from "convex/values"

export const getAllAlerts = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("priceAlerts").order("desc").collect()
  },
})

export const createAlert = mutation({
  args: {
    materialType: v.string(),
    targetPrice:  v.number(),
    currency:     v.string(),
    direction:    v.string(),
    isActive:     v.boolean(),
    createdAt:    v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("priceAlerts", args)
  },
})

export const toggleAlert = mutation({
  args: {
    id:       v.id("priceAlerts"),
    isActive: v.boolean(),
  },
  handler: async (ctx, { id, isActive }) => {
    await ctx.db.patch(id, { isActive })
  },
})

export const deleteAlert = mutation({
  args: { id: v.id("priceAlerts") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id)
  },
})
