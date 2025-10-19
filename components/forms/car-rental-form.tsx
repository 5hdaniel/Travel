"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { CarRentalMetadata } from "@/lib/types"

interface CarRentalFormProps {
  onSubmit: (data: {
    title: string
    description?: string
    scheduledFor?: Date
    location?: string
    metadata: CarRentalMetadata
    startTime?: Date
    endTime?: Date
  }) => void
  onCancel: () => void
}

export function CarRentalForm({ onSubmit, onCancel }: CarRentalFormProps) {
  const [formData, setFormData] = useState<CarRentalMetadata>({})

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formDataObj = new FormData(form)

    const pickupDate = formDataObj.get("pickupDate") as string
    const pickupTime = formDataObj.get("pickupTime") as string
    const dropoffDate = formDataObj.get("dropoffDate") as string
    const dropoffTime = formDataObj.get("dropoffTime") as string

    const metadata: CarRentalMetadata = {
      company: formDataObj.get("company") as string,
      confirmationNumber: formDataObj.get("confirmationNumber") as string,
      pickupAddress: formDataObj.get("pickupAddress") as string,
      pickupDate,
      pickupTime,
      pickupTimezone: formDataObj.get("pickupTimezone") as string,
      dropoffAddress: formDataObj.get("dropoffAddress") as string,
      dropoffDate,
      dropoffTime,
      dropoffTimezone: formDataObj.get("dropoffTimezone") as string,
      dropoffLocationPhone: formDataObj.get("dropoffLocationPhone") as string,
      carType: formDataObj.get("carType") as string,
    }

    const title = `${metadata.company || "Car Rental"} - ${metadata.carType || "Vehicle"}`
    const location = metadata.pickupAddress || ""

    let startTime: Date | undefined
    if (pickupDate && pickupTime) {
      startTime = new Date(`${pickupDate}T${pickupTime}`)
    }

    let endTime: Date | undefined
    if (dropoffDate && dropoffTime) {
      endTime = new Date(`${dropoffDate}T${dropoffTime}`)
    }

    onSubmit({
      title,
      location,
      scheduledFor: startTime,
      startTime,
      endTime,
      metadata,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="company">Rental Company</Label>
          <Input id="company" name="company" placeholder="e.g., Hertz, Enterprise" />
        </div>
        <div>
          <Label htmlFor="confirmationNumber">Confirmation Number</Label>
          <Input id="confirmationNumber" name="confirmationNumber" placeholder="ABC123456" />
        </div>
      </div>

      <div>
        <Label htmlFor="carType">Type of Car</Label>
        <Input id="carType" name="carType" placeholder="e.g., Compact, SUV, Sedan" />
      </div>

      <div className="space-y-3 pt-2 border-t">
        <h3 className="font-medium text-sm">Pickup Details</h3>
        <div>
          <Label htmlFor="pickupAddress">Pickup Address</Label>
          <Textarea id="pickupAddress" name="pickupAddress" rows={2} placeholder="Full pickup address" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <Label htmlFor="pickupDate">Date</Label>
            <Input id="pickupDate" name="pickupDate" type="date" />
          </div>
          <div>
            <Label htmlFor="pickupTime">Time</Label>
            <Input id="pickupTime" name="pickupTime" type="time" />
          </div>
          <div>
            <Label htmlFor="pickupTimezone">Timezone</Label>
            <Input id="pickupTimezone" name="pickupTimezone" placeholder="PST" />
          </div>
        </div>
      </div>

      <div className="space-y-3 pt-2 border-t">
        <h3 className="font-medium text-sm">Dropoff Details</h3>
        <div>
          <Label htmlFor="dropoffAddress">Dropoff Address</Label>
          <Textarea id="dropoffAddress" name="dropoffAddress" rows={2} placeholder="Full dropoff address" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <Label htmlFor="dropoffDate">Date</Label>
            <Input id="dropoffDate" name="dropoffDate" type="date" />
          </div>
          <div>
            <Label htmlFor="dropoffTime">Time</Label>
            <Input id="dropoffTime" name="dropoffTime" type="time" />
          </div>
          <div>
            <Label htmlFor="dropoffTimezone">Timezone</Label>
            <Input id="dropoffTimezone" name="dropoffTimezone" placeholder="PST" />
          </div>
        </div>
        <div>
          <Label htmlFor="dropoffLocationPhone">Dropoff Location Phone</Label>
          <Input id="dropoffLocationPhone" name="dropoffLocationPhone" type="tel" placeholder="+1 (555) 123-4567" />
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
          Cancel
        </Button>
        <Button type="submit" className="flex-1">
          Add Car Rental
        </Button>
      </div>
    </form>
  )
}
