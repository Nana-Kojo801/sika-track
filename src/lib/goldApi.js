import { GHS_USD_RATE, TROY_OZ_TO_GRAMS } from "./constants"

const BASE_URL = "https://www.goldapi.io/api"

/**
 * Fetch current gold price from goldapi.io
 * Returns { priceUSD, priceGHS, pricePerGramUSD, pricePerGramGHS, changePercent, currency }
 */
export async function fetchGoldPrice() {
  const apiKey = import.meta.env.VITE_GOLD_API_KEY

  if (!apiKey || apiKey === "REPLACE_WITH_GOLDAPI_KEY") {
    // Return demo data when no API key is configured
    return getDemoGoldPrice()
  }

  try {
    const res = await fetch(`${BASE_URL}/XAU/USD`, {
      headers: {
        "x-access-token": apiKey,
        "Content-Type": "application/json",
      },
    })

    if (!res.ok) {
      throw new Error(`GoldAPI error: ${res.status}`)
    }

    const data = await res.json()

    const priceUSD = data.price // USD per troy oz
    const pricePerGramUSD = priceUSD / TROY_OZ_TO_GRAMS
    const pricePerGramGHS = pricePerGramUSD * GHS_USD_RATE
    const priceGHS = priceUSD * GHS_USD_RATE
    const changePercent = data.ch_percent || 0

    return {
      priceUSD,
      priceGHS,
      pricePerGramUSD,
      pricePerGramGHS,
      changePercent,
      currency: "USD",
      source: "goldapi.io",
      timestamp: new Date().toISOString(),
    }
  } catch (err) {
    console.warn("GoldAPI fetch failed, using demo data:", err.message)
    return getDemoGoldPrice()
  }
}

/**
 * Returns simulated gold price data for demo / when API key not set
 */
function getDemoGoldPrice() {
  // Simulate realistic gold price ~$2,300 USD/oz as of early 2025
  const baseUSD = 2300 + (Math.random() - 0.5) * 50
  const pricePerGramUSD = baseUSD / TROY_OZ_TO_GRAMS
  const pricePerGramGHS = pricePerGramUSD * GHS_USD_RATE
  const changePercent = (Math.random() - 0.48) * 3

  return {
    priceUSD: baseUSD,
    priceGHS: baseUSD * GHS_USD_RATE,
    pricePerGramUSD,
    pricePerGramGHS,
    changePercent,
    currency: "USD",
    source: "demo",
    timestamp: new Date().toISOString(),
  }
}

/**
 * Fetch price for a specific metal
 * symbol: "XAU" (Gold), "XAG" (Silver), "XPT" (Platinum)
 */
export async function fetchMetalPrice(symbol = "XAU") {
  const apiKey = import.meta.env.VITE_GOLD_API_KEY

  if (!apiKey || apiKey === "REPLACE_WITH_GOLDAPI_KEY") {
    return getDemoMetalPrice(symbol)
  }

  try {
    const res = await fetch(`${BASE_URL}/${symbol}/USD`, {
      headers: {
        "x-access-token": apiKey,
        "Content-Type": "application/json",
      },
    })

    if (!res.ok) throw new Error(`GoldAPI error: ${res.status}`)
    const data = await res.json()

    return {
      symbol,
      priceUSD: data.price,
      priceGHS: data.price * GHS_USD_RATE,
      pricePerGramGHS: (data.price / TROY_OZ_TO_GRAMS) * GHS_USD_RATE,
      changePercent: data.ch_percent || 0,
      source: "goldapi.io",
    }
  } catch (err) {
    console.warn(`Metal price fetch failed for ${symbol}:`, err.message)
    return getDemoMetalPrice(symbol)
  }
}

function getDemoMetalPrice(symbol) {
  const prices = {
    XAU: 2300, // Gold $/oz
    XAG: 27,   // Silver $/oz
    XPT: 950,  // Platinum $/oz
  }
  const base = prices[symbol] || 2300
  const price = base + (Math.random() - 0.5) * (base * 0.02)

  return {
    symbol,
    priceUSD: price,
    priceGHS: price * GHS_USD_RATE,
    pricePerGramGHS: (price / TROY_OZ_TO_GRAMS) * GHS_USD_RATE,
    changePercent: (Math.random() - 0.48) * 3,
    source: "demo",
  }
}

// Demo material prices in GHS per gram
export const DEMO_MATERIAL_PRICES = {
  Gold: { ghsPerGram: 4821, changePercent: 2.3 },
  Diamond: { ghsPerGram: 25000, changePercent: -0.8 },
  Bauxite: { ghsPerGram: 2.5, changePercent: 0.5 },
  Manganese: { ghsPerGram: 3.2, changePercent: 1.1 },
}
