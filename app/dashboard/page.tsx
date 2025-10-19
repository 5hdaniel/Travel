"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AppHeader } from "@/components/ui/app-header"
import { FloatingSearchMobile } from "@/components/floating-search-mobile"
import { LocationSharingButton } from "@/components/location-sharing-button"
import { AddActivityDialog } from "@/components/add-activity-dialog"
import { TravelMap } from "@/components/travel-map"
import { PlacesListView } from "@/components/places-list-view"
import { Plus, Calendar, Users, Hotel, Plane, UtensilsCrossed, Globe, Archive } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { mockActivities } from "@/lib/mock-data"
import {
  getAllTrips,
  getAllTripMembers,
  saveTrip,
  saveTripMember,
  getNextTripId,
  getNextMemberId,
} from "@/lib/trips-storage"
import type { Activity, Trip, TripMember } from "@/lib/types"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isNewTripOpen, setIsNewTripOpen] = useState(false)
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false)
  const [showWorldMap, setShowWorldMap] = useState(false)
  const [showPlacesList, setShowPlacesList] = useState(false)
  const [showTripHistory, setShowTripHistory] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [locationSharingMode, setLocationSharingMode] = useState<"live" | "manual" | "disabled">("disabled")
  const [tripFilter, setTripFilter] = useState<"all" | "active" | "past" | "future" | "archived">("all")

  const [trips, setTrips] = useState<Trip[]>([])
  const [tripMembers, setTripMembers] = useState<TripMember[]>([])

  const [newTrip, setNewTrip] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
  })
  const [dateError, setDateError] = useState<string>("")
  const [tripNameError, setTripNameError] = useState<string>("")

  const validateTripName = (value: string) => {
    if (!value.trim()) {
      setTripNameError("Trip name is required")
      return false
    }
    if (value.trim().length < 3) {
      setTripNameError("Trip name must be at least 3 characters")
      return false
    }
    setTripNameError("")
    return true
  }

  const validateDates = (startDate: string, endDate: string) => {
    if (!startDate || !endDate) {
      setDateError("")
      return true
    }

    const start = new Date(startDate)
    const end = new Date(endDate)

    if (start >= end) {
      setDateError("End date must be after start date")
      return false
    }

    setDateError("")
    return true
  }

  const handleStartDateChange = (value: string) => {
    setNewTrip({ ...newTrip, startDate: value })
    validateDates(value, newTrip.endDate)
  }

  const handleEndDateChange = (value: string) => {
    setNewTrip({ ...newTrip, endDate: value })
    validateDates(newTrip.startDate, value)
  }

  const handleCreateTrip = () => {
    console.log("[v0] Creating new trip:", newTrip)

    // Validate required fields
    if (!validateTripName(newTrip.name)) {
      console.log("[v0] Trip name validation failed")
      return
    }

    if (!newTrip.startDate || !newTrip.endDate) {
      console.log("[v0] Missing dates")
      return
    }

    if (!validateDates(newTrip.startDate, newTrip.endDate)) {
      console.log("[v0] Date validation failed")
      return
    }

    // Generate new trip ID
    const newTripId = getNextTripId()
    console.log("[v0] Generated trip ID:", newTripId)

    // Create new trip object
    const createdTrip: Trip = {
      id: newTripId,
      name: newTrip.name,
      description: newTrip.description,
      startDate: newTrip.startDate,
      endDate: newTrip.endDate,
      coverImage: "/placeholder.svg?height=400&width=600",
      createdAt: new Date(),
      updatedAt: new Date(),
      isArchived: false,
    }

    console.log("[v0] Created trip object:", createdTrip)

    saveTrip(createdTrip)

    // Add trip to state
    setTrips([...trips, createdTrip])

    // Generate new membership ID
    const newMembershipId = getNextMemberId()

    // Create trip membership for current user as organizer
    const newMembership: TripMember = {
      id: newMembershipId,
      tripId: newTripId,
      userId: user!.id,
      role: "admin",
      joinedAt: new Date(),
    }

    console.log("[v0] Created membership:", newMembership)

    saveTripMember(newMembership)

    // Add membership to state
    setTripMembers([...tripMembers, newMembership])

    // Reset form
    setNewTrip({
      name: "",
      description: "",
      startDate: "",
      endDate: "",
    })

    console.log("[v0] Trip created successfully, closing dialog")

    // Close dialog
    setIsNewTripOpen(false)

    router.push(`/trip/${newTripId}`)
  }

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }

    setTrips(getAllTrips())
    setTripMembers(getAllTripMembers())

    // In a real app, this would come from the backend
    const savedLocationMode = localStorage.getItem("locationSharingMode") as "live" | "manual" | "disabled" | null
    if (savedLocationMode) {
      setLocationSharingMode(savedLocationMode)
    }
  }, [user, loading, router])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    // Implement actual search filtering
    console.log("[v0] Searching for:", query)
  }

  const getCurrentActivity = (tripId: string, types: Activity["type"][]) => {
    const tripActivities = mockActivities.filter((a) => a.tripId === tripId && types.includes(a.type))
    const now = new Date()

    // Find current or next upcoming activity
    return tripActivities
      .filter((a) => !a.scheduledFor || new Date(a.scheduledFor) >= now)
      .sort((a, b) => {
        if (!a.scheduledFor) return 1
        if (!b.scheduledFor) return -1
        return new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime()
      })[0]
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Plus className="h-12 w-12 text-accent mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const userTripMemberships = tripMembers.filter((member) => member.userId === user.id)
  const userTrips = trips.filter((trip) => userTripMemberships.some((member) => member.tripId === trip.id))
  const activeTrips = userTrips.filter((trip) => !trip.isArchived && new Date(trip.endDate) >= new Date())

  const userTripIds = userTrips.map((trip) => trip.id)
  const allFlights = mockActivities.filter(
    (activity) =>
      userTripIds.includes(activity.tripId) && activity.type === "transportation" && activity.metadata?.airline,
  )
  const totalFlights = allFlights.length

  const countriesVisited = [
    "France",
    "Italy",
    "Spain",
    "Japan",
    "USA",
    "UK",
    "Germany",
    "Australia",
    "Canada",
    "Mexico",
    "Brazil",
    "Thailand",
  ]
  const citiesVisited = 47

  const now = new Date()
  const filteredTrips = userTrips.filter((trip) => {
    const startDate = new Date(trip.startDate)
    const endDate = new Date(trip.endDate)

    switch (tripFilter) {
      case "archived":
        return trip.isArchived === true
      case "active":
        return !trip.isArchived && startDate <= now && endDate >= now
      case "past":
        return !trip.isArchived && endDate < now
      case "future":
        return !trip.isArchived && startDate > now
      case "all":
      default:
        return !trip.isArchived
    }
  })

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      <AppHeader user={user} title="TravelShare" showSearch onSearch={handleSearch} />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 pb-32 md:pb-8">
        {userTrips.length > 0 ? (
          <div className="space-y-3 mb-6 md:space-y-6 md:mb-8">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-xl font-semibold text-foreground">Active Trips</h3>
              <div className="hidden md:block">
                <LocationSharingButton mode={locationSharingMode} />
              </div>
            </div>
            {activeTrips.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
                {activeTrips.map((trip) => {
                  const membership = userTripMemberships.find((m) => m.tripId === trip.id)
                  const tripMembersForTrip = tripMembers.filter((m) => m.tripId === trip.id)

                  const currentHospitality = getCurrentActivity(trip.id, ["accommodation"])
                  const currentTransport = getCurrentActivity(trip.id, ["transportation"])
                  const nextActivity = getCurrentActivity(trip.id, ["sightseeing", "dining", "activity", "other"])

                  return (
                    <Card key={trip.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="max-h-[100px] md:aspect-video bg-muted relative overflow-hidden">
                        <img
                          src={trip.coverImage || "/placeholder.svg"}
                          alt={trip.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-1.5 right-1.5">
                          <span className="bg-background/80 text-xs px-1.5 py-0.5 rounded-full capitalize">
                            {membership?.role}
                          </span>
                        </div>
                      </div>
                      <CardHeader className="pb-0.5 pt-1.5 px-2.5">
                        <CardTitle className="text-base leading-tight">{trip.name}</CardTitle>
                        <CardDescription className="text-xs leading-tight">
                          {new Date(trip.startDate).toLocaleDateString()} -{" "}
                          {new Date(trip.endDate).toLocaleDateString()}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-0.5 px-2.5 pb-1.5">
                        {currentHospitality && (
                          <Link href={`/trip/${trip.id}`} className="block">
                            <div className="flex items-center gap-1.5 p-0.5 rounded-md bg-muted/50 hover:bg-muted transition-colors">
                              <Hotel className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-foreground truncate leading-tight">
                                  {currentHospitality.title}
                                </p>
                                <p className="text-xs text-muted-foreground leading-tight">Current stay</p>
                              </div>
                            </div>
                          </Link>
                        )}

                        {currentTransport && (
                          <Link href={`/trip/${trip.id}`} className="block">
                            <div className="flex items-center gap-1.5 p-0.5 rounded-md bg-muted/50 hover:bg-muted transition-colors">
                              <Plane className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-foreground truncate leading-tight">
                                  {currentTransport.title}
                                </p>
                                <p className="text-xs text-muted-foreground leading-tight">Transport</p>
                              </div>
                            </div>
                          </Link>
                        )}

                        {nextActivity && (
                          <Link href={`/trip/${trip.id}`} className="block">
                            <div className="flex items-center gap-1.5 p-0.5 rounded-md bg-muted/50 hover:bg-muted transition-colors">
                              <UtensilsCrossed className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-foreground truncate leading-tight">
                                  {nextActivity.title}
                                </p>
                                <p className="text-xs text-muted-foreground leading-tight">Next activity</p>
                              </div>
                            </div>
                          </Link>
                        )}

                        <div className="flex items-center justify-between text-xs text-muted-foreground pt-0.5 border-t">
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {tripMembersForTrip.length}
                          </span>
                          <Button variant="link" size="sm" className="h-auto p-0 text-xs" asChild>
                            <Link href={`/trip/${trip.id}`}>View details →</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            ) : (
              <Card className="relative overflow-hidden border-2 border-dashed">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5" />
                <CardContent className="relative py-4 px-4 md:py-6 md:px-6">
                  <div className="max-w-md mx-auto text-center space-y-4">
                    {/* Icon with animated background */}
                    <div className="relative inline-flex">
                      <div className="absolute inset-0 bg-accent/20 rounded-full blur-xl animate-pulse" />
                      <div className="relative bg-accent/10 p-4 md:p-6 rounded-full">
                        <Globe className="h-12 w-12 text-accent" />
                      </div>
                    </div>

                    {/* Heading and description */}
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-foreground">Ready for Your Next Adventure?</h3>
                      <p className="text-muted-foreground">
                        All your trips are complete! Time to explore new destinations and create unforgettable memories.
                      </p>
                    </div>

                    {/* CTA Button */}
                    <Button onClick={() => setIsNewTripOpen(true)} size="lg" className="w-full sm:w-auto">
                      <Plus className="h-5 w-5 mr-2" />
                      Plan Your Next Trip
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <Card className="relative overflow-hidden border-2 border-dashed mb-8">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5" />
            <CardContent className="relative py-6 px-4 md:py-8 md:px-6">
              <div className="max-w-lg mx-auto text-center space-y-6">
                {/* Icon with animated background */}
                <div className="relative inline-flex">
                  <div className="absolute inset-0 bg-accent/20 rounded-full blur-2xl animate-pulse" />
                  <div className="relative bg-accent/10 p-4 md:p-6 rounded-full">
                    <Globe className="h-14 w-14 text-accent" />
                  </div>
                </div>

                {/* Heading and description */}
                <div className="space-y-3">
                  <h2 className="text-3xl font-bold text-foreground">Start Your Travel Journey</h2>
                  <p className="text-lg text-muted-foreground">
                    Create your first trip and begin planning unforgettable adventures with friends and family.
                  </p>
                </div>

                {/* Benefits */}
                <div className="grid sm:grid-cols-3 gap-4 pt-4">
                  <div className="p-4 rounded-lg bg-background/50 border border-border/50">
                    <Calendar className="h-6 w-6 text-accent mx-auto mb-2" />
                    <p className="text-sm font-medium mb-1">Plan Together</p>
                    <p className="text-xs text-muted-foreground">Collaborate on itineraries</p>
                  </div>
                  <div className="p-4 rounded-lg bg-background/50 border border-border/50">
                    <Users className="h-6 w-6 text-accent mx-auto mb-2" />
                    <p className="text-sm font-medium mb-1">Share Updates</p>
                    <p className="text-xs text-muted-foreground">Keep everyone in the loop</p>
                  </div>
                  <div className="p-4 rounded-lg bg-background/50 border border-border/50">
                    <Globe className="h-6 w-6 text-accent mx-auto mb-2" />
                    <p className="text-sm font-medium mb-1">Track Memories</p>
                    <p className="text-xs text-muted-foreground">Save your adventures</p>
                  </div>
                </div>

                {/* CTA Button */}
                <Button onClick={() => setIsNewTripOpen(true)} size="lg" className="text-base px-8">
                  <Plus className="h-5 w-5 mr-2" />
                  Create Your First Trip
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-6 mb-8">
          <h3 className="text-xl font-semibold text-foreground">Your Travel Stats</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="relative overflow-hidden flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">All Trips</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <div className="flex items-baseline gap-2">
                  <div className="text-2xl font-bold">{userTrips.length}</div>
                  <p className="text-sm text-muted-foreground">{activeTrips.length} active</p>
                </div>
                <Button
                  variant="link"
                  size="sm"
                  className="h-auto p-0 text-xs mt-2 justify-start"
                  onClick={() => setShowTripHistory(true)}
                >
                  View All Trips →
                </Button>
              </CardContent>
            </Card>

            <Card className="flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Trip Members</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <div className="flex items-baseline gap-2">
                  <div className="text-2xl font-bold">
                    {userTripMemberships.reduce((acc, membership) => {
                      const tripMembersForTrip = tripMembers.filter((m) => m.tripId === membership.tripId)
                      return acc + tripMembersForTrip.length
                    }, 0)}
                  </div>
                  <p className="text-sm text-muted-foreground">members</p>
                </div>
                <Button variant="link" size="sm" className="h-auto p-0 text-xs mt-2 justify-start" asChild>
                  <Link href="/members">See members →</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Places Visited</CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <div className="flex items-baseline gap-2">
                  <div className="text-2xl font-bold">{citiesVisited}</div>
                  <p className="text-sm text-muted-foreground">cities</p>
                </div>
                <Button
                  variant="link"
                  size="sm"
                  className="h-auto p-0 text-xs mt-2 justify-start"
                  onClick={() => setShowPlacesList(true)}
                >
                  View list →
                </Button>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Flights</CardTitle>
                <Plane className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <div className="flex items-baseline gap-2">
                  <div className="text-2xl font-bold">{totalFlights}</div>
                  <p className="text-sm text-muted-foreground">total flights</p>
                </div>
                <Button variant="link" size="sm" className="h-auto p-0 text-xs mt-2 justify-start" asChild>
                  <Link href="/flights-stats">See all flights stats →</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-6 mb-8">
          <h3 className="text-xl font-semibold text-foreground">Travel Map</h3>
          <TravelMap activities={mockActivities.filter((a) => userTripIds.includes(a.tripId))} />
        </div>
      </main>

      {/* Floating Add button for desktop */}
      <div className="hidden md:flex fixed right-8 bottom-8 z-40">
        <Button
          onClick={() => setIsAddActivityOpen(true)}
          size="lg"
          className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      {/* Floating Search Mobile now only shows on mobile (< 768px), tablets use top bar search */}
      <FloatingSearchMobile onSearch={handleSearch} onAddClick={() => setIsAddActivityOpen(true)} />

      <AddActivityDialog
        open={isAddActivityOpen}
        onOpenChange={setIsAddActivityOpen}
        onCreateTrip={() => setIsNewTripOpen(true)}
      />

      {/* New Trip Modal */}
      <Dialog open={isNewTripOpen} onOpenChange={setIsNewTripOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Trip</DialogTitle>
            <DialogDescription>Plan your next adventure by creating a new trip itinerary.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="trip-name">
                Trip Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="trip-name"
                placeholder="e.g., European Adventure"
                value={newTrip.name}
                onChange={(e) => {
                  setNewTrip({ ...newTrip, name: e.target.value })
                  if (tripNameError) setTripNameError("")
                }}
                onBlur={() => validateTripName(newTrip.name)}
                className={tripNameError ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              {tripNameError && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-md p-2 text-xs text-destructive">
                  {tripNameError}
                </div>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="trip-description">Description</Label>
              <Textarea
                id="trip-description"
                placeholder="Describe your trip..."
                value={newTrip.description}
                onChange={(e) => setNewTrip({ ...newTrip, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="start-date">
                  Start Date <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="start-date"
                  type="date"
                  value={newTrip.startDate}
                  onChange={(e) => handleStartDateChange(e.target.value)}
                  className={dateError ? "border-destructive focus-visible:ring-destructive" : ""}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="end-date">
                  End Date <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="end-date"
                  type="date"
                  value={newTrip.endDate}
                  onChange={(e) => handleEndDateChange(e.target.value)}
                  className={dateError ? "border-destructive focus-visible:ring-destructive" : ""}
                />
              </div>
            </div>
            {dateError && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3 text-sm text-destructive">
                {dateError}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewTripOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTrip} disabled={!!dateError || !!tripNameError}>
              Create Trip
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Places List Modal */}
      <Dialog open={showPlacesList} onOpenChange={setShowPlacesList}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Places You've Visited</DialogTitle>
            <DialogDescription>Explore the countries and cities from your travels</DialogDescription>
          </DialogHeader>
          <PlacesListView
            onSwitchToMap={() => {
              setShowPlacesList(false)
              setShowWorldMap(true)
            }}
          />
        </DialogContent>
      </Dialog>

      {/* World Map Modal */}
      <Dialog open={showWorldMap} onOpenChange={setShowWorldMap}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Countries You've Visited</DialogTitle>
            <DialogDescription>Explore the countries from your travels</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowWorldMap(false)
                  setShowPlacesList(true)
                }}
              >
                Switch to list view
              </Button>
            </div>

            <div className="aspect-[2/1] bg-muted rounded-lg overflow-hidden">
              <img
                src="/placeholder.svg?height=400&width=800"
                alt="World map with visited countries"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-60 overflow-y-auto">
              {countriesVisited.map((country, index) => (
                <div key={country} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                  <span className="text-sm font-medium">{country}</span>
                  <span className="text-xs text-muted-foreground">{Math.floor(Math.random() * 5) + 1}x</span>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Trip History Modal */}
      <Dialog open={showTripHistory} onOpenChange={setShowTripHistory}>
        <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Trip History</DialogTitle>
            <DialogDescription>
              All your trips ({userTrips.filter((t) => !t.isArchived).length} active
              {userTrips.filter((t) => t.isArchived).length > 0 &&
                `, ${userTrips.filter((t) => t.isArchived).length} archived`}
              )
            </DialogDescription>
          </DialogHeader>
          <Tabs
            value={tripFilter}
            onValueChange={(value) => setTripFilter(value as typeof tripFilter)}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Current</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
              <TabsTrigger value="future">Future</TabsTrigger>
              <TabsTrigger value="archived">
                <Archive className="h-3 w-3 mr-1" />
                Archived
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="overflow-y-auto pr-2 -mr-2 py-2">
            <div className="space-y-4">
              {filteredTrips.length > 0 ? (
                filteredTrips.map((trip) => {
                  const membership = userTripMemberships.find((m) => m.tripId === trip.id)
                  const tripMembersForTrip = tripMembers.filter((m) => m.tripId === trip.id)
                  const isPast = new Date(trip.endDate) < new Date()
                  const isArchived = trip.isArchived === true

                  return (
                    <Link key={trip.id} href={`/trip/${trip.id}`} className="block mb-4">
                      <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <div className="flex gap-4 p-4">
                          <div className="w-24 h-24 flex-shrink-0 bg-muted rounded-lg overflow-hidden">
                            <img
                              src={trip.coverImage || "/placeholder.svg"}
                              alt={trip.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-foreground truncate">{trip.name}</h3>
                                <p className="text-sm text-muted-foreground truncate">{trip.description}</p>
                              </div>
                              <span
                                className={`text-xs px-2 py-1 rounded-full capitalize flex-shrink-0 ${
                                  isArchived
                                    ? "bg-muted text-muted-foreground border border-border"
                                    : isPast
                                      ? "bg-muted text-muted-foreground"
                                      : "bg-accent/10 text-accent"
                                }`}
                              >
                                {isArchived ? (
                                  <span className="flex items-center gap-1">
                                    <Archive className="h-3 w-3" />
                                    Archived
                                  </span>
                                ) : isPast ? (
                                  "Completed"
                                ) : (
                                  "Active"
                                )}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground flex-wrap">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(trip.startDate).toLocaleDateString()} -{" "}
                                {new Date(trip.endDate).toLocaleDateString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {tripMembersForTrip.length} members
                              </span>
                              <span className="capitalize">{membership?.role}</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  )
                })
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No {tripFilter !== "all" ? tripFilter : ""} trips found</p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
