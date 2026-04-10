import { format, startOfMonth, endOfMonth, isWithinInterval, parseISO } from "date-fns"
import { GHS_USD_RATE, TROY_OZ_TO_GRAMS } from "./constants"

/**
 * Format a number as GHS currency
 */
export function formatGHS(amount, decimals = 2) {
  return `GHS ${Number(amount).toLocaleString("en-GH", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`
}

/**
 * Format a number as USD currency
 */
export function formatUSD(amount, decimals = 2) {
  return `$${Number(amount).toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`
}

/**
 * Format grams with unit
 */
export function formatGrams(grams) {
  if (grams >= 1000) {
    return `${(grams / 1000).toFixed(2)} kg`
  }
  return `${Number(grams).toLocaleString("en-GH", { maximumFractionDigits: 2 })}g`
}

/**
 * Convert USD per troy oz to GHS per gram
 */
export function usdOzToGHSGram(usdPerOz, ghsUsdRate = GHS_USD_RATE) {
  const usdPerGram = usdPerOz / TROY_OZ_TO_GRAMS
  return usdPerGram * ghsUsdRate
}

/**
 * Calculate fair deal score (0–100)
 */
export function calcFairDealScore(totalReceived, fairValue) {
  if (!fairValue || fairValue === 0) return 0
  return Math.min(100, Math.round((totalReceived / fairValue) * 100))
}

/**
 * Calculate fair value of a gold transaction
 */
export function calcFairValue(weightGrams, purityPercent, marketPricePerGram) {
  return weightGrams * (purityPercent / 100) * marketPricePerGram
}

/**
 * Get color class for Fair Deal Score
 */
export function getFairDealColor(score) {
  if (score >= 90) return "text-green-400"
  if (score >= 70) return "text-amber-400"
  if (score >= 50) return "text-orange-400"
  return "text-red-400"
}

/**
 * Get label for Fair Deal Score
 */
export function getFairDealLabel(score) {
  if (score >= 90) return "Excellent Deal"
  if (score >= 70) return "Fair Deal"
  if (score >= 50) return "Below Market"
  return "Exploitative"
}

/**
 * Get background color class for Fair Deal Score badge
 */
export function getFairDealBg(score) {
  if (score >= 90) return "bg-green-500/10 text-green-400 border-green-500/20"
  if (score >= 70) return "bg-amber-500/10 text-amber-400 border-amber-500/20"
  if (score >= 50) return "bg-orange-500/10 text-orange-400 border-orange-500/20"
  return "bg-red-500/10 text-red-400 border-red-500/20"
}

/**
 * Get records from this month
 */
export function getThisMonthRecords(records, dateField = "date") {
  const now = new Date()
  const start = startOfMonth(now)
  const end = endOfMonth(now)

  return records.filter((r) => {
    try {
      const d = typeof r[dateField] === "string" ? parseISO(r[dateField]) : new Date(r[dateField])
      return isWithinInterval(d, { start, end })
    } catch {
      return false
    }
  })
}

/**
 * Format a date string nicely
 */
export function formatDate(dateStr) {
  try {
    const d = typeof dateStr === "string" ? parseISO(dateStr) : new Date(dateStr)
    return format(d, "MMM d, yyyy")
  } catch {
    return dateStr
  }
}

/**
 * Format relative date label
 */
export function formatRelativeDate(dateStr) {
  try {
    const d = typeof dateStr === "string" ? parseISO(dateStr) : new Date(dateStr)
    const now = new Date()
    const diffMs = now - d
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return `${diffDays} days ago`
    return format(d, "MMM d")
  } catch {
    return dateStr
  }
}

/**
 * Get material badge classes
 */
export function getMaterialClasses(material) {
  const map = {
    Gold: "bg-gold-500/10 text-gold-400 border-gold-500/20",
    Diamond: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    Bauxite: "bg-earth-400/10 text-earth-400 border-earth-400/20",
    Manganese: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    Other: "bg-zinc-500/10 text-zinc-400 border-zinc-600/20",
  }
  return map[material] || map.Other
}

/**
 * Get severity border class
 */
export function getSeverityBorder(severity) {
  const map = {
    Critical: "border-l-red-500",
    High: "border-l-orange-500",
    Medium: "border-l-amber-500",
    Low: "border-l-zinc-500",
  }
  return map[severity] || "border-l-zinc-500"
}

/**
 * Truncate text
 */
export function truncate(str, maxLen = 40) {
  if (!str) return ""
  return str.length > maxLen ? str.slice(0, maxLen) + "…" : str
}

/**
 * Get percent change string with sign
 */
export function formatPercentChange(change) {
  const sign = change >= 0 ? "+" : ""
  return `${sign}${change.toFixed(2)}%`
}

/**
 * Generate demo chart data for 30 days
 */
export function generatePriceHistory(basePrice, days = 30) {
  const data = []
  let price = basePrice
  const now = new Date()
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    price = price * (1 + (Math.random() - 0.48) * 0.012)
    data.push({
      date: format(date, "MMM d"),
      price: Math.round(price * 100) / 100,
    })
  }
  return data
}
