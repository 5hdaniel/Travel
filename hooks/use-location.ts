"use client"

import { useState, useEffect, useCallback } from "react"

interface LocationData {
  latitude: number
  longitude: number
  accuracy?: number
  timestamp: number
}

interface LocationError {
  code: number
  message: string
}

interface UseLocationReturn {
  location: LocationData | null
  error: LocationError | null
  loading: boolean
  requestLocation: () => void
  watchLocation: () => void
  stopWatching: () => void
  isWatching: boolean
  isSupported: boolean
}

export function useLocation(): UseLocationReturn {
  const [location, setLocation] = useState<LocationData | null>(null)
  const [error, setError] = useState<LocationError | null>(null)
  const [loading, setLoading] = useState(false)
  const [watchId, setWatchId] = useState<number | null>(null)
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    setIsSupported("geolocation" in navigator)
  }, [])

  const handleSuccess = useCallback((position: GeolocationPosition) => {
    const locationData: LocationData = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      timestamp: position.timestamp,
    }
    setLocation(locationData)
    setError(null)
    setLoading(false)
  }, [])

  const handleError = useCallback((err: GeolocationPositionError) => {
    const errorData: LocationError = {
      code: err.code,
      message: err.message,
    }
    setError(errorData)
    setLocation(null)
    setLoading(false)
  }, [])

  const requestLocation = useCallback(() => {
    if (!isSupported) {
      setError({
        code: -1,
        message: "Geolocation is not supported by this browser",
      })
      return
    }

    setLoading(true)
    setError(null)

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000, // 1 minute
    }

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, options)
  }, [isSupported, handleSuccess, handleError])

  const watchLocation = useCallback(() => {
    if (!isSupported) {
      setError({
        code: -1,
        message: "Geolocation is not supported by this browser",
      })
      return
    }

    if (watchId !== null) {
      return // Already watching
    }

    setLoading(true)
    setError(null)

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 30000, // 30 seconds for watching
    }

    const id = navigator.geolocation.watchPosition(handleSuccess, handleError, options)
    setWatchId(id)
  }, [isSupported, watchId, handleSuccess, handleError])

  const stopWatching = useCallback(() => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId)
      setWatchId(null)
      setLoading(false)
    }
  }, [watchId])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId)
      }
    }
  }, [watchId])

  return {
    location,
    error,
    loading,
    requestLocation,
    watchLocation,
    stopWatching,
    isWatching: watchId !== null,
    isSupported,
  }
}
