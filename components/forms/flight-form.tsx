"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import type { FlightMetadata } from "@/lib/types"

interface FlightFormProps {
  onSubmit: (data: {
    title: string
    description?: string
    location?: string
    scheduledFor?: Date
    startTime?: Date
    endTime?: Date
    metadata: FlightMetadata
  }) => void
  onCancel: () => void
}

export function FlightForm({ onSubmit, onCancel }: FlightFormProps) {
  const [formData, setFormData] = useState<any>({})

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formDataObj = new FormData(form)

    // Build flight title from airline and flight number
    const operatingAirline = formDataObj.get("operatingAirline") as string
    const operatingFlightNumber = formDataObj.get("operatingFlightNumber") as string
    const departureAirport = formDataObj.get("departureAirport") as string
    const arrivalAirport = formDataObj.get("arrivalAirport") as string

    const title =
      operatingAirline && operatingFlightNumber
        ? `${operatingAirline} ${operatingFlightNumber}`
        : `Flight: ${departureAirport} → ${arrivalAirport}`

    // Parse scheduled departure for activity timing
    const scheduledDepDate = formDataObj.get("scheduledDepartureDate") as string
    const scheduledDepTime = formDataObj.get("scheduledDepartureTime") as string
    const scheduledArrDate = formDataObj.get("scheduledArrivalDate") as string
    const scheduledArrTime = formDataObj.get("scheduledArrivalTime") as string

    let startTime: Date | undefined
    let endTime: Date | undefined

    if (scheduledDepDate && scheduledDepTime) {
      startTime = new Date(`${scheduledDepDate}T${scheduledDepTime}`)
    }
    if (scheduledArrDate && scheduledArrTime) {
      endTime = new Date(`${scheduledArrDate}T${scheduledArrTime}`)
    }

    const metadata: FlightMetadata = {
      confirmationNumber: (formDataObj.get("confirmationNumber") as string) || undefined,
      bookingDate: (formDataObj.get("bookingDate") as string) || undefined,
      totalCost: formDataObj.get("totalCost") ? Number(formDataObj.get("totalCost")) : undefined,
      currency: (formDataObj.get("currency") as string) || undefined,
      operatingAirline: operatingAirline || undefined,
      operatingFlightNumber: operatingFlightNumber || undefined,
      soldByAirline: (formDataObj.get("soldByAirline") as string) || undefined,
      soldByFlightNumber: (formDataObj.get("soldByFlightNumber") as string) || undefined,
      aircraft: (formDataObj.get("aircraft") as string) || undefined,
      stops: formDataObj.get("stops") ? Number(formDataObj.get("stops")) : undefined,
      fareClass: (formDataObj.get("fareClass") as string) || undefined,
      fareRules: (formDataObj.get("fareRules") as string) || undefined,
      distanceMiles: formDataObj.get("distanceMiles") ? Number(formDataObj.get("distanceMiles")) : undefined,
      departureAirport: departureAirport,
      departureGate: (formDataObj.get("departureGate") as string) || undefined,
      departureTerminal: (formDataObj.get("departureTerminal") as string) || undefined,
      arrivalAirport: arrivalAirport,
      arrivalGate: (formDataObj.get("arrivalGate") as string) || undefined,
      arrivalTerminal: (formDataObj.get("arrivalTerminal") as string) || undefined,
      durationMinutes: formDataObj.get("durationMinutes") ? Number(formDataObj.get("durationMinutes")) : undefined,
      scheduledDepartureDate: scheduledDepDate || undefined,
      scheduledDepartureTime: scheduledDepTime || undefined,
      scheduledDepartureTimezone: (formDataObj.get("scheduledDepartureTimezone") as string) || undefined,
      scheduledArrivalDate: scheduledArrDate || undefined,
      scheduledArrivalTime: scheduledArrTime || undefined,
      scheduledArrivalTimezone: (formDataObj.get("scheduledArrivalTimezone") as string) || undefined,
      actualDepartureDate: (formDataObj.get("actualDepartureDate") as string) || undefined,
      actualDepartureTime: (formDataObj.get("actualDepartureTime") as string) || undefined,
      actualDepartureTimezone: (formDataObj.get("actualDepartureTimezone") as string) || undefined,
      actualDepartureGate: (formDataObj.get("actualDepartureGate") as string) || undefined,
      actualArrivalDate: (formDataObj.get("actualArrivalDate") as string) || undefined,
      actualArrivalTime: (formDataObj.get("actualArrivalTime") as string) || undefined,
      actualArrivalTimezone: (formDataObj.get("actualArrivalTimezone") as string) || undefined,
      actualArrivalGate: (formDataObj.get("actualArrivalGate") as string) || undefined,
      baggageClaimCarousel: (formDataObj.get("baggageClaimCarousel") as string) || undefined,
      // Legacy fields for backward compatibility
      airline: operatingAirline || undefined,
      flightNumber: operatingFlightNumber || undefined,
    }

    onSubmit({
      title,
      description: (formDataObj.get("description") as string) || undefined,
      location: `${departureAirport} → ${arrivalAirport}`,
      scheduledFor: startTime,
      startTime,
      endTime,
      metadata,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="booking">Booking</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="actual">Actual</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="operatingAirline">
                Operating Airline <span className="text-destructive">*</span>
              </Label>
              <Input id="operatingAirline" name="operatingAirline" required placeholder="e.g., United Airlines" />
            </div>
            <div>
              <Label htmlFor="operatingFlightNumber">
                Flight Number <span className="text-destructive">*</span>
              </Label>
              <Input id="operatingFlightNumber" name="operatingFlightNumber" required placeholder="e.g., UA123" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="departureAirport">
                Departure Airport <span className="text-destructive">*</span>
              </Label>
              <Input id="departureAirport" name="departureAirport" required placeholder="e.g., JFK" />
            </div>
            <div>
              <Label htmlFor="arrivalAirport">
                Arrival Airport <span className="text-destructive">*</span>
              </Label>
              <Input id="arrivalAirport" name="arrivalAirport" required placeholder="e.g., LAX" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="departureTerminal">Departure Terminal</Label>
              <Input id="departureTerminal" name="departureTerminal" placeholder="e.g., Terminal 4" />
            </div>
            <div>
              <Label htmlFor="departureGate">Departure Gate</Label>
              <Input id="departureGate" name="departureGate" placeholder="e.g., B12" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="arrivalTerminal">Arrival Terminal</Label>
              <Input id="arrivalTerminal" name="arrivalTerminal" placeholder="e.g., Terminal 1" />
            </div>
            <div>
              <Label htmlFor="arrivalGate">Arrival Gate</Label>
              <Input id="arrivalGate" name="arrivalGate" placeholder="e.g., C5" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="aircraft">Aircraft</Label>
              <Input id="aircraft" name="aircraft" placeholder="e.g., Boeing 737" />
            </div>
            <div>
              <Label htmlFor="stops">Stops</Label>
              <Input id="stops" name="stops" type="number" min="0" placeholder="0" />
            </div>
            <div>
              <Label htmlFor="durationMinutes">Duration (min)</Label>
              <Input id="durationMinutes" name="durationMinutes" type="number" placeholder="e.g., 360" />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Notes</Label>
            <Textarea id="description" name="description" rows={2} placeholder="Additional flight details..." />
          </div>
        </TabsContent>

        <TabsContent value="booking" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="confirmationNumber">Confirmation Number</Label>
              <Input id="confirmationNumber" name="confirmationNumber" placeholder="e.g., ABC123" />
            </div>
            <div>
              <Label htmlFor="bookingDate">Booking Date</Label>
              <Input id="bookingDate" name="bookingDate" type="date" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="totalCost">Total Cost</Label>
              <Input id="totalCost" name="totalCost" type="number" step="0.01" placeholder="e.g., 450.00" />
            </div>
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Input id="currency" name="currency" placeholder="e.g., USD" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="soldByAirline">Sold By Airline</Label>
              <Input id="soldByAirline" name="soldByAirline" placeholder="e.g., Delta" />
            </div>
            <div>
              <Label htmlFor="soldByFlightNumber">Sold By Flight #</Label>
              <Input id="soldByFlightNumber" name="soldByFlightNumber" placeholder="e.g., DL456" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fareClass">Fare Class</Label>
              <Input id="fareClass" name="fareClass" placeholder="e.g., Economy, Business" />
            </div>
            <div>
              <Label htmlFor="distanceMiles">Distance (miles)</Label>
              <Input id="distanceMiles" name="distanceMiles" type="number" placeholder="e.g., 2500" />
            </div>
          </div>

          <div>
            <Label htmlFor="fareRules">Fare Rules</Label>
            <Textarea
              id="fareRules"
              name="fareRules"
              rows={3}
              placeholder="Cancellation policy, baggage allowance, etc."
            />
          </div>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-4 mt-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <h3 className="font-medium text-sm">Scheduled Departure</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="scheduledDepartureDate">Date</Label>
                  <Input id="scheduledDepartureDate" name="scheduledDepartureDate" type="date" />
                </div>
                <div>
                  <Label htmlFor="scheduledDepartureTime">Time</Label>
                  <Input id="scheduledDepartureTime" name="scheduledDepartureTime" type="time" />
                </div>
                <div>
                  <Label htmlFor="scheduledDepartureTimezone">Timezone</Label>
                  <Input id="scheduledDepartureTimezone" name="scheduledDepartureTimezone" placeholder="e.g., EST" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <h3 className="font-medium text-sm">Scheduled Arrival</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="scheduledArrivalDate">Date</Label>
                  <Input id="scheduledArrivalDate" name="scheduledArrivalDate" type="date" />
                </div>
                <div>
                  <Label htmlFor="scheduledArrivalTime">Time</Label>
                  <Input id="scheduledArrivalTime" name="scheduledArrivalTime" type="time" />
                </div>
                <div>
                  <Label htmlFor="scheduledArrivalTimezone">Timezone</Label>
                  <Input id="scheduledArrivalTimezone" name="scheduledArrivalTimezone" placeholder="e.g., PST" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actual" className="space-y-4 mt-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <h3 className="font-medium text-sm">Actual Departure</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="actualDepartureDate">Date</Label>
                  <Input id="actualDepartureDate" name="actualDepartureDate" type="date" />
                </div>
                <div>
                  <Label htmlFor="actualDepartureTime">Time</Label>
                  <Input id="actualDepartureTime" name="actualDepartureTime" type="time" />
                </div>
                <div>
                  <Label htmlFor="actualDepartureTimezone">Timezone</Label>
                  <Input id="actualDepartureTimezone" name="actualDepartureTimezone" placeholder="e.g., EST" />
                </div>
              </div>
              <div>
                <Label htmlFor="actualDepartureGate">Actual Departure Gate</Label>
                <Input id="actualDepartureGate" name="actualDepartureGate" placeholder="e.g., B15" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <h3 className="font-medium text-sm">Actual Arrival</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="actualArrivalDate">Date</Label>
                  <Input id="actualArrivalDate" name="actualArrivalDate" type="date" />
                </div>
                <div>
                  <Label htmlFor="actualArrivalTime">Time</Label>
                  <Input id="actualArrivalTime" name="actualArrivalTime" type="time" />
                </div>
                <div>
                  <Label htmlFor="actualArrivalTimezone">Timezone</Label>
                  <Input id="actualArrivalTimezone" name="actualArrivalTimezone" placeholder="e.g., PST" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="actualArrivalGate">Actual Arrival Gate</Label>
                  <Input id="actualArrivalGate" name="actualArrivalGate" placeholder="e.g., C8" />
                </div>
                <div>
                  <Label htmlFor="baggageClaimCarousel">Baggage Claim</Label>
                  <Input id="baggageClaimCarousel" name="baggageClaimCarousel" placeholder="e.g., Carousel 3" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
          Cancel
        </Button>
        <Button type="submit" className="flex-1">
          Add Flight
        </Button>
      </div>
    </form>
  )
}
