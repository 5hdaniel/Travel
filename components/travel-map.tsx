"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Hotel, Plane, UtensilsCrossed, Camera, Calendar } from "lucide-react"
import type { Activity } from "@/lib/types"

interface TravelMapProps {
  activities: Activity[]
}

export function TravelMap({ activities }: TravelMapProps) {
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)

  // Group activities by location
  const activitiesByLocation = activities.reduce(
    (acc, activity) => {
      if (activity.location) {
        if (!acc[activity.location]) {
          acc[activity.location] = []
        }
        acc[activity.location].push(activity)
      }
      return acc
    },
    {} as Record<string, Activity[]>,
  )

  const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
      case "accommodation":
        return <Hotel className="h-3 w-3" />
      case "transportation":
        return <Plane className="h-3 w-3" />
      case "dining":
        return <UtensilsCrossed className="h-3 w-3" />
      case "sightseeing":
        return <Camera className="h-3 w-3" />
      default:
        return <MapPin className="h-3 w-3" />
    }
  }

  const getActivityColor = (type: Activity["type"]) => {
    switch (type) {
      case "accommodation":
        return "bg-blue-500"
      case "transportation":
        return "bg-purple-500"
      case "dining":
        return "bg-orange-500"
      case "sightseeing":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Travel Map</CardTitle>
        <CardDescription>Your activities across all destinations</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {/* Map container with activity markers */}
        <div className="relative aspect-[16/9] bg-muted">
          {/* Background map image */}
          <img
            src="/placeholder.svg?height=400&width=800"
            alt="Travel map"
            className="w-full h-full object-cover opacity-40"
          />

          {/* Activity markers positioned on the map */}
          <div className="absolute inset-0 p-4">
            <div className="relative w-full h-full">
              {/* Simulate marker positions - in a real app, these would be calculated based on coordinates */}
              {Object.entries(activitiesByLocation).map(([location, locationActivities], index) => {
                // Generate pseudo-random positions for demo
                const positions = [
                  { top: "20%", left: "15%" }, // Europe
                  { top: "35%", left: "75%" }, // Asia
                  { top: "45%", left: "25%" }, // Africa
                  { top: "50%", left: "15%" }, // South America
                  { top: "25%", left: "20%" }, // North America
                  { top: "60%", left: "80%" }, // Australia
                ]
                const position = positions[index % positions.length]

                return (
                  <div
                    key={location}
                    className="absolute group cursor-pointer"
                    style={{ top: position.top, left: position.left }}
                    onClick={() => setSelectedActivity(locationActivities[0])}
                  >
                    {/* Marker pin */}
                    <div className="relative">
                      <div
                        className={`w-8 h-8 rounded-full ${getActivityColor(locationActivities[0].type)} shadow-lg flex items-center justify-center text-white transform transition-transform group-hover:scale-110`}
                      >
                        {getActivityIcon(locationActivities[0].type)}
                      </div>
                      {locationActivities.length > 1 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-accent-foreground text-xs rounded-full flex items-center justify-center font-semibold shadow">
                          {locationActivities.length}
                        </div>
                      )}

                      {/* Hover tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                        <div className="bg-background border border-border rounded-lg shadow-lg p-2 whitespace-nowrap">
                          <p className="text-sm font-semibold text-foreground">{location}</p>
                          <p className="text-xs text-muted-foreground">
                            {locationActivities.length} {locationActivities.length === 1 ? "activity" : "activities"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Activity details panel */}
        {selectedActivity && (
          <div className="p-4 border-t border-border bg-muted/30">
            <div className="flex items-start gap-3">
              <div
                className={`w-10 h-10 rounded-full ${getActivityColor(selectedActivity.type)} flex items-center justify-center text-white flex-shrink-0`}
              >
                {getActivityIcon(selectedActivity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="font-semibold text-foreground">{selectedActivity.title}</h4>
                  <Badge variant="secondary" className="capitalize text-xs">
                    {selectedActivity.type}
                  </Badge>
                </div>
                {selectedActivity.description && (
                  <p className="text-sm text-muted-foreground mb-2">{selectedActivity.description}</p>
                )}
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {selectedActivity.location}
                  </span>
                  {selectedActivity.scheduledFor && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(selectedActivity.scheduledFor).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="p-4 border-t border-border">
          <p className="text-xs font-medium text-muted-foreground mb-2">Activity Types</p>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-xs text-muted-foreground">Accommodation</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-purple-500" />
              <span className="text-xs text-muted-foreground">Transportation</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-orange-500" />
              <span className="text-xs text-muted-foreground">Dining</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-xs text-muted-foreground">Sightseeing</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
