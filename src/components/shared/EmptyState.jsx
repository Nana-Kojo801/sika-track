import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function EmptyState({
  icon = "⛏️",
  title = "Nothing here yet",
  description = "Get started by adding your first entry.",
  action = null,
  className = "",
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 px-4 text-center", className)}>
      <div className="text-5xl mb-4 animate-bounce">{icon}</div>
      <h3 className="text-lg font-semibold text-zinc-200 mb-2">{title}</h3>
      <p className="text-sm text-zinc-500 max-w-xs mb-6">{description}</p>
      {action && (
        <Button onClick={action.onClick} variant="gold">
          {action.label}
        </Button>
      )}
    </div>
  )
}
