"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { HotelMetadata } from "@/lib/types"

interface HotelFormProps {
  onSubmit: (data: {
    title: string
    description?: string
    scheduledFor?: Date
    location?: string
    metadata: HotelMetadata
    startTime?: Date
    endTime?: Date
  }) => void
  onCancel: () => void
}

export function HotelForm({ onSubmit, onCancel }: HotelFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formDataObj = new FormData(form)

    const checkinDate = formDataObj.get("checkinDate") as string
    const checkinTime = formDataObj.get("checkinTime") as string

    const metadata: HotelMetadata = {
      hotelName: formDataObj.get("hotelName") as string,
      checkinDate,
      checkinTime,
      checkinTimezone: formDataObj.get("checkinTimezone") as string,
      address: formDataObj.get("address") as string,
      phone: formDataObj.get("phone") as string,
      confirmationNumber: formDataObj.get("confirmationNumber") as string,
      totalCost: Number.parseFloat(formDataObj.get("totalCost") as string) || undefined,
      currency: formDataObj.get("currency") as string,
      numberOfGuests: Number.parseInt(formDataObj.get("numberOfGuests") as string) || undefined,
      restrictions: formDataObj.get("restrictions") as string,
    }

    const title = metadata.hotelName || "Hotel Stay"
    const location = metadata.address || ""

    let startTime: Date | undefined
    if (checkinDate && checkinTime) {
      startTime = new Date(`${checkinDate}T${checkinTime}`)
    }

    onSubmit({
      title,
      location,
      scheduledFor: startTime,
      startTime,
      metadata,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="hotelName">
          Hotel Name <span className="text-destructive">*</span>
        </Label>
        <Input id="hotelName" name="hotelName" required placeholder="e.g., Marriott Downtown" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="confirmationNumber">Confirmation Number</Label>
          <Input id="confirmationNumber" name="confirmationNumber" placeholder="ABC123456" />
        </div>
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" name="phone" type="tel" placeholder="+1 (555) 123-4567" />
        </div>
      </div>

      <div>
        <Label htmlFor="address">Address</Label>
        <Textarea id="address" name="address" rows={2} placeholder="Full hotel address" />
      </div>

      <div className="space-y-3 pt-2 border-t">
        <h3 className="font-medium text-sm">Check-in Details</h3>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <Label htmlFor="checkinDate">Date</Label>
            <Input id="checkinDate" name="checkinDate" type="date" />
          </div>
          <div>
            <Label htmlFor="checkinTime">Time</Label>
            <Input id="checkinTime" name="checkinTime" type="time" defaultValue="15:00" />
          </div>
          <div>
            <Label htmlFor="checkinTimezone">Timezone</Label>
            <Input id="checkinTimezone" name="checkinTimezone" placeholder="PST" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="numberOfGuests">Number of Guests</Label>
          <Input id="numberOfGuests" name="numberOfGuests" type="number" min="1" placeholder="2" />
        </div>
        <div>
          <Label htmlFor="totalCost">Total Cost</Label>
          <div className="flex gap-2">
            <Input id="totalCost" name="totalCost" type="number" step="0.01" placeholder="299.99" className="flex-1" />
            <Input id="currency" name="currency" placeholder="USD" className="w-20" />
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="restrictions">Restrictions</Label>
        <Textarea
          id="restrictions"
          name="restrictions"
          rows={2}
          placeholder="e.g., No smoking, No pets, Check-in after 3 PM"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
          Cancel
        </Button>
        <Button type="submit" className="flex-1">
          Add Accommodation
        </Button>
      </div>
    </form>
  )
}
