"use client"
export const runtime = 'edge'

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { useLocation } from "@/hooks/use-location"
import { TimelineFeed } from "@/components/timeline/timeline-feed"
import { ViewAsSelector } from "@/components/admin/view-as-selector"
import { FloatingActionButton } from "@/components/ui/floating-action-button"
import { FloatingSearchMobile } from "@/components/ui/floating-search-mobile"
import { AppHeader } from "@/components/ui/app-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Settings, Users, Calendar, Eye, Plus, UserPlus, X, Info, Upload } from "lucide-react"
import { mockActivities, mockUsers, mockLocationUpdates, mockComments, mockReactions } from "@/lib/mock-data"
import { getAllTrips, getAllTripMembers, updateTrip, deleteTrip } from "@/lib/trips-storage"
import { getDayNotesByTripId, saveDayNote, deleteDayNote } from "@/lib/day-notes-storage"
import type { Trip, Activity, User, TripMember, LocationUpdate, Comment, Reaction } from "@/lib/types"
import type { DayNote } from "@/lib/types"
import { LocationSettingsCard } from "@/components/location/location-settings-card"
import { TripDetailsCard } from "@/components/trip-details-card"
import { TripDangerZoneCard } from "@/components/trip-danger-zone-card"
import { AddActivityDialog } from "@/components/add-activity-dialog"
import { FlightForm } from "@/components/forms/flight-form"
import { CarRentalForm } from "@/components/forms/car-rental-form"
import { HotelForm } from "@/components/forms/hotel-form"
import { RestaurantForm } from "@/components/forms/restaurant-form"

interface TripPageProps {
  params: {
    id: string
  }
}

type UserRole = "admin" | "participant" | "commentor" | "viewer"

