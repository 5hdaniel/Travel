"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MapPin, Navigation, Clock, AlertTriangle, Loader2, Eye, EyeOff, Pause } from "lucide-react"
import { useLocation } from "@/hooks/use-location"
import { useAuth } from "@/hooks/use-auth"
import { format, isPast } from "date-fns"
import { PauseLocationDialog } from "./pause-location-dialog"

interface LocationShareProps {
  tripId: string
  onLocationUpdate?: (location: { lat: number; lng: number }) => void
}

export function LocationShare({ tripId, onLocationUpdate }: LocationShareProps) {
  const { user } = useAuth()
  const { location, error, loading, requestLocation, watchLocation, stopWatching, isWatching, isSupported } =
    useLocation()
  const [isSharing, setIsSharing] = useState(false)
  const [lastShared, setLastShared] = useState<Date | null>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [pauseResumeAt, setPauseResumeAt] = useState<Date | null>(null)
  const [showPauseDialog, setShowPauseDialog] = useState(false)

  useEffect(() => {
    if (isPaused && pauseResumeAt && isPast(pauseResumeAt)) {
      setIsPaused(false)
      setPauseResumeAt(null)
      if (isSharing) {
        watchLocation()
      }
    }
  }, [isPaused, pauseResumeAt, isSharing, watchLocation])

  useEffect(() => {
    if (location && isSharing && !isPaused) {
      onLocationUpdate?.({
        lat: location.latitude,
        lng: location.longitude,
      })
      setLastShared(new Date())
      console.log(`[v0] Location shared for trip ${tripId}:`, location)
    }
  }, [location, isSharing, isPaused, tripId, onLocationUpdate])

  const handleToggleSharing = (enabled: boolean) => {
    setIsSharing(enabled)

    if (enabled) {
      if (!location) {
        requestLocation()
      }
      if (!isPaused) {
        watchLocation()
      }
    } else {
      stopWatching()
      setIsPaused(false)
      setPauseResumeAt(null)
    }
  }

  const handlePauseSharing = (resumeAt: Date) => {
    setIsPaused(true)
    setPauseResumeAt(resumeAt)
    stopWatching()
  }

  const handleResumeSharing = () => {
    setIsPaused(false)
    setPauseResumeAt(null)
    if (isSharing) {
      watchLocation()
    }
  }

  const getLocationAccuracyText = (accuracy?: number) => {
    if (!accuracy) return "Unknown accuracy"
    if (accuracy < 10) return "Very accurate"
    if (accuracy < 50) return "Good accuracy"
    if (accuracy < 100) return "Fair accuracy"
    return "Low accuracy"
  }

  const getLocationAccuracyColor = (accuracy?: number) => {
    if (!accuracy) return "secondary"
    if (accuracy < 10) return "default"
    if (accuracy < 50) return "default"
    if (accuracy < 100) return "secondary"
    return "destructive"
  }

  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Location Sharing
          </CardTitle>
          <CardDescription>Share your real-time location with trip members</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>Location sharing is not supported by your browser or device.</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Location Sharing
        </CardTitle>
        <CardDescription>Share your real-time location with trip members</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">Share Location</span>
              {isSharing ? (
                <Eye className="h-4 w-4 text-accent" />
              ) : (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {isSharing ? "Your location is being shared" : "Location sharing is disabled"}
            </p>
          </div>
          <Switch checked={isSharing} onCheckedChange={handleToggleSharing} disabled={loading} />
        </div>

        {isPaused && pauseResumeAt && (
          <Alert>
            <Pause className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <div>
                <p className="font-medium">Location sharing paused</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Will resume on {format(pauseResumeAt, "PPP 'at' p")}
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={handleResumeSharing}>
                Resume Now
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {error.code === 1 && "Location access denied. Please enable location permissions."}
              {error.code === 2 && "Location unavailable. Please check your connection."}
              {error.code === 3 && "Location request timed out. Please try again."}
              {error.code === -1 && error.message}
            </AlertDescription>
          </Alert>
        )}

        {location && (
          <div className="space-y-3 p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Current Location</span>
              <Badge variant={getLocationAccuracyColor(location.accuracy)}>
                {getLocationAccuracyText(location.accuracy)}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Latitude</span>
                <p className="font-mono text-foreground">{location.latitude.toFixed(6)}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Longitude</span>
                <p className="font-mono text-foreground">{location.longitude.toFixed(6)}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>Updated {format(location.timestamp, "h:mm:ss a")}</span>
            </div>
          </div>
        )}

        {lastShared && isSharing && !isPaused && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Navigation className="h-3 w-3" />
            <span>Last shared {format(lastShared, "h:mm:ss a")}</span>
          </div>
        )}

        <div className="flex gap-2">
          {!location && !loading && (
            <Button onClick={requestLocation} variant="outline" size="sm">
              <MapPin className="h-4 w-4 mr-2" />
              Get Location
            </Button>
          )}

          {loading && (
            <Button disabled size="sm">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Getting Location...
            </Button>
          )}

          {isSharing && !isPaused && (
            <Button onClick={() => setShowPauseDialog(true)} variant="outline" size="sm">
              <Pause className="h-4 w-4 mr-2" />
              Pause Sharing
            </Button>
          )}

          {isWatching && !isPaused && (
            <Button onClick={stopWatching} variant="outline" size="sm">
              Stop Watching
            </Button>
          )}
        </div>

        <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
          <p className="font-medium mb-1">Privacy Notice</p>
          <p>
            Your location is only shared with members of this trip. You can stop sharing at any time by turning off
            location sharing above.
          </p>
        </div>
      </CardContent>

      <PauseLocationDialog open={showPauseDialog} onOpenChange={setShowPauseDialog} onPause={handlePauseSharing} />
    </Card>
  )
}
