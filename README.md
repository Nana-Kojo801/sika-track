# SikaTrack

**Know your worth. Own your mine.**

A mobile-first platform for artisanal and small-scale miners (ASM) in Ghana. "Sika" means gold/money in Twi.

## Features

- **Live Gold Prices** — Real-time GHS/gram pricing via goldapi.io
- **Production Log** — Track daily mining output per pit
- **Transaction Tracker** — Log sales with automatic Fair Deal Score analysis
- **Fair Deal Score System** — Detect if buyers are offering fair prices (0–100 score)
- **Ore Value Calculator** — Know your minimum acceptable price before negotiating
- **Buyer Directory** — Rate and track buyers by their Fair Deal Scores
- **Safety Log** — Report and track mine incidents with AI safety advice
- **Earnings Dashboard** — Revenue charts, trend analysis, AI financial insights
- **Formalisation Guide** — Step-by-step guide to getting licensed in Ghana
- **AI Tips** — Powered by OpenRouter (Mistral 7B) for production and safety advice

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Convex (real-time database)

```bash
npx convex dev
```

Follow the prompts to create a new Convex project. Copy the deployment URL.

### 3. Configure environment variables

Edit `.env.local`:

```env
VITE_CONVEX_URL=https://your-deployment.convex.cloud   # from step 2
VITE_OPENROUTER_API_KEY=sk-or-...                      # from openrouter.ai
VITE_GOLD_API_KEY=your-key                             # from goldapi.io (free tier)
```

**API Keys:**
- **Convex** — Free at [convex.dev](https://convex.dev)
- **OpenRouter** — Free models at [openrouter.ai](https://openrouter.ai) (Mistral 7B is free)
- **Gold API** — Free tier at [goldapi.io](https://goldapi.io) (limited requests/day)

> Note: The app works without API keys using demo/fallback data. AI tips and live prices require the keys.

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Tech Stack

- **React 18** + **Vite** — Frontend
- **Convex** — Real-time database + serverless functions
- **TailwindCSS v4** — Styling (new CSS-first approach, no config file)
- **shadcn/ui** — Component library (manually integrated)
- **React Router v6** — Client-side routing
- **Recharts** — Charts and graphs
- **OpenRouter API** — AI features (Mistral 7B free model)
- **goldapi.io** — Live gold price data
- **date-fns** — Date formatting
- **Lucide React** — Icons

## Design System

Dark-mode first with a Ghanaian gold aesthetic:
- Background: `#050506` (near-black)
- Gold accent: `#f59e0b`
- Earth tones: `#c2895a`
- Kente-inspired sidebar stripe
- Bloomberg terminal meets West African gold culture

## Project Structure

```
src/
  pages/          — 9 full pages
  components/
    layout/       — Sidebar, BottomNav, TopBar, PageWrapper
    dashboard/    — StatCard, FairDealBadge, PriceWidget, etc.
    production/   — ProductionForm, ProductionCard, ProductionTable
    transactions/ — TransactionForm, TransactionCard, FairDealScore
    market/       — PriceChart, OreCalculator, PriceAlert
    shared/       — LoadingSpinner, EmptyState, ConfirmDialog
    ui/           — shadcn components
  lib/
    goldApi.js    — GoldAPI integration with demo fallback
    openRouter.js — AI features via OpenRouter
    helpers.js    — Formatting + calculation utilities
    constants.js  — Ghana-specific data, formalisation steps

convex/           — Backend schema + query/mutation functions
```
