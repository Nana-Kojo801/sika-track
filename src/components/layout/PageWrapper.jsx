import { cn } from "@/lib/utils"

export function PageWrapper({ children, className = "" }) {
  return (
    <main className={cn("lg:pl-60 min-h-screen flex flex-col", className)}>
      <div className="flex-1 page-enter px-4 py-5 md:px-6 md:py-6 pb-24 lg:pb-6">
        {children}
      </div>
    </main>
  )
}

export function PageHeader({ title, subtitle, actions = null }) {
  return (
    <div className="flex items-start justify-between mb-6 gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-50">{title}</h1>
        {subtitle && <p className="text-sm text-zinc-400 mt-0.5">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  )
}
