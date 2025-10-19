"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Users, Maximize2, Minimize2 } from "lucide-react"
import type { LocationUpdate, User } from "@/lib/types"

interface LocationMapProps {
  tripId: string
  locationUpdates: LocationUpdate[]
  users: User[]
  currentUserLocation?: { lat: number; lng: number }
  compact?: boolean // Added compact mode prop
}

export function LocationMap({
  tripId,
  locationUpdates,
  users,
  currentUserLocation,
  compact = false,
}: LocationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<string | null>(null)

  // Mock map implementation - in production this would use Google Maps, Mapbox, etc.
  useEffect(() => {
    if (!mapRef.current) return

    // Simulate map initialization
    console.log(`[v0] Initializing map for trip ${tripId}`)
    console.log(`[v0] Location updates:`, locationUpdates)
    console.log(`[v0] Current user location:`, currentUserLocation)

    // In a real implementation, you would:
    // 1. Initialize the map library (Google Maps, Mapbox, etc.)
    // 2. Add markers for each user's location
    // 3. Update markers when location updates change
    // 4. Handle user interactions (clicking markers, etc.)
  }, [tripId, locationUpdates, currentUserLocation])

  const getLatestLocationForUser = (userId: string) => {
    const userUpdates = locationUpdates.filter((update) => update.userId === userId)
    return userUpdates.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0]
  }

  const activeUsers = users.filter((user) => {
    const latestLocation = getLatestLocationForUser(user.id)
    return latestLocation && Date.now() - latestLocation.timestamp.getTime() < 30 * 60 * 1000 // 30 minutes
  })

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  if (compact) {
    return (
      <div ref={mapRef} className="h-[200px] bg-muted relative overflow-hidden">
        {/* Mock map background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-900 dark:to-green-900">
          <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="100%" viewBox="0 0 100 100" className="text-muted-foreground">
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
        </div>

        {/* Mock location markers */}
        {activeUsers.map((user, index) => {
          const location = getLatestLocationForUser(user.id)
          if (!location) return null

          const left = 20 + ((index * 15) % 60)
          const top = 20 + ((index * 20) % 40)

          return (
            <div
              key={user.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
              style={{ left: `${left}%`, top: `${top}%` }}
              onClick={() => setSelectedUser(selectedUser === user.id ? null : user.id)}
            >
              <div className="relative">
                <div className="w-8 h-8 bg-accent rounded-full border-2 border-background shadow-lg flex items-center justify-center">
                  <span className="text-xs font-bold text-accent-foreground">{user.name.charAt(0)}</span>
                </div>
                {selectedUser === user.id && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-background border border-border rounded-lg p-2 shadow-lg min-w-32 z-10">
                    <p className="text-xs font-medium text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{new Date(location.timestamp).toLocaleTimeString()}</p>
                  </div>
                )}
              </div>
            </div>
          )
        })}

        {/* Current user location */}
        {currentUserLocation && (
          <div className="absolute transform -translate-x-1/2 -translate-y-1/2" style={{ left: "50%", top: "50%" }}>
            <div className="relative">
              <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 w-4 h-4 bg-green-500 rounded-full animate-ping opacity-75"></div>
            </div>
          </div>
        )}

        {/* No active users message */}
        {activeUsers.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No active locations</p>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <Card className={isFullscreen ? "fixed inset-4 z-50" : ""}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Live Locations
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {activeUsers.length} active
            </Badge>
            <Button variant="ghost" size="sm" onClick={toggleFullscreen}>
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Mock Map Container */}
          <div
            ref={mapRef}
            className={`bg-muted rounded-lg relative overflow-hidden ${
              isFullscreen ? "h-[calc(100vh-200px)]" : "h-64"
            }`}
          >
            {/* Mock map background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-900 dark:to-green-900">
              <div className="absolute inset-0 opacity-20">
                <svg width="100%" height="100%" viewBox="0 0 100 100" className="text-muted-foreground">
                  <defs>
                    <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                      <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>
            </div>

            {/* Mock location markers */}
            {activeUsers.map((user, index) => {
              const location = getLatestLocationForUser(user.id)
              if (!location) return null

              // Mock positioning based on index for demo
              const left = 20 + ((index * 15) % 60)
              const top = 20 + ((index * 20) % 40)

              return (
                <div
                  key={user.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                  style={{ left: `${left}%`, top: `${top}%` }}
                  onClick={() => setSelectedUser(selectedUser === user.id ? null : user.id)}
                >
                  <div className="relative">
                    <div className="w-8 h-8 bg-accent rounded-full border-2 border-background shadow-lg flex items-center justify-center">
                      <span className="text-xs font-bold text-accent-foreground">{user.name.charAt(0)}</span>
                    </div>
                    {selectedUser === user.id && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-background border border-border rounded-lg p-2 shadow-lg min-w-32">
                        <p className="text-xs font-medium text-foreground">{user.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(location.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}

            {/* Current user location */}
            {currentUserLocation && (
              <div className="absolute transform -translate-x-1/2 -translate-y-1/2" style={{ left: "50%", top: "50%" }}>
                <div className="relative">
                  <div className="w-4 h-4 bg-primary rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 w-4 h-4 bg-primary rounded-full animate-ping opacity-75"></div>
                </div>
              </div>
            )}

            {/* No active users message */}
            {activeUsers.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No active locations</p>
                  <p className="text-xs text-muted-foreground">Enable location sharing to see live updates</p>
                </div>
              </div>
            )}
          </div>

          {/* Active Users List */}
          {activeUsers.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-foreground">Active Members</h4>
              <div className="space-y-1">
                {activeUsers.map((user) => {
                  const location = getLatestLocationForUser(user.id)
                  if (!location) return null

                  const minutesAgo = Math.floor((Date.now() - location.timestamp.getTime()) / (1000 * 60))

                  return (
                    <div key={user.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-accent rounded-full"></div>
                        <span className="text-foreground">{user.name}</span>
                      </div>
                      <span className="text-muted-foreground">
                        {minutesAgo === 0 ? "Just now" : `${minutesAgo}m ago`}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