export default function TripPage({ params }: TripPageProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [trip, setTrip] = useState<Trip | null>(null)
  const [activities, setActivities] = useState<Activity[]>([])
  const [tripMembers, setTripMembers] = useState<TripMember[]>([])
  const [memberUsers, setMemberUsers] = useState<User[]>([])
  const [locationUpdates, setLocationUpdates] = useState<LocationUpdate[]>([])
  const [currentUserLocation, setCurrentUserLocation] = useState<{ lat: number; lng: number } | undefined>()
  const [comments, setComments] = useState<Comment[]>([])
  const [reactions, setReactions] = useState<Reaction[]>([])
  const [dayNotes, setDayNotes] = useState<DayNote[]>([])
  const [viewAsRole, setViewAsRole] = useState<UserRole | null>(null)
  const [activeTab, setActiveTab] = useState("timeline")
  const [showActivityDialog, setShowActivityDialog] = useState(false)
  const [showAddActivity, setShowAddActivity] = useState(false)
  const [showAddNote, setShowAddNote] = useState(false)
  const [noteImages, setNoteImages] = useState<string[]>([])
  const [selectedActivityType, setSelectedActivityType] = useState<string>("")
  const [activityTitleError, setActivityTitleError] = useState<string>("")
  const [activityTypeError, setActivityTypeError] = useState<string>("")
  const [showManageMembers, setShowManageMembers] = useState(false)
  const [newMemberEmail, setNewMemberEmail] = useState("")
  const [emailError, setEmailError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const { location, requestLocation, isSupported } = useLocation()

  const liveLocationRef = useRef<HTMLDivElement>(null)

  const validateActivityTitle = (value: string) => {
    if (!value.trim()) {
      setActivityTitleError("Activity title is required")
      return false
    }
    if (value.trim().length < 3) {
      setActivityTitleError("Activity title must be at least 3 characters")
      return false
    }
    setActivityTitleError("")
    return true
  }

  const validateActivityType = (value: string) => {
    if (!value) {
      setActivityTypeError("Activity type is required")
      return false
    }
    setActivityTypeError("")
    return true
  }

  const handleRoleChange = (memberId: string, newRole: "admin" | "participant" | "commentor" | "viewer") => {
    setTripMembers((prev) => prev.map((member) => (member.id === memberId ? { ...member, role: newRole } : member)))
  }

  const handleRemoveMember = (memberId: string) => {
    setTripMembers((prev) => prev.filter((member) => member.id !== memberId))
    const removedMember = tripMembers.find((m) => m.userId === memberId)
    if (removedMember) {
      setMemberUsers((prev) => prev.filter((u) => u.id !== removedMember.userId))
    }
  }

  const handleAddMember = () => {
    if (!newMemberEmail.trim()) {
      setEmailError("Email is required")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(newMemberEmail)) {
      setEmailError("Please enter a valid email address")
      return
    }

    const existingUser = mockUsers.find((u) => u.email === newMemberEmail)

    if (existingUser) {
      // User exists in the system
      const alreadyMember = tripMembers.find((m) => m.tripId === params.id && m.userId === existingUser.id)
      if (alreadyMember) {
        setEmailError("This user is already a member of this trip")
        return
      }

      // Add existing user to trip
      const newMember: TripMember = {
        id: `member-${Date.now()}`,
        tripId: params.id,
        userId: existingUser.id,
        role: "participant",
        joinedAt: new Date(),
      }

      setTripMembers((prev) => [...prev, newMember])
      setMemberUsers((prev) => [...prev, existingUser])

      toast({
        title: "Member added",
        description: `${existingUser.name} has been added to the trip.`,
      })
    } else {
      // User doesn't exist - send invitation
      // In a real app, this would send an email invitation
      console.log(`[v0] Sending invitation to ${newMemberEmail}`)

      toast({
        title: "Invitation sent",
        description: `Invitation sent to ${newMemberEmail}! They will be added to the trip once they accept.`,
      })
    }

    setNewMemberEmail("")
    setEmailError("")
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const filteredActivities = searchQuery
    ? activities.filter(
        (activity) =>
          activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          activity.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          activity.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          activity.type.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : activities

  const filteredMemberUsers = searchQuery
    ? memberUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : memberUsers

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
      return
    }

    const allTrips = getAllTrips()
    const foundTrip = allTrips.find((t) => t.id === params.id)

    if (!foundTrip) {
      console.log("[v0] Trip not found:", params.id)
      router.push("/dashboard")
      return
    }

    const allTripMembers = getAllTripMembers()
    const userMembership = allTripMembers.find((m) => m.tripId === params.id && m.userId === user?.id)

    if (!userMembership) {
      console.log("[v0] User is not a member of this trip")
      router.push("/dashboard")
      return
    }

    console.log("[v0] Loaded trip:", foundTrip)
    setTrip(foundTrip)

    const tripActivities = mockActivities.filter((a) => a.tripId === params.id)
    console.log("[v0] Loaded activities:", tripActivities.length, "activities for trip", params.id)
    console.log("[v0] Activity types:", tripActivities.map((a) => a.type).join(", "))
    setActivities(tripActivities)

    const members = allTripMembers.filter((m) => m.tripId === params.id)
    setTripMembers(members)

    const memberUserIds = members.map((m) => m.userId)
    const memberUserDetails = mockUsers.filter((u) => memberUserIds.includes(u.id))
    setMemberUsers(memberUserDetails)

    const tripLocationUpdates = mockLocationUpdates.filter((l) => l.tripId === params.id)
    setLocationUpdates(tripLocationUpdates)

    const activityIds = tripActivities.map((a) => a.id)
    const tripComments = mockComments.filter((c) => activityIds.includes(c.activityId))
    const tripReactions = mockReactions.filter((r) => activityIds.includes(r.activityId))
    setComments(tripComments)
    setReactions(tripReactions)

    const tripDayNotes = getDayNotesByTripId(params.id)
    setDayNotes(tripDayNotes)
    console.log("[v0] Loaded day notes:", tripDayNotes)

    setTimeout(() => {
      const liveLocationElement = document.getElementById("live-location-card")
      if (liveLocationElement) {
        liveLocationElement.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }, 500)
  }, [params.id, user, loading, router])

  const handleAddComment = (activityId: string, content: string) => {
    if (!user) return

    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      activityId,
      userId: user.id,
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    setComments((prev) => [...prev, newComment])
  }

  const handleDeleteComment = (commentId: string) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId))
  }

  const handleAddReaction = (activityId: string, emoji: string) => {
    if (!user) return

    const newReaction: Reaction = {
      id: `reaction-${Date.now()}`,
      activityId,
      userId: user.id,
      emoji,
      createdAt: new Date(),
    }

    setReactions((prev) => [...prev, newReaction])
  }

  const handleRemoveReaction = (reactionId: string) => {
    setReactions((prev) => prev.filter((r) => r.id !== reactionId))
  }

  const handleSaveDayNote = (date: string, content: string) => {
    if (!user) return

    try {
      const savedNote = saveDayNote(params.id, date, user.id, content)
      setDayNotes((prev) => {
        const existingIndex = prev.findIndex((n) => n.date === date)
        if (existingIndex >= 0) {
          const updated = [...prev]
          updated[existingIndex] = savedNote
          return updated
        }
        return [...prev, savedNote]
      })

      toast({
        title: "Note saved",
        description: "Your day note has been saved successfully",
      })

      console.log("[v0] Day note saved:", savedNote)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save day note",
        variant: "destructive",
      })
      console.error("[v0] Error saving day note:", error)
    }
  }

  const handleDeleteDayNote = (noteId: string) => {
    try {
      const success = deleteDayNote(noteId)
      if (success) {
        setDayNotes((prev) => prev.filter((n) => n.id !== noteId))
        toast({
          title: "Note deleted",
          description: "Your day note has been deleted",
        })
        console.log("[v0] Day note deleted:", noteId)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete day note",
        variant: "destructive",
      })
      console.error("[v0] Error deleting day note:", error)
    }
  }

  const handleAddActivity = () => {
    console.log("[v0] Add activity clicked")
    setShowActivityDialog(true)
  }

  const handleAddNote = () => {
    console.log("[v0] Add note clicked")
    setShowAddNote(true)
    // Auto-populate location if supported
    if (isSupported) {
      requestLocation()
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newImages: string[] = []
    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        newImages.push(reader.result as string)
        if (newImages.length === files.length) {
          setNoteImages((prev) => [...prev, ...newImages])
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const handleCreateNote = (noteData: {
    title?: string
    description: string
    location?: string
    images?: string[]
  }) => {
    if (!user) return

    const now = new Date()

    const newActivity: Activity = {
      id: `activity-${Date.now()}`,
      tripId: params.id,
      title: noteData.title || "Note",
      description: noteData.description,
      type: "note",
      status: "completed",
      scheduledFor: now,
      startTime: now,
      location: noteData.location,
      images: noteData.images || [],
      createdBy: user.id,
      createdAt: now,
      updatedAt: new Date(),
      metadata: {
        autoLocation: !!location,
        capturedAt: now,
      },
    }

    setActivities((prev) => [...prev, newActivity])
    setShowAddNote(false)
    setNoteImages([])

    toast({
      title: "Note added",
      description: "Your note has been added to the timeline",
    })
  }

  const handleCreateActivity = (activityData: {
    title: string
    description?: string
    scheduledFor?: Date
    location?: string
    type: string
    metadata?: any
    startTime?: Date
    endTime?: Date
  }) => {
    const isTitleValid = validateActivityTitle(activityData.title)
    const isTypeValid = validateActivityType(activityData.type)

    if (!isTitleValid || !isTypeValid) {
      return
    }

    if (!user) return

    const newActivity: Activity = {
      id: `activity-${Date.now()}`,
      tripId: params.id,
      title: activityData.title,
      description: activityData.description || "",
      type: activityData.type as Activity["type"],
      status: "planned",
      scheduledFor: activityData.scheduledFor,
      location: activityData.location,
      createdBy: user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      metadata: activityData.metadata,
      startTime: activityData.startTime,
      endTime: activityData.endTime,
      images: [],
    }

    setActivities((prev) => [...prev, newActivity])
    setShowAddActivity(false)
  }

  const handleLocationUpdate = (location: { lat: number; lng: number }) => {
    setCurrentUserLocation(location)
  }

  const handleUpdateTrip = (updates: Partial<Trip>) => {
    if (!trip) return

    updateTrip(params.id, updates)
    setTrip((prev) => (prev ? { ...prev, ...updates } : null))
  }

  const handleSaveLocationPermissions = (permissions: any) => {
    if (!trip) return

    updateTrip(params.id, { locationPermissions: permissions })
    setTrip((prev) => (prev ? { ...prev, locationPermissions: permissions } : null))
  }

  const handleDeleteTrip = () => {
    deleteTrip(params.id)
    toast({
      title: "Trip deleted",
      description: "Your trip has been permanently deleted.",
    })
    router.push("/dashboard")
  }

  const handleArchiveTrip = () => {
    if (!trip) return

    updateTrip(params.id, { isArchived: true })
    toast({
      title: "Trip archived",
      description: "Your trip has been archived successfully.",
    })
    router.push("/dashboard")
  }

  const handleActivityTypeSelected = (type: string) => {
    console.log("[v0] Activity type selected:", type)
    setSelectedActivityType(type)
    setShowAddActivity(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <MapPin className="h-12 w-12 text-accent mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading trip...</p>
        </div>
      </div>
    )
  }

  if (!trip || !user) {
    return null
  }

  const userMembership = tripMembers.find((m) => m.userId === user.id)
  const isAdmin = userMembership?.role === "admin"

  const effectiveRole = viewAsRole || userMembership?.role || "viewer"
  const canEdit = effectiveRole === "admin" || effectiveRole === "participant"
  const canComment = effectiveRole !== "viewer"
  const canManageTrip = effectiveRole === "admin"

  console.log("[v0] User membership:", userMembership)
  console.log("[v0] Effective role:", effectiveRole)
  console.log("[v0] Can edit:", canEdit)
  console.log("[v0] Can manage trip:", canManageTrip)

  return (
    <div className="min-h-screen bg-background">
      {viewAsRole && isAdmin && (
        <div className="w-full bg-blue-50 border-b border-blue-200">
          <div className="container mx-auto px-4 py-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-blue-800">
                  You're viewing this trip as a <strong>{viewAsRole}</strong>. Some features may be hidden or disabled
                  to match their experience.
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="bg-white border-blue-300 text-blue-700 hover:bg-blue-50 hover:text-blue-800 self-start sm:self-auto"
                onClick={() => setViewAsRole(null)}
              >
                Exit preview mode
              </Button>
            </div>
          </div>
        </div>
      )}

      <AppHeader
        user={user}
        title={trip.name}
        showBack
        showSearch
        onSearch={handleSearch}
        rightContent={
          <>
            {isAdmin && !viewAsRole && (
              <ViewAsSelector currentRole={userMembership?.role || "viewer"} onRoleChange={setViewAsRole} />
            )}
            {canManageTrip && (
              <Button variant="outline" size="sm" asChild>
                <Link href={`/trip/${params.id}/settings`}>
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Link>
              </Button>
            )}
          </>
        }
      />

      <div className="container mx-auto px-4 py-4">
        <div>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 lg:h-12 mb-6">
              <TabsTrigger value="timeline" className="flex items-center gap-2 lg:text-base">
                <Calendar className="h-4 w-4" />
                Timeline
              </TabsTrigger>
              <TabsTrigger value="details" className="flex items-center gap-2 lg:text-base">
                <Info className="h-4 w-4" />
                Trip Details
              </TabsTrigger>
            </TabsList>

            <TabsContent value="timeline">
              {searchQuery && (
                <div className="mb-4 text-sm text-muted-foreground">
                  Found {filteredActivities.length} {filteredActivities.length === 1 ? "activity" : "activities"}{" "}
                  matching "{searchQuery}"
                </div>
              )}
              <TimelineFeed
                activities={filteredActivities}
                users={memberUsers}
                currentUser={user}
                comments={comments}
                reactions={reactions}
                dayNotes={dayNotes}
                tripId={params.id}
                locationUpdates={locationUpdates}
                currentUserLocation={currentUserLocation}
                onLocationUpdate={handleLocationUpdate}
                canShareLocation={canEdit}
                onAddComment={canComment ? handleAddComment : undefined}
                onDeleteComment={canComment ? handleDeleteComment : undefined}
                onAddReaction={canComment ? handleAddReaction : undefined}
                onRemoveReaction={canComment ? handleRemoveReaction : undefined}
                onSaveDayNote={canComment ? handleSaveDayNote : undefined}
                onDeleteDayNote={canComment ? handleDeleteDayNote : undefined}
                onAddActivity={canEdit ? handleAddActivity : undefined}
                showShare={true}
              />
            </TabsContent>

            <TabsContent value="details" className="space-y-6">
              <TripDetailsCard
                trip={trip}
                memberCount={tripMembers.length}
                userRole={effectiveRole}
                canEdit={canManageTrip}
                onUpdate={handleUpdateTrip}
                onDelete={handleDeleteTrip}
                onArchive={handleArchiveTrip}
              />

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Members ({searchQuery ? filteredMemberUsers.length : tripMembers.length})
                    </CardTitle>
                    {canManageTrip && (
                      <Button variant="ghost" size="sm" onClick={() => setShowManageMembers(true)}>
                        <Settings className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {(searchQuery ? filteredMemberUsers : memberUsers).map((memberUser) => {
                      const member = tripMembers.find((m) => m.userId === memberUser.id)
                      if (!member) return null

                      const recentLocation = locationUpdates.find(
                        (l) => l.userId === member.userId && Date.now() - l.timestamp.getTime() < 30 * 60 * 1000,
                      )

                      return (
                        <div key={member.id} className="flex items-center gap-3">
                          <div className="relative">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={memberUser.avatar || "/placeholder.svg"} alt={memberUser.name} />
                              <AvatarFallback className="text-xs">{memberUser.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            {recentLocation && (
                              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-accent rounded-full border border-background"></div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{memberUser.name}</p>
                            <p className="text-xs text-muted-foreground truncate">
                              {recentLocation ? "Location active" : memberUser.email}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                    {searchQuery && filteredMemberUsers.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No members found matching "{searchQuery}"
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Trip Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Activities</span>
                    <span className="text-sm font-medium text-foreground">{activities.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Completed</span>
                    <span className="text-sm font-medium text-foreground">
                      {activities.filter((a) => a.status === "completed").length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Upcoming</span>
                    <span className="text-sm font-medium text-foreground">
                      {activities.filter((a) => a.status === "planned").length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Comments</span>
                    <span className="text-sm font-medium text-foreground">{comments.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Reactions</span>
                    <span className="text-sm font-medium text-foreground">{reactions.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Active Locations</span>
                    <span className="text-sm font-medium text-foreground">
                      {locationUpdates.filter((l) => Date.now() - l.timestamp.getTime() < 30 * 60 * 1000).length}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {(effectiveRole === "admin" || effectiveRole === "participant") && (
                <LocationSettingsCard
                  tripId={params.id}
                  initialPermissions={trip.locationPermissions}
                  onSave={handleSaveLocationPermissions}
                />
              )}

              {canManageTrip && (
                <TripDangerZoneCard trip={trip} onDelete={handleDeleteTrip} onArchive={handleArchiveTrip} />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <FloatingSearchMobile onSearch={handleSearch} className="md:hidden" />

      {canEdit && activeTab === "timeline" && (
        <FloatingActionButton
          onClick={handleAddActivity}
          icon={<Plus className="h-6 w-6" />}
          label="Add new activity"
        />
      )}

      <AddActivityDialog
        open={showActivityDialog}
        onOpenChange={setShowActivityDialog}
        onCreateNote={handleAddNote}
        onCreateActivity={handleActivityTypeSelected}
      />

      {showAddActivity && selectedActivityType === "flight" && (
        <Dialog open={showAddActivity} onOpenChange={setShowAddActivity}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Flight</DialogTitle>
            </DialogHeader>
            <FlightForm
              onSubmit={(data) => {
                handleCreateActivity({
                  ...data,
                  type: "transportation",
                })
              }}
              onCancel={() => {
                setShowAddActivity(false)
                setSelectedActivityType("")
              }}
            />
          </DialogContent>
        </Dialog>
      )}

      {showAddActivity && selectedActivityType === "car-rental" && (
        <Dialog open={showAddActivity} onOpenChange={setShowAddActivity}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Car Rental</DialogTitle>
            </DialogHeader>
            <CarRentalForm
              onSubmit={(data) => {
                handleCreateActivity({
                  ...data,
                  type: "transportation",
                })
              }}
              onCancel={() => {
                setShowAddActivity(false)
                setSelectedActivityType("")
              }}
            />
          </DialogContent>
        </Dialog>
      )}

      {showAddActivity && selectedActivityType === "accommodation" && (
        <Dialog open={showAddActivity} onOpenChange={setShowAddActivity}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Accommodation</DialogTitle>
            </DialogHeader>
            <HotelForm
              onSubmit={(data) => {
                handleCreateActivity({
                  ...data,
                  type: "accommodation",
                })
              }}
              onCancel={() => {
                setShowAddActivity(false)
                setSelectedActivityType("")
              }}
            />
          </DialogContent>
        </Dialog>
      )}

      {showAddActivity && selectedActivityType === "dining" && (
        <Dialog open={showAddActivity} onOpenChange={setShowAddActivity}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Restaurant Reservation</DialogTitle>
            </DialogHeader>
            <RestaurantForm
              onSubmit={(data) => {
                handleCreateActivity({
                  ...data,
                  type: "dining",
                })
              }}
              onCancel={() => {
                setShowAddActivity(false)
                setSelectedActivityType("")
              }}
            />
          </DialogContent>
        </Dialog>
      )}

      {showAddActivity &&
        selectedActivityType !== "transportation" &&
        selectedActivityType !== "flight" &&
        selectedActivityType !== "car-rental" &&
        selectedActivityType !== "accommodation" &&
        selectedActivityType !== "dining" && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-card rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">Add New Activity</h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    const formData = new FormData(e.currentTarget)
                    const title = formData.get("title") as string
                    const type = formData.get("type") as string

                    const isTitleValid = validateActivityTitle(title)
                    const isTypeValid = validateActivityType(type)

                    if (!isTitleValid || !isTypeValid) {
                      return
                    }

                    const scheduledDate = formData.get("date") as string
                    const scheduledTime = formData.get("time") as string

                    let scheduledFor: Date | undefined
                    if (scheduledDate && scheduledTime) {
                      scheduledFor = new Date(`${scheduledDate}T${scheduledTime}`)
                    } else if (scheduledDate) {
                      scheduledFor = new Date(scheduledDate)
                    }

                    const activityData: any = {
                      title,
                      description: formData.get("description") as string,
                      location: formData.get("location") as string,
                      type,
                      scheduledFor,
                    }

                    if (type === "accommodation") {
                      const checkInDate = formData.get("checkInDate") as string
                      const checkInTime = formData.get("checkInTime") as string
                      const checkOutDate = formData.get("checkOutDate") as string
                      const checkOutTime = formData.get("checkOutTime") as string

                      activityData.metadata = {
                        hotelName: title,
                        checkInDate,
                        checkInTime,
                        checkOutDate,
                        checkOutTime,
                      }

                      if (checkInDate && checkInTime) {
                        activityData.startTime = new Date(`${checkInDate}T${checkInTime}`)
                      }
                      if (checkOutDate && checkOutTime) {
                        activityData.endTime = new Date(`${checkOutDate}T${checkOutTime}`)
                      }
                    }

                    handleCreateActivity(activityData)

                    setActivityTitleError("")
                    setActivityTypeError("")
                    setSelectedActivityType("")
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium mb-1">
                      Activity Title <span className="text-destructive">*</span>
                    </label>
                    <input
                      id="title"
                      name="title"
                      type="text"
                      required
                      className={`w-full px-3 py-2 border rounded-md bg-background ${
                        activityTitleError ? "border-destructive focus:ring-destructive" : "border-border"
                      }`}
                      placeholder="e.g., Visit Eiffel Tower"
                      onBlur={(e) => validateActivityTitle(e.target.value)}
                      onChange={() => {
                        if (activityTitleError) setActivityTitleError("")
                      }}
                    />
                    {activityTitleError && (
                      <div className="bg-destructive/10 border border-destructive/20 rounded-md p-2 text-xs text-destructive mt-1">
                        {activityTitleError}
                      </div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="type" className="block text-sm font-medium mb-1">
                      Activity Type <span className="text-destructive">*</span>
                    </label>
                    <select
                      id="type"
                      name="type"
                      required
                      defaultValue={selectedActivityType}
                      className={`w-full px-3 py-2 border rounded-md bg-background ${
                        activityTypeError ? "border-destructive focus:ring-destructive" : "border-border"
                      }`}
                      onBlur={(e) => validateActivityType(e.target.value)}
                      onChange={(e) => {
                        if (activityTypeError) setActivityTypeError("")
                        // Force re-render to show/hide accommodation fields
                        const form = e.target.form
                        if (form) {
                          const accommodationFields = form.querySelector("#accommodation-fields")
                          if (accommodationFields) {
                            if (e.target.value === "accommodation") {
                              ;(accommodationFields as HTMLElement).style.display = "block"
                            } else {
                              ;(accommodationFields as HTMLElement).style.display = "none"
                            }
                          }
                        }
                      }}
                    >
                      <option value="">Select a type</option>
                      <option value="sightseeing">Sightseeing</option>
                      <option value="dining">Dining</option>
                      <option value="accommodation">Accommodation</option>
                      <option value="transportation">Transportation</option>
                      <option value="activity">Experience</option>
                      <option value="other">Other</option>
                    </select>
                    {activityTypeError && (
                      <div className="bg-destructive/10 border border-destructive/20 rounded-md p-2 text-xs text-destructive mt-1">
                        {activityTypeError}
                      </div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium mb-1">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={3}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                      placeholder="Optional details about the activity..."
                    />
                  </div>

                  <div>
                    <label htmlFor="location" className="block text-sm font-medium mb-1">
                      Location
                    </label>
                    <input
                      id="location"
                      name="location"
                      type="text"
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                      placeholder="e.g., Paris, France"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="date" className="block text-sm font-medium mb-1">
                        Date
                      </label>
                      <input
                        id="date"
                        name="date"
                        type="date"
                        className="w-full px-3 py-2 border border-border rounded-md bg-background"
                      />
                    </div>
                    <div>
                      <label htmlFor="time" className="block text-sm font-medium mb-1">
                        Time
                      </label>
                      <input
                        id="time"
                        name="time"
                        type="time"
                        className="w-full px-3 py-2 border border-border rounded-md bg-background"
                      />
                    </div>
                  </div>

                  <div id="accommodation-fields" style={{ display: "none" }} className="space-y-4 pt-2 border-t">
                    <p className="text-sm font-medium text-muted-foreground">Accommodation Details</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="checkInDate" className="block text-sm font-medium mb-1">
                          Check-in Date
                        </label>
                        <input
                          id="checkInDate"
                          name="checkInDate"
                          type="date"
                          className="w-full px-3 py-2 border border-border rounded-md bg-background"
                        />
                      </div>
                      <div>
                        <label htmlFor="checkInTime" className="block text-sm font-medium mb-1">
                          Check-in Time
                        </label>
                        <input
                          id="checkInTime"
                          name="checkInTime"
                          type="time"
                          className="w-full px-3 py-2 border border-border rounded-md bg-background"
                          defaultValue="15:00"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="checkOutDate" className="block text-sm font-medium mb-1">
                          Check-out Date
                        </label>
                        <input
                          id="checkOutDate"
                          name="checkOutDate"
                          type="date"
                          className="w-full px-3 py-2 border border-border rounded-md bg-background"
                        />
                      </div>
                      <div>
                        <label htmlFor="checkOutTime" className="block text-sm font-medium mb-1">
                          Check-out Time
                        </label>
                        <input
                          id="checkOutTime"
                          name="checkOutTime"
                          type="time"
                          className="w-full px-3 py-2 border border-border rounded-md bg-background"
                          defaultValue="11:00"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowAddActivity(false)
                        setActivityTitleError("")
                        setActivityTypeError("")
                        setSelectedActivityType("")
                      }}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="flex-1" disabled={!!activityTitleError || !!activityTypeError}>
                      Add Activity
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

      {showAddNote && (
        <Dialog open={showAddNote} onOpenChange={setShowAddNote}>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Note</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                const title = formData.get("title") as string
                const description = formData.get("description") as string
                const locationInput = formData.get("location") as string

                if (!description.trim()) {
                  toast({
                    title: "Description required",
                    description: "Please add some content to your note",
                    variant: "destructive",
                  })
                  return
                }

                handleCreateNote({
                  title: title.trim() || undefined,
                  description,
                  location: locationInput,
                  images: noteImages,
                })
              }}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="note-title">Title (Optional)</Label>
                <Input id="note-title" name="title" type="text" placeholder="e.g., Beautiful sunset" className="mt-1" />
              </div>

              <div>
                <Label htmlFor="note-description">
                  Note <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="note-description"
                  name="description"
                  rows={4}
                  required
                  placeholder="What's happening?"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="note-location">Location</Label>
                <Input
                  id="note-location"
                  name="location"
                  type="text"
                  placeholder={
                    location ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}` : "Add location"
                  }
                  defaultValue={location ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}` : ""}
                  className="mt-1"
                />
                {location && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Location auto-populated from your current position
                  </p>
                )}
              </div>

              <div>
                <Label>Photos</Label>
                <div className="mt-1">
                  <label
                    htmlFor="note-images"
                    className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-accent hover:bg-accent/5 transition-colors"
                  >
                    <Upload className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Upload photos</span>
                    <input
                      id="note-images"
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
                {noteImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    {noteImages.map((image, index) => (
                      <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setNoteImages((prev) => prev.filter((_, i) => i !== index))}
                          className="absolute top-1 right-1 p-1 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                        >
                          <X className="h-3 w-3 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
                <p className="font-medium mb-1">Auto-populated:</p>
                <ul className="space-y-1">
                  <li>• Date & time: {new Date().toLocaleString()}</li>
                  {location && <li>• Location: From your current position</li>}
                </ul>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddNote(false)
                    setNoteImages([])
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Add Note
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {showManageMembers && (
        <Dialog open={showManageMembers} onOpenChange={setShowManageMembers}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Manage Members</DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Add New Member</h3>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      type="email"
                      placeholder="Enter email address"
                      value={newMemberEmail}
                      onChange={(e) => {
                        setNewMemberEmail(e.target.value)
                        if (emailError) setEmailError("")
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleAddMember()
                        }
                      }}
                      className={emailError ? "border-destructive focus:ring-destructive" : ""}
                    />
                    {emailError && (
                      <div className="bg-destructive/10 border border-destructive/20 rounded-md p-2 text-xs text-destructive mt-1">
                        {emailError}
                      </div>
                    )}
                  </div>
                  <Button onClick={handleAddMember} size="sm">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-medium">Current Members</h3>
                <div className="space-y-2">
                  {tripMembers.map((member) => {
                    const memberUser = memberUsers.find((u) => u.id === member.userId)
                    if (!memberUser) return null

                    const isCurrentUser = memberUser.id === user?.id

                    return (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-3 rounded-lg border border-border bg-card hover:bg-accent/5 transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={memberUser.avatar || "/placeholder.svg"} alt={memberUser.name} />
                            <AvatarFallback>{memberUser.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {memberUser.name}
                              {isCurrentUser && <span className="text-muted-foreground ml-1">(You)</span>}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">{memberUser.email}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Select
                            value={member.role}
                            onValueChange={(value) =>
                              handleRoleChange(member.id, value as "admin" | "participant" | "commentor" | "viewer")
                            }
                            disabled={isCurrentUser}
                          >
                            <SelectTrigger className="w-[130px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="participant">Participant</SelectItem>
                              <SelectItem value="commentor">Commentor</SelectItem>
                              <SelectItem value="viewer">Viewer</SelectItem>
                            </SelectContent>
                          </Select>

                          {!isCurrentUser && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveMember(member.id)}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button onClick={() => setShowManageMembers(false)}>Done</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
