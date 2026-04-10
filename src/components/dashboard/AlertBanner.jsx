import { useState } from "react"
import { Bell, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AlertBanner({ message, onDismiss }) {
  const [visible, setVisible] = useState(true)

  if (!visible || !message) return null

  const handleDismiss = () => {
    setVisible(false)
    onDismiss?.()
  }

  return (
    <div className="fixed top-0 inset-x-0 z-50 animate-fade-in-up lg:left-60">
      <div className="bg-amber-500/95 backdrop-blur-sm text-surface-950 px-4 py-2.5 flex items-center gap-3">
        <Bell className="h-4 w-4 shrink-0 animate-bounce" />
        <p className="text-sm font-medium flex-1">{message}</p>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-surface-950 hover:bg-amber-600/30"
          onClick={handleDismiss}
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  )
}
