"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Clock } from "lucide-react"
import { format, addHours, addDays } from "date-fns"
import { cn } from "@/lib/utils"

interface PauseLocationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onPause: (resumeAt: Date) => void
}

export function PauseLocationDialog({ open, onOpenChange, onPause }: PauseLocationDialogProps) {
  const [pauseDuration, setPauseDuration] = useState<string>("1h")
  const [customDate, setCustomDate] = useState<Date>()

  const handlePause = () => {
    let resumeAt: Date

    switch (pauseDuration) {
      case "1h":
        resumeAt = addHours(new Date(), 1)
        break
      case "6h":
        resumeAt = addHours(new Date(), 6)
        break
      case "12h":
        resumeAt = addHours(new Date(), 12)
        break
      case "1d":
        resumeAt = addDays(new Date(), 1)
        break
      case "3d":
        resumeAt = addDays(new Date(), 3)
        break
      case "custom":
        if (!customDate) return
        resumeAt = customDate
        break
      default:
        return
    }

    onPause(resumeAt)
    onOpenChange(false)
  }

  const getDurationLabel = (duration: string) => {
    switch (duration) {
      case "1h":
        return "1 hour"
      case "6h":
        return "6 hours"
      case "12h":
        return "12 hours"
      case "1d":
        return "1 day"
      case "3d":
        return "3 days"
      case "custom":
        return "Custom date"
      default:
        return ""
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Pause Location Sharing</DialogTitle>
          <DialogDescription>
            Temporarily stop sharing your location. It will automatically resume at the selected time.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <RadioGroup value={pauseDuration} onValueChange={setPauseDuration}>
            <div className="space-y-3">
              {["1h", "6h", "12h", "1d", "3d", "custom"].map((duration) => (
                <div key={duration} className="flex items-center space-x-2">
                  <RadioGroupItem value={duration} id={duration} />
                  <Label htmlFor={duration} className="flex items-center gap-2 cursor-pointer">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    {getDurationLabel(duration)}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>

          {pauseDuration === "custom" && (
            <div className="space-y-2">
              <Label>Select Resume Date & Time</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !customDate && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {customDate ? format(customDate, "PPP p") : "Pick a date and time"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={customDate}
                    onSelect={setCustomDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <p className="text-xs text-muted-foreground">Location sharing will resume automatically at this time</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handlePause} disabled={pauseDuration === "custom" && !customDate}>
            Pause Sharing
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
