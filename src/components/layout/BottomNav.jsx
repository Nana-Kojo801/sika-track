import { useState } from "react"
import { NavLink, useLocation } from "react-router-dom"
import {
  LayoutDashboard, Pickaxe, TrendingUp, ArrowLeftRight, MoreHorizontal,
  Users, DollarSign, ShieldAlert, FileCheck, Settings, X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"

const PRIMARY_NAV = [
  { to: "/",             icon: LayoutDashboard, label: "Dashboard" },
  { to: "/production",   icon: Pickaxe,         label: "Production" },
  { to: "/market",       icon: TrendingUp,      label: "Market" },
  { to: "/transactions", icon: ArrowLeftRight,  label: "Sales" },
]

const MORE_NAV = [
  { to: "/buyers",    icon: Users,       label: "Buyers" },
  { to: "/earnings",  icon: DollarSign,  label: "Earnings" },
  { to: "/safety",    icon: ShieldAlert, label: "Safety" },
  { to: "/formalise", icon: FileCheck,   label: "Get Licensed" },
  { to: "/settings",  icon: Settings,    label: "Settings" },
]

export function BottomNav() {
  const [moreOpen, setMoreOpen] = useState(false)
  const location = useLocation()
  const isMoreActive = MORE_NAV.some((n) => location.pathname.startsWith(n.to))

  return (
    <>
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-surface-950/95 backdrop-blur-md border-t border-zinc-800 pb-safe">
        <div className="flex items-center justify-around px-2 h-16">
          {PRIMARY_NAV.map(({ to, icon: Icon, label }) => {
            const isActive = to === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(to)

            return (
              <NavLink
                key={to}
                to={to}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all min-w-0",
                  isActive ? "text-gold-400" : "text-zinc-500"
                )}
              >
                <Icon className={cn("h-5 w-5", isActive && "drop-shadow-[0_0_6px_rgba(245,158,11,0.6)]")} />
                <span className="text-[10px] font-medium truncate">{label}</span>
              </NavLink>
            )
          })}

          {/* More button */}
          <button
            onClick={() => setMoreOpen(true)}
            className={cn(
              "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all",
              isMoreActive ? "text-gold-400" : "text-zinc-500"
            )}
          >
            <MoreHorizontal className="h-5 w-5" />
            <span className="text-[10px] font-medium">More</span>
          </button>
        </div>
      </nav>

      {/* More Sheet */}
      <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
        <SheetContent side="bottom" className="px-0 pt-0">
          <div className="flex justify-center pt-3 pb-1">
            <div className="h-1 w-10 rounded-full bg-zinc-700" />
          </div>
          <SheetHeader className="px-6 py-3">
            <SheetTitle className="text-base">More</SheetTitle>
          </SheetHeader>
          <nav className="px-4 pb-6 grid grid-cols-2 gap-2">
            {MORE_NAV.map(({ to, icon: Icon, label }) => {
              const isActive = location.pathname.startsWith(to)
              return (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setMoreOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl border transition-all",
                    isActive
                      ? "bg-gold-500/10 border-gold-500/20 text-gold-400"
                      : "border-zinc-800 text-zinc-400 hover:bg-zinc-800"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-sm font-medium">{label}</span>
                </NavLink>
              )
            })}
          </nav>
        </SheetContent>
      </Sheet>
    </>
  )
}
