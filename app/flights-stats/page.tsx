"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plane, Clock, Ruler, Calendar } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { mockTrips, mockTripMembers, mockActivities } from "@/lib/mock-data"
import type { Activity, FlightMetadata } from "@/lib/types"
import { AppHeader } from "@/components/ui/app-header"
import { FloatingSearchMobile } from "@/components/floating-search-mobile"

export default function FlightsStatsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Plane className="h-12 w-12 text-accent mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading flight statistics...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  // Get all user trips
  const userTripMemberships = mockTripMembers.filter((member) => member.userId === user.id)
  const userTrips = mockTrips.filter((trip) => userTripMemberships.some((member) => member.tripId === trip.id))
  const userTripIds = userTrips.map((trip) => trip.id)

  // Get all flights
  const allFlights = mockActivities.filter(
    (activity) =>
      userTripIds.includes(activity.tripId) && activity.type === "transportation" && activity.metadata?.airline,
  ) as (Activity & { metadata: FlightMetadata })[]

  // Calculate statistics
  const totalFlights = allFlights.length

  // Average flight time
  const flightsWithDuration = allFlights.filter((f) => f.metadata.durationMinutes)
  const avgDurationMinutes =
    flightsWithDuration.length > 0
      ? flightsWithDuration.reduce((sum, f) => sum + (f.metadata.durationMinutes || 0), 0) / flightsWithDuration.length
      : 0
  const avgHours = Math.floor(avgDurationMinutes / 60)
  const avgMinutes = Math.round(avgDurationMinutes % 60)

  // Average flight distance
  const flightsWithDistance = allFlights.filter((f) => f.metadata.distanceKm)
  const avgDistance =
    flightsWithDistance.length > 0
      ? Math.round(
          flightsWithDistance.reduce((sum, f) => sum + (f.metadata.distanceKm || 0), 0) / flightsWithDistance.length,
        )
      : 0

  // Most common airlines
  const airlineCounts = allFlights.reduce(
    (acc, flight) => {
      const airline = flight.metadata.airline
      acc[airline] = (acc[airline] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const sortedAirlines = Object.entries(airlineCounts)
    .sort(([, a], [, b]) => b - a)
    .map(([airline, count]) => ({ airline, count }))

  // Sort flights by date (most recent first)
  const sortedFlights = [...allFlights].sort((a, b) => {
    const dateA = a.scheduledFor || a.startTime || new Date(0)
    const dateB = b.scheduledFor || b.startTime || new Date(0)
    return new Date(dateB).getTime() - new Date(dateA).getTime()
  })

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const filteredFlights = searchQuery
    ? sortedFlights.filter(
        (flight) =>
          flight.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          flight.metadata.airline.toLowerCase().includes(searchQuery.toLowerCase()) ||
          flight.metadata.flightNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          flight.metadata.departureAirport.toLowerCase().includes(searchQuery.toLowerCase()) ||
          flight.metadata.arrivalAirport.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : sortedFlights

  return (
    <div className="min-h-screen bg-background">
      <AppHeader user={user} title="Flight Statistics" showBack showSearch onSearch={handleSearch} />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <p className="text-muted-foreground mt-1">Your complete flight history and travel insights</p>
        </div>

        {totalFlights > 0 ? (
          <div className="space-y-8">
            {/* Summary Stats */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Flight Time</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {avgHours}h {avgMinutes}m
                  </div>
                  <p className="text-xs text-muted-foreground">across {flightsWithDuration.length} flights</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Distance</CardTitle>
                  <Ruler className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{avgDistance.toLocaleString()} km</div>
                  <p className="text-xs text-muted-foreground">
                    {Math.round(avgDistance * 0.621371).toLocaleString()} miles
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Flights</CardTitle>
                  <Plane className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalFlights}</div>
                  <p className="text-xs text-muted-foreground">all time</p>
                </CardContent>
              </Card>
            </div>

            {/* Most Common Airlines */}
            <Card>
              <CardHeader>
                <CardTitle>Most Common Airlines</CardTitle>
                <CardDescription>Airlines you've flown with most frequently</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sortedAirlines.map(({ airline, count }, index) => (
                    <div key={airline} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent/10 text-accent font-semibold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{airline}</p>
                          <p className="text-xs text-muted-foreground">
                            {count} {count === 1 ? "flight" : "flights"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-foreground">{count}</div>
                        <div className="text-xs text-muted-foreground">{Math.round((count / totalFlights) * 100)}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* All Flights List */}
            <Card>
              <CardHeader>
                <CardTitle>All Flights</CardTitle>
                <CardDescription>
                  {searchQuery
                    ? `Found ${filteredFlights.length} ${filteredFlights.length === 1 ? "flight" : "flights"} matching "${searchQuery}"`
                    : "Complete list of your flight history"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredFlights.length > 0 ? (
                  <div className="space-y-3">
                    {filteredFlights.map((flight) => {
                      const trip = userTrips.find((t) => t.id === flight.tripId)
                      const flightDate = flight.scheduledFor || flight.startTime
                      const duration = flight.metadata.durationMinutes
                      const distance = flight.metadata.distanceKm

                      return (
                        <Link key={flight.id} href={`/trip/${flight.tripId}`}>
                          <div className="flex flex-col gap-3 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                            <div className="flex items-start gap-3">
                              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-accent/10 flex-shrink-0">
                                <Plane className="h-5 w-5 text-accent" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-foreground truncate">{flight.title}</p>
                                <p className="text-sm text-muted-foreground truncate">
                                  {flight.metadata.airline} • {flight.metadata.flightNumber}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1 truncate">
                                  {flight.metadata.departureAirport} → {flight.metadata.arrivalAirport}
                                </p>
                              </div>
                              <span
                                className={`px-2 py-1 rounded-full text-xs capitalize whitespace-nowrap flex-shrink-0 ${
                                  flight.status === "completed"
                                    ? "bg-green-500/10 text-green-600"
                                    : flight.status === "in_progress"
                                      ? "bg-blue-500/10 text-blue-600"
                                      : "bg-muted text-muted-foreground"
                                }`}
                              >
                                {flight.status.replace("_", " ")}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground pl-[52px]">
                              {trip && (
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {trip.name}
                                </span>
                              )}
                              {flightDate && (
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(flightDate).toLocaleDateString()}
                                </span>
                              )}
                              {duration && (
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {Math.floor(duration / 60)}h {duration % 60}m
                                </span>
                              )}
                              {distance && (
                                <span className="flex items-center gap-1">
                                  <Ruler className="h-3 w-3" />
                                  {distance.toLocaleString()} km
                                </span>
                              )}
                            </div>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No flights found matching "{searchQuery}"</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <Plane className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <CardTitle className="mb-2">No flights recorded</CardTitle>
              <CardDescription className="mb-4">
                Add transportation activities to your trips to track your flight statistics
              </CardDescription>
              <Button asChild>
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </main>

      <FloatingSearchMobile onSearch={handleSearch} />
    </div>
  )
}
