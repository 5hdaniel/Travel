"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Navigation, NavigationOff } from "lucide-react"
import { cn } from "@/lib/utils"

interface LocationSharingButtonProps {
  mode: "live" | "manual" | "disabled"
  className?: string
}

export function LocationSharingButton({ mode, className }: LocationSharingButtonProps) {
  const { toast } = useToast()
  const [isUpdating, setIsUpdating] = useState(false)

  const handleUpdateLocation = async () => {
    if (mode === "disabled") return

    setIsUpdating(true)

    // Simulate location update
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Location updated",
      description: "Your current location has been shared with trip viewers.",
    })

    setIsUpdating(false)
  }

  if (mode === "disabled") {
    return (
      <Button variant="ghost" size="sm" disabled className={cn("gap-2", className)}>
        <NavigationOff className="h-4 w-4 text-muted-foreground" />
        <span className="hidden sm:inline text-muted-foreground">Location Off</span>
      </Button>
    )
  }

  if (mode === "live") {
    return (
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "gap-2 relative",
          "hover:bg-green-50 dark:hover:bg-green-950/20",
          "active:bg-green-100 dark:active:bg-green-950/30",
          className,
        )}
      >
        <div className="relative">
          <Navigation className="h-4 w-4 text-green-500" />
          {/* Pulsating indicator */}
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
        </div>
        <span className="hidden sm:inline text-green-600 dark:text-green-400">Live Location</span>
      </Button>
    )
  }

  // Manual mode
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleUpdateLocation}
      disabled={isUpdating}
      className={cn("gap-2", className)}
    >
      <Navigation className="h-4 w-4 text-accent" />
      <span className="hidden sm:inline">{isUpdating ? "Updating..." : "Update Location"}</span>
    </Button>
  )
}
