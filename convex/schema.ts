import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  productions: defineTable({
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
  }),

  transactions: defineTable({
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
  }),

  buyers: defineTable({
    name:             v.string(),
    contact:          v.string(),
    location:         v.string(),
    licenceNumber:    v.optional(v.string()),
    isVerified:       v.boolean(),
    totalDeals:       v.number(),
    avgFairDealScore: v.number(),
    createdAt:        v.number(),
  }),

  priceAlerts: defineTable({
    materialType: v.string(),
    targetPrice:  v.number(),
    currency:     v.string(),
    direction:    v.string(),
    isActive:     v.boolean(),
    createdAt:    v.number(),
  }),

  safetyLogs: defineTable({
    date:          v.string(),
    incidentType:  v.string(),
    severity:      v.string(),
    location:      v.string(),
    description:   v.string(),
    isAnonymous:   v.boolean(),
    actionTaken:   v.optional(v.string()),
    createdAt:     v.number(),
  }),
})
