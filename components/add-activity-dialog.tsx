"use client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plane, Hotel, UtensilsCrossed, Eye, Calendar, FileText, Compass, Car, Train, Bus, Ship } from "lucide-react"

interface AddActivityDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateTrip?: () => void
  onCreateNote?: () => void
  onCreateActivity?: (type: string) => void
}

export function AddActivityDialog({
  open,
  onOpenChange,
  onCreateTrip,
  onCreateNote,
  onCreateActivity,
}: AddActivityDialogProps) {
  const activityTypes = [
    { icon: Calendar, label: "New Trip", description: "Create a new trip", action: "trip" },
    { icon: Plane, label: "Flight", description: "Add flight details", action: "flight" },
    { icon: Hotel, label: "Accommodation", description: "Hotels, Airbnb", action: "accommodation" },
    { icon: UtensilsCrossed, label: "Dining", description: "Restaurant reservation", action: "dining" },
    { icon: Eye, label: "Sightseeing", description: "Museums, landmarks", action: "sightseeing" },
    { icon: Compass, label: "Experience", description: "Tours, activities", action: "activity" },
    { icon: Train, label: "Train", description: "Train journey", action: "train" },
    { icon: Bus, label: "Bus", description: "Bus ride", action: "bus" },
    { icon: Car, label: "Car Rental", description: "Rental car booking", action: "car-rental" },
    { icon: Ship, label: "Ferry", description: "Ferry crossing", action: "ferry" },
    { icon: FileText, label: "Note", description: "Quick note with photos", action: "note" },
  ]

  const availableActivityTypes = activityTypes.filter((type) => {
    if (type.action === "trip" && !onCreateTrip) {
      return false
    }
    return true
  })

  const handleSelect = (action: string) => {
    if (action === "trip" && onCreateTrip) {
      onOpenChange(false)
      onCreateTrip()
    } else if (action === "note" && onCreateNote) {
      onOpenChange(false)
      onCreateNote()
    } else if (onCreateActivity) {
      onOpenChange(false)
      onCreateActivity(action)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add to Your Trip</DialogTitle>
          <DialogDescription>Choose what you'd like to add</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 py-4 max-h-[60vh] overflow-y-auto">
          {availableActivityTypes.map((type) => {
            const Icon = type.icon
            const isNewTrip = type.action === "trip"

            return (
              <Button
                key={type.action}
                variant="outline"
                className={`h-auto flex-col items-start p-4 gap-2 ${
                  isNewTrip
                    ? "bg-gradient-to-br from-accent/20 to-primary/10 border-accent/50 hover:from-accent/30 hover:to-primary/20 hover:border-accent shadow-sm"
                    : "bg-transparent"
                }`}
                onClick={() => handleSelect(type.action)}
              >
                <Icon className={`h-5 w-5 ${isNewTrip ? "text-accent" : "text-accent"}`} />
                <div className="text-left">
                  <p className={`font-medium text-sm ${isNewTrip ? "text-accent-foreground" : ""}`}>{type.label}</p>
                  <p className="text-xs text-muted-foreground font-normal">{type.description}</p>
                </div>
              </Button>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}
