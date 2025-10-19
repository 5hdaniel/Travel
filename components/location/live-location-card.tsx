"use client"

import { LocationMap } from "./location-map"
import type { LocationUpdate, User } from "@/lib/types"

interface LiveLocationCardProps {
  tripId: string
  locationUpdates: LocationUpdate[]
  users: User[]
  currentUserLocation?: { lat: number; lng: number }
  onLocationUpdate?: (location: { lat: number; lng: number }) => void
  canShare: boolean
}

export function LiveLocationCard({
  tripId,
  locationUpdates,
  users,
  currentUserLocation,
  onLocationUpdate,
  canShare,
}: LiveLocationCardProps) {
  return (
    <div className="rounded-lg overflow-hidden border-2 border-green-500/30 bg-card shadow-[0_0_15px_rgba(34,197,94,0.2)]">
      <LocationMap
        tripId={tripId}
        locationUpdates={locationUpdates}
        users={users}
        currentUserLocation={currentUserLocation}
        compact={true}
      />
    </div>
  )
}
