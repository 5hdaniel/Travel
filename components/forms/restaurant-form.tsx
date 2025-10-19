"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { RestaurantMetadata } from "@/lib/types"

interface RestaurantFormProps {
  onSubmit: (data: {
    title: string
    description?: string
    scheduledFor?: Date
    location?: string
    metadata: RestaurantMetadata
  }) => void
  onCancel: () => void
}

export function RestaurantForm({ onSubmit, onCancel }: RestaurantFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formDataObj = new FormData(form)

    const reservationDate = formDataObj.get("reservationDate") as string
    const reservationTime = formDataObj.get("reservationTime") as string

    const metadata: RestaurantMetadata = {
      restaurantName: formDataObj.get("restaurantName") as string,
      reservationDate,
      reservationTime,
      reservationTimezone: formDataObj.get("reservationTimezone") as string,
      cancellationPolicy: formDataObj.get("cancellationPolicy") as string,
      phone: formDataObj.get("phone") as string,
      address: formDataObj.get("address") as string,
      numberOfPeople: Number.parseInt(formDataObj.get("numberOfPeople") as string) || undefined,
    }

    const title = metadata.restaurantName || "Restaurant Reservation"
    const location = metadata.address || ""

    let scheduledFor: Date | undefined
    if (reservationDate && reservationTime) {
      scheduledFor = new Date(`${reservationDate}T${reservationTime}`)
    }

    onSubmit({
      title,
      location,
      scheduledFor,
      metadata,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="restaurantName">
          Restaurant Name <span className="text-destructive">*</span>
        </Label>
        <Input id="restaurantName" name="restaurantName" required placeholder="e.g., The French Laundry" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" name="phone" type="tel" placeholder="+1 (555) 123-4567" />
        </div>
        <div>
          <Label htmlFor="numberOfPeople">Number of People</Label>
          <Input id="numberOfPeople" name="numberOfPeople" type="number" min="1" placeholder="2" />
        </div>
      </div>

      <div>
        <Label htmlFor="address">Address</Label>
        <Textarea id="address" name="address" rows={2} placeholder="Full restaurant address" />
      </div>

      <div className="space-y-3 pt-2 border-t">
        <h3 className="font-medium text-sm">Reservation Details</h3>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <Label htmlFor="reservationDate">Date</Label>
            <Input id="reservationDate" name="reservationDate" type="date" />
          </div>
          <div>
            <Label htmlFor="reservationTime">Time</Label>
            <Input id="reservationTime" name="reservationTime" type="time" />
          </div>
          <div>
            <Label htmlFor="reservationTimezone">Timezone</Label>
            <Input id="reservationTimezone" name="reservationTimezone" placeholder="PST" />
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="cancellationPolicy">Cancellation Policy</Label>
        <Textarea
          id="cancellationPolicy"
          name="cancellationPolicy"
          rows={2}
          placeholder="e.g., Cancel 24 hours in advance for full refund"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
          Cancel
        </Button>
        <Button type="submit" className="flex-1">
          Add Reservation
        </Button>
      </div>
    </form>
  )
}
