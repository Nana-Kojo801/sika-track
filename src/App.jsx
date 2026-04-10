import { useState, useEffect } from "react"
import { Routes, Route } from "react-router-dom"
import { Sidebar } from "@/components/layout/Sidebar"
import { BottomNav } from "@/components/layout/BottomNav"
import { TopBar } from "@/components/layout/TopBar"
import { Toaster } from "@/components/ui/toaster"
import { LoadingScreen } from "./LoadingScreen"
import Dashboard from "@/pages/Dashboard"
import ProductionLog from "@/pages/ProductionLog"
import Transactions from "@/pages/Transactions"
import MarketPrice from "@/pages/MarketPrice"
import SafetyLog from "@/pages/SafetyLog"
import Earnings from "@/pages/Earnings"
import BuyerDirectory from "@/pages/BuyerDirectory"
import Formalisation from "@/pages/Formalisation"
import Settings from "@/pages/Settings"

export default function App() {
  const [appReady, setAppReady] = useState(false)
  const [showLoader, setShowLoader] = useState(true)

  const handleLoadingComplete = () => {
    setShowLoader(false)
    setAppReady(true)
  }

  return (
    <>
      {showLoader && <LoadingScreen onComplete={handleLoadingComplete} />}

      {appReady && (
        <div className="min-h-screen bg-surface-950">
          {/* Desktop sidebar */}
          <Sidebar />

          {/* Mobile top bar */}
          <TopBar />

          {/* Page routes */}
          <Routes>
            <Route path="/"            element={<Dashboard />} />
            <Route path="/production"  element={<ProductionLog />} />
            <Route path="/transactions"element={<Transactions />} />
            <Route path="/market"      element={<MarketPrice />} />
            <Route path="/safety"      element={<SafetyLog />} />
            <Route path="/earnings"    element={<Earnings />} />
            <Route path="/buyers"      element={<BuyerDirectory />} />
            <Route path="/formalise"   element={<Formalisation />} />
            <Route path="/settings"    element={<Settings />} />
          </Routes>

          {/* Mobile bottom nav */}
          <BottomNav />

          {/* Toast notifications */}
          <Toaster />
        </div>
      )}
    </>
  )
}
