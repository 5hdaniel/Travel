"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { TimelineFeed } from "@/components/timeline/timeline-feed"
import { TripDetailsCard } from "@/components/trip-details-card"
import { LocationSettingsCard } from "@/components/location/location-settings-card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FloatingActionButton } from "@/components/ui/floating-action-button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Users, Calendar, Info, Eye, Plus, ArrowLeft, Check, Circle } from "lucide-react"
import {
  mockTrips,
  mockActivities,
  mockUsers,
  mockTripMembers,
  mockLocationUpdates,
  mockComments,
  mockReactions,
} from "@/lib/mock-data"
import { getDayNotesByTripId } from "@/lib/day-notes-storage"

type UserRole = "admin" | "participant" | "commentor" | "viewer"

const permissions = [
  { name: "View trip details", admin: true, participant: true, commentor: true, viewer: true },
  { name: "Edit trip details", admin: true, participant: false, commentor: false, viewer: false },
  { name: "Add activities", admin: true, participant: true, commentor: false, viewer: false },
  { name: "Edit/delete activities", admin: true, participant: false, commentor: false, viewer: false },
  { name: "Manage members", admin: true, participant: false, commentor: false, viewer: false },
  { name: "Share live location", admin: "configurable", participant: "configurable", commentor: false, viewer: false },
  {
    name: "View others' locations",
    admin: "configurable",
    participant: "configurable",
    commentor: "configurable",
    viewer: "configurable",
  },
  { name: "Add comments", admin: true, participant: true, commentor: true, viewer: false },
  { name: "Add reactions", admin: true, participant: true, commentor: true, viewer: false },
  { name: "Add day notes", admin: true, participant: true, commentor: true, viewer: false },
]

const roleInfo = {
  admin: { title: "Admin", subtitle: "Trip Owner", badge: "default" as const },
  participant: { title: "Participant", subtitle: "Active Traveler", badge: "secondary" as const },
  commentor: { title: "Commentor", subtitle: "Can Engage", badge: "outline" as const },
  viewer: { title: "Viewer", subtitle: "Read Only", badge: "outline" as const },
}

const roles: UserRole[] = ["admin", "participant", "commentor", "viewer"]

