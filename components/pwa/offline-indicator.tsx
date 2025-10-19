"use client"

import { usePWA } from "@/hooks/use-pwa"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { WifiOff, X } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

export function OfflineIndicator() {
  const { isOffline } = usePWA()
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    if (!isOffline) {
      setIsDismissed(false)
    }
  }, [isOffline])

  if (!isOffline || isDismissed) return null

  return (
    <div className="fixed top-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96">
      <Alert className="border-orange-500 bg-orange-50 dark:bg-orange-950">
        <WifiOff className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-orange-800 dark:text-orange-200 pr-8">
          You're offline. Changes will sync when connection returns.
        </AlertDescription>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-6 w-6 text-orange-600 hover:text-orange-800 hover:bg-orange-100 dark:hover:bg-orange-900"
          onClick={() => setIsDismissed(true)}
        >
          <X className="h-4 w-4" />
        </Button>
      </Alert>
    </div>
  )
}
