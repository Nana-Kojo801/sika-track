const OPENROUTER_BASE = "https://openrouter.ai/api/v1"
const DEFAULT_MODEL = "mistralai/mistral-7b-instruct:free"

/**
 * Call OpenRouter API with a prompt
 */
async function callOpenRouter(prompt, model = DEFAULT_MODEL) {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY

  if (!apiKey || apiKey === "REPLACE_WITH_KEY") {
    throw new Error("OpenRouter API key not configured")
  }

  const res = await fetch(`${OPENROUTER_BASE}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": window.location.origin,
      "X-Title": "SikaTrack",
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200,
      temperature: 0.7,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`OpenRouter error ${res.status}: ${err}`)
  }

  const data = await res.json()
  return data.choices?.[0]?.message?.content?.trim() || ""
}

/**
 * Get AI tip after logging production
 */
export async function getProductionTip({ weightGrams, grade, material, pitName, workers, hours }) {
  const prompt = `A miner in Ghana just logged ${weightGrams}g of ${grade} grade ${material} from pit '${pitName}' using ${workers} workers over ${hours} hours. Give one short, practical tip (2 sentences max) to improve their output or safety for their next session.`

  try {
    return await callOpenRouter(prompt)
  } catch (err) {
    console.warn("Production tip failed:", err.message)
    return getFallbackProductionTip(grade, material)
  }
}

/**
 * Get AI safety advice after reporting an incident
 */
export async function getSafetyAdvice({ severity, incidentType, description }) {
  const prompt = `A ${severity} severity ${incidentType} incident occurred at a small-scale gold mine in Ghana. Description: '${description}'. Provide 2-3 immediate safety recommendations in plain simple English.`

  try {
    return await callOpenRouter(prompt)
  } catch (err) {
    console.warn("Safety advice failed:", err.message)
    return getFallbackSafetyAdvice(incidentType)
  }
}

/**
 * Get AI earnings insight
 */
export async function getEarningsInsight({ totalEarned, transactionCount, avgScore, totalGrams }) {
  const prompt = `A small-scale miner in Ghana earned GHS ${totalEarned.toFixed(0)} this month from ${transactionCount} sales with an average Fair Deal Score of ${avgScore}/100. Their production was ${totalGrams.toFixed(1)}g. Give one specific financial insight and one actionable recommendation in 3 sentences max.`

  try {
    return await callOpenRouter(prompt)
  } catch (err) {
    console.warn("Earnings insight failed:", err.message)
    return getFallbackEarningsInsight(avgScore)
  }
}

/**
 * Get AI formalisation tip
 */
export async function getFormalisationTip() {
  const prompt = `What is one important thing a small-scale artisanal miner in Ghana should know about the mining formalisation process right now in 2024-2025? Answer in 2-3 sentences, practical and specific.`

  try {
    return await callOpenRouter(prompt)
  } catch (err) {
    console.warn("Formalisation tip failed:", err.message)
    return "The Minerals Commission has streamlined the small-scale mining licence application process. Ensure all documents are certified copies and your EIA is conducted by an EPA-registered consultant to avoid delays."
  }
}

// ─── Fallback content (when API is unavailable) ─────────────

function getFallbackProductionTip(grade, material) {
  const tips = {
    High: `Your ${material} output is strong — maintain equipment regularly to sustain this grade. Ensure workers take hydration breaks every 2 hours to maintain peak performance.`,
    Medium: `Consider sluicing or panning techniques to improve ${material} recovery from medium-grade ore. Track daily output to identify which digging zones perform best.`,
    Low: `Low-grade ${material} ore can still be profitable with good processing methods. Talk to neighboring miners about efficient sluice box configurations for your area.`,
  }
  return tips[grade] || tips.Medium
}

function getFallbackSafetyAdvice(incidentType) {
  const advice = {
    Fall: "1. Secure all elevated work areas with proper barriers or ropes. 2. Check that footing is stable before moving heavy equipment. 3. Report any unstable ground to your pit supervisor immediately.",
    Equipment: "1. Take damaged equipment out of service until repaired. 2. Inspect all machinery at the start of each shift. 3. Only trained workers should operate heavy equipment.",
    Exposure: "1. Move affected workers to fresh air immediately. 2. Use proper PPE (masks, gloves) when handling chemicals. 3. Ensure the site is well-ventilated before resuming work.",
    "Near-miss": "1. Document exactly what happened and share with all workers. 2. Review the safe work procedure for that task. 3. Brief the team before the next shift begins.",
    Chemical: "1. Remove all workers from the affected area immediately. 2. Rinse affected skin with clean water for 15 minutes. 3. Contact Ghana's NADMO if spillage is large.",
  }
  return advice[incidentType] || "1. Secure the area immediately. 2. Ensure all workers are accounted for and safe. 3. Document the incident and review procedures with your team."
}

function getFallbackEarningsInsight(avgScore) {
  if (avgScore >= 85) {
    return "Your Fair Deal Scores are excellent, showing you're negotiating well with buyers. Continue recording all transactions to build a strong history that attracts more buyers. Consider expanding to 2-3 trusted buyers to create healthy competition for your ore."
  }
  if (avgScore >= 70) {
    return "Your deals are fair, but there's room to improve. Before agreeing to a price, always check the SikaTrack market price and show buyers you know the current rate. Miners who use price data in negotiations typically earn 10–15% more."
  }
  return "Your Fair Deal Scores suggest buyers may be underpaying for your ore. Use the Ore Value Calculator to know your minimum acceptable price before any negotiation. Consider contacting the Precious Minerals Marketing Company (PMMC) for official price guidance."
}