export default function DemoPage() {
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState<UserRole>("admin")
  const [activeTab, setActiveTab] = useState("timeline")
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const minSwipeDistance = 50

  const trip = mockTrips.find((t) => t.id === "4")!
  const activities = mockActivities.filter((a) => a.tripId === "4")
  const tripMembers = mockTripMembers.filter((m) => m.tripId === "4")
  const memberUsers = mockUsers.filter((u) => tripMembers.some((m) => m.userId === u.id))
  const locationUpdates = mockLocationUpdates.filter((l) => l.tripId === "4")
  const activityIds = activities.map((a) => a.id)
  const comments = mockComments.filter((c) => activityIds.includes(c.activityId))
  const reactions = mockReactions.filter((r) => activityIds.includes(r.activityId))
  const dayNotes = getDayNotesByTripId("4")

  const currentUser = mockUsers[0] // John Smith

  const canEdit = selectedRole === "admin" || selectedRole === "participant"
  const canComment = selectedRole !== "viewer"
  const canManageTrip = selectedRole === "admin"

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe || isRightSwipe) {
      const currentIndex = roles.indexOf(selectedRole)
      if (isLeftSwipe && currentIndex < roles.length - 1) {
        setSelectedRole(roles[currentIndex + 1])
      } else if (isRightSwipe && currentIndex > 0) {
        setSelectedRole(roles[currentIndex - 1])
      }
    }
  }

  const handleAddComment = (activityId: string, content: string) => {
    console.log("[v0] Demo: Would add comment", { activityId, content })
  }

  const handleDeleteComment = (commentId: string) => {
    console.log("[v0] Demo: Would delete comment", commentId)
  }

  const handleAddReaction = (activityId: string, emoji: string) => {
    console.log("[v0] Demo: Would add reaction", { activityId, emoji })
  }

  const handleRemoveReaction = (reactionId: string) => {
    console.log("[v0] Demo: Would remove reaction", reactionId)
  }

  const handleSaveDayNote = (date: string, content: string) => {
    console.log("[v0] Demo: Would save day note", { date, content })
  }

  const handleDeleteDayNote = (noteId: string) => {
    console.log("[v0] Demo: Would delete day note", noteId)
  }

  const handleAddActivity = () => {
    console.log("[v0] Demo: Would open add activity dialog")
  }

  const handleLocationUpdate = (location: { lat: number; lng: number }) => {
    console.log("[v0] Demo: Would update location", location)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Demo Banner */}
      <div className="w-full bg-gradient-to-r from-accent/20 to-accent/10 border-b border-accent/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="bg-accent/20 p-2 rounded-lg">
                <Eye className="h-5 w-5 text-accent" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-lg font-semibold text-foreground">Demo Mode</h2>
                  <span className="lg:hidden text-sm text-muted-foreground">·</span>
                  <div className="lg:hidden flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Viewing as:</span>
                    <Badge
                      variant={roleInfo[selectedRole].badge}
                      className={`text-xs ${selectedRole === "admin" ? "bg-accent" : ""}`}
                    >
                      {roleInfo[selectedRole].title}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Explore a week-long San Francisco trip from different perspectives. Switch roles to see how the
                  experience changes.
                </p>
                <p className="lg:hidden text-xs text-muted-foreground mt-2">Swipe left or right to switch roles</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="lg:hidden h-8 px-2">
                    <Info className="h-4 w-4 mr-1" />
                    <span className="text-xs">Permissions</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[95vw] max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Role Permissions</DialogTitle>
                    <DialogDescription>Compare what each role can do on this trip</DialogDescription>
                  </DialogHeader>
                  <div className="overflow-x-auto -mx-6 px-6">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[140px] text-xs">Permission</TableHead>
                          {(Object.keys(roleInfo) as UserRole[]).map((role) => (
                            <TableHead key={role} className="text-center min-w-[80px]">
                              <div className="flex flex-col items-center gap-1">
                                <Badge
                                  variant={roleInfo[role].badge}
                                  className={`text-xs ${role === "admin" ? "bg-accent" : ""}`}
                                >
                                  {roleInfo[role].title}
                                </Badge>
                              </div>
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {permissions.map((permission, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium text-xs">{permission.name}</TableCell>
                            {(Object.keys(roleInfo) as UserRole[]).map((role) => {
                              const hasPermission = permission[role]
                              return (
                                <TableCell key={role} className="text-center">
                                  {hasPermission === true && (
                                    <div className="flex justify-center">
                                      <Check className="h-4 w-4 text-accent" />
                                    </div>
                                  )}
                                  {hasPermission === "configurable" && (
                                    <div className="flex justify-center">
                                      <Circle className="h-4 w-4 text-accent stroke-dashed" strokeWidth={2} />
                                    </div>
                                  )}
                                  {!hasPermission && (
                                    <div className="flex justify-center">
                                      <Circle className="h-4 w-4 text-muted-foreground/20" strokeWidth={1.5} />
                                    </div>
                                  )}
                                </TableCell>
                              )
                            })}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </DialogContent>
              </Dialog>
              <Button variant="outline" size="sm" asChild>
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register">Start Your Trip</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:hidden" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
        {/* Swipe area - content will be rendered below */}
      </div>

      {/* Role Selector - Desktop Only */}
      <div className="w-full bg-card border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="hidden lg:block space-y-4">
            <div>
              <h3 className="text-sm font-medium text-foreground mb-2">Role Permissions Comparison</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Click on any role column header to experience the platform from that perspective. Checkmarks indicate
                full access, dashed circles indicate configurable settings.
              </p>
            </div>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[220px]">Permission</TableHead>
                    {(Object.keys(roleInfo) as UserRole[]).map((role) => (
                      <TableHead
                        key={role}
                        className="text-center cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => setSelectedRole(role)}
                      >
                        <div className="flex flex-col items-center gap-1.5 py-2">
                          <Badge variant={roleInfo[role].badge} className={role === "admin" ? "bg-accent" : ""}>
                            {roleInfo[role].title}
                          </Badge>
                          <span className="text-xs font-normal text-muted-foreground">{roleInfo[role].subtitle}</span>
                          {selectedRole === role && <Check className="h-4 w-4 text-accent" />}
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {permissions.map((permission, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium text-sm">{permission.name}</TableCell>
                      {(Object.keys(roleInfo) as UserRole[]).map((role) => {
                        const hasPermission = permission[role]
                        return (
                          <TableCell
                            key={role}
                            className={`text-center cursor-pointer transition-colors ${
                              selectedRole === role ? "bg-muted/50" : "hover:bg-muted/30"
                            }`}
                            onClick={() => setSelectedRole(role)}
                          >
                            {hasPermission === true && (
                              <div className="flex justify-center">
                                <Check className="h-5 w-5 text-accent" />
                              </div>
                            )}
                            {hasPermission === "configurable" && (
                              <div className="flex justify-center">
                                <Circle className="h-5 w-5 text-accent stroke-dashed" strokeWidth={2} />
                              </div>
                            )}
                            {!hasPermission && (
                              <div className="flex justify-center">
                                <Circle className="h-5 w-5 text-muted-foreground/20" strokeWidth={1.5} />
                              </div>
                            )}
                          </TableCell>
                        )
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>
        </div>
      </div>

      {/* Trip Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-5xl mx-auto">
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
              <TimelineFeed
                activities={activities}
                users={memberUsers}
                currentUser={currentUser}
                comments={comments}
                reactions={reactions}
                dayNotes={dayNotes}
                tripId="4"
                locationUpdates={locationUpdates}
                currentUserLocation={undefined}
                onLocationUpdate={canEdit ? handleLocationUpdate : undefined}
                canShareLocation={canEdit}
                onAddComment={canComment ? handleAddComment : undefined}
                onDeleteComment={canComment ? handleDeleteComment : undefined}
                onAddReaction={canComment ? handleAddReaction : undefined}
                onRemoveReaction={canComment ? handleRemoveReaction : undefined}
                onSaveDayNote={canComment ? handleSaveDayNote : undefined}
                onDeleteDayNote={canComment ? handleDeleteDayNote : undefined}
                onAddActivity={undefined}
                showShare={true}
              />
            </TabsContent>

            <TabsContent value="details" className="space-y-6">
              <TripDetailsCard
                trip={trip}
                memberCount={tripMembers.length}
                userRole={selectedRole}
                canEdit={canManageTrip}
                onUpdate={() => console.log("[v0] Demo: Would update trip")}
              />

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Members ({tripMembers.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {memberUsers.map((memberUser) => {
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
                          <Badge variant={member.role === "admin" ? "default" : "secondary"} className="text-xs">
                            {member.role}
                          </Badge>
                        </div>
                      )
                    })}
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
                    <span className="text-sm text-muted-foreground">Days</span>
                    <span className="text-sm font-medium text-foreground">7 days</span>
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
                    <span className="text-sm text-muted-foreground">Day Notes</span>
                    <span className="text-sm font-medium text-foreground">{dayNotes.length}</span>
                  </div>
                </CardContent>
              </Card>

              {canManageTrip && (
                <LocationSettingsCard
                  tripId="4"
                  initialPermissions={trip.locationPermissions}
                  onSave={() => console.log("[v0] Demo: Would save location permissions")}
                />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {canEdit && activeTab === "timeline" && (
        <FloatingActionButton
          onClick={handleAddActivity}
          icon={<Plus className="h-6 w-6" />}
          label="Add new activity (Demo)"
        />
      )}
    </div>
  )
}
