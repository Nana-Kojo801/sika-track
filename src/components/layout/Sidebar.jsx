import { NavLink, useLocation } from "react-router-dom"
import {
  LayoutDashboard, Pickaxe, TrendingUp, ArrowLeftRight,
  ShieldAlert, DollarSign, Users, FileCheck, Settings, ChevronRight,
} from "lucide-react"
import { SikaBrand } from "@/components/SikaLogo"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { to: "/",            icon: LayoutDashboard, label: "Dashboard" },
  { to: "/production",  icon: Pickaxe,         label: "Production Log" },
  { to: "/market",      icon: TrendingUp,      label: "Market Price" },
  { to: "/transactions",icon: ArrowLeftRight,  label: "Transactions" },
  { to: "/buyers",      icon: Users,           label: "Buyer Directory" },
  { to: "/earnings",    icon: DollarSign,      label: "Earnings" },
  { to: "/safety",      icon: ShieldAlert,     label: "Safety Log" },
  { to: "/formalise",   icon: FileCheck,       label: "Formalisation" },
  { to: "/settings",    icon: Settings,        label: "Settings" },
]

export function Sidebar() {
  const location = useLocation()

  return (
    <aside className="hidden lg:flex fixed inset-y-0 left-0 w-60 flex-col bg-surface-950 border-r border-zinc-800/50 z-40">
      {/* Kente decorative stripe */}
      <div className="kente-stripe absolute right-0 inset-y-0 opacity-60" />

      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-zinc-800/50">
        <SikaBrand />
      </div>

      {/* Tagline */}
      <p className="px-5 py-2 text-[10px] uppercase tracking-widest text-zinc-600 font-medium">
        Know your worth. Own your mine.
      </p>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
          const isActive = to === "/"
            ? location.pathname === "/"
            : location.pathname.startsWith(to)

          return (
            <NavLink
              key={to}
              to={to}
              className={cn(
                "group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 relative",
                isActive
                  ? "bg-gold-500/10 text-gold-400 border-l-2 border-gold-500 pl-[10px]"
                  : "text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200"
              )}
            >
              <Icon className={cn(
                "h-4 w-4 shrink-0 transition-colors",
                isActive ? "text-gold-400" : "text-zinc-500 group-hover:text-zinc-300"
              )} />
              <span className="font-medium">{label}</span>
              {isActive && (
                <ChevronRight className="h-3 w-3 ml-auto text-gold-500/60" />
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-zinc-800/50">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-gold-500/20 flex items-center justify-center">
            <Pickaxe className="h-3.5 w-3.5 text-gold-400" />
          </div>
          <div>
            <p className="text-xs font-medium text-zinc-300">SikaTrack</p>
            <p className="text-[10px] text-zinc-600">v1.0.0 • ASM Platform</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
