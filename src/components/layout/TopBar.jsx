import { Bell } from "lucide-react"
import { SikaBrand } from "@/components/SikaLogo"
import { Button } from "@/components/ui/button"
import { useLocation } from "react-router-dom"

const PAGE_TITLES = {
  "/":             "Dashboard",
  "/production":   "Production Log",
  "/market":       "Market Price",
  "/transactions": "Transactions",
  "/buyers":       "Buyer Directory",
  "/earnings":     "Earnings",
  "/safety":       "Safety Log",
  "/formalise":    "Get Licensed",
  "/settings":     "Settings",
}

export function TopBar({ notificationCount = 0 }) {
  const location = useLocation()
  const title = PAGE_TITLES[location.pathname] || "SikaTrack"

  return (
    <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 h-14 bg-surface-950/95 backdrop-blur-md border-b border-zinc-800">
      <SikaBrand />
      <div className="flex items-center gap-1">
        <span className="text-xs font-medium text-zinc-500 mr-2">{title}</span>
        <Button variant="ghost" size="icon" className="relative h-8 w-8">
          <Bell className="h-4 w-4" />
          {notificationCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-gold-500 text-[9px] font-bold text-surface-950 flex items-center justify-center">
              {notificationCount}
            </span>
          )}
        </Button>
      </div>
    </header>
  )
}
