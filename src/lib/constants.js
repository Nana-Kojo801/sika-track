export const MATERIALS = [
  { value: "Gold", label: "Gold", color: "text-gold-400", bg: "bg-gold-500/10" },
  { value: "Diamond", label: "Diamond", color: "text-blue-400", bg: "bg-blue-500/10" },
  { value: "Bauxite", label: "Bauxite", color: "text-earth-400", bg: "bg-earth-400/10" },
  { value: "Manganese", label: "Manganese", color: "text-purple-400", bg: "bg-purple-500/10" },
  { value: "Other", label: "Other", color: "text-zinc-400", bg: "bg-zinc-500/10" },
]

export const GRADES = [
  { value: "High", label: "High", description: "Rich ore, high concentration", color: "text-green-400" },
  { value: "Medium", label: "Medium", description: "Standard yield, moderate concentration", color: "text-amber-400" },
  { value: "Low", label: "Low", description: "Lower yield, sparse concentration", color: "text-red-400" },
]

export const PAYMENT_METHODS = [
  { value: "Cash", label: "Cash" },
  { value: "MTN MoMo", label: "MTN MoMo" },
  { value: "AirtelTigo", label: "AirtelTigo Money" },
  { value: "Cheque", label: "Cheque" },
]

export const INCIDENT_TYPES = [
  "Fall", "Equipment", "Exposure", "Near-miss", "Chemical", "Other"
]

export const SEVERITIES = [
  { value: "Low", label: "Low", color: "text-zinc-400", border: "border-zinc-600" },
  { value: "Medium", label: "Medium", color: "text-amber-400", border: "border-amber-600" },
  { value: "High", label: "High", color: "text-orange-400", border: "border-orange-600" },
  { value: "Critical", label: "Critical", color: "text-red-400", border: "border-red-600" },
]

export const GHANA_REGIONS = [
  "Greater Accra", "Ashanti", "Western", "Western North", "Eastern",
  "Central", "Northern", "Upper East", "Upper West", "Volta",
  "Oti", "Bono", "Bono East", "Ahafo", "North East", "Savannah"
]

export const GHS_USD_RATE = 15.5 // Approximate rate — update as needed
export const TROY_OZ_TO_GRAMS = 31.1035

export const FAIR_DEAL_THRESHOLDS = {
  excellent: 90,
  fair: 70,
  belowMarket: 50,
}

export const FORMALISATION_STEPS = [
  {
    id: 1,
    title: "Obtain site survey from Licensed Surveyor",
    description: "A licensed surveyor must demarcate your concession boundaries.",
    whatYouNeed: ["Survey request letter", "Land owner consent", "GPS coordinates of site"],
    estimatedCost: "GHS 800 – 2,000",
    timeline: "1 – 2 weeks",
    formUrl: null,
  },
  {
    id: 2,
    title: "Complete application form from Minerals Commission",
    description: "Obtain and fill the Small Scale Mining Licence application form.",
    whatYouNeed: ["National ID or passport", "2 passport photos", "Site survey report"],
    estimatedCost: "Free (form only)",
    timeline: "Same day",
    formUrl: "https://www.mincomgh.org",
  },
  {
    id: 3,
    title: "Pay application fee",
    description: "Pay the non-refundable application processing fee.",
    whatYouNeed: ["Completed application form", "Payment receipt"],
    estimatedCost: "GHS 500",
    timeline: "Same day",
    formUrl: null,
  },
  {
    id: 4,
    title: "Submit land use consent letter",
    description: "Obtain written consent from the landowner or stool authority.",
    whatYouNeed: ["Letter from chief/landowner", "Stamped by district assembly"],
    estimatedCost: "GHS 100 – 500",
    timeline: "1 – 3 weeks",
    formUrl: null,
  },
  {
    id: 5,
    title: "Provide Environmental Impact Assessment (EIA)",
    description: "An EIA report assessing the environmental impact of your operations.",
    whatYouNeed: ["Hire EPA-registered consultant", "Site inspection", "EIA report"],
    estimatedCost: "GHS 2,000 – 5,000",
    timeline: "4 – 8 weeks",
    formUrl: "https://www.epa.gov.gh",
  },
  {
    id: 6,
    title: "Submit to EPA for environmental permit",
    description: "Submit your EIA to the Environmental Protection Agency for review.",
    whatYouNeed: ["EIA report", "Application fee payment"],
    estimatedCost: "GHS 300 – 1,000",
    timeline: "4 – 6 weeks",
    formUrl: "https://www.epa.gov.gh",
  },
  {
    id: 7,
    title: "Await Minerals Commission approval",
    description: "The Minerals Commission reviews your application and conducts site inspection.",
    whatYouNeed: ["All previous documents submitted", "Be available for site inspection"],
    estimatedCost: "Included in application fee",
    timeline: "8 – 12 weeks",
    formUrl: null,
  },
  {
    id: 8,
    title: "Receive Small Scale Mining Licence",
    description: "Collect your official licence from the Minerals Commission office.",
    whatYouNeed: ["Approval notification letter", "Valid ID"],
    estimatedCost: "GHS 1,000 – 2,000 (licence fee)",
    timeline: "Same day as collection",
    formUrl: null,
  },
  {
    id: 9,
    title: "Register with Ghana Revenue Authority",
    description: "Register your mining operation with GRA for tax compliance.",
    whatYouNeed: ["Mining licence", "TIN (Tax Identification Number)", "Business registration"],
    estimatedCost: "Free",
    timeline: "1 – 2 days",
    formUrl: "https://www.gra.gov.gh",
  },
]
