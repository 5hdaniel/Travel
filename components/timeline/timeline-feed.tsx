"use client"

import { useState, useMemo } from "react"
import type { Activity, User, Comment, Reaction, DayNote, LocationUpdate } from "@/lib/types"
import { ActivityCard } from "./activity-card"
import { TimelineFilterDropdown } from "./timeline-filter-dropdown"
import { DayNoteCard } from "./day-note-card"
import { LiveLocationCard } from "@/components/location/live-location-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import {
  Filter,
  Calendar,
  Plus,
  Share2,
  StickyNote,
  Plane,
  Hotel,
  Car,
  UtensilsCrossed,
  Eye,
  FileText,
} from "lucide-react"
import { format, isToday, isTomorrow, isYesterday } from "date-fns"

interface TimelineFeedProps {
  activities: Activity[]
  users: User[]
  currentUser: User
  comments: Comment[]
  reactions: Reaction[]
  dayNotes?: DayNote[]
  tripId: string
  locationUpdates?: LocationUpdate[]
  currentUserLocation?: { lat: number; lng: number }
  onLocationUpdate?: (location: { lat: number; lng: number }) => void
  canShareLocation?: boolean
  onAddComment: (activityId: string, content: string) => void
  onDeleteComment?: (commentId: string) => void
  onAddReaction: (activityId: string, emoji: string) => void
  onRemoveReaction: (reactionId: string) => void
  onSaveDayNote?: (date: string, content: string) => void
  onDeleteDayNote?: (noteId: string) => void
  onAddActivity?: () => void
  showShare?: boolean
}

type FilterType = "all" | "planned" | "in_progress" | "completed"
type ActivityType = "all" | "flight" | "hotel" | "car_rental" | "restaurant" | "attraction" | "custom"

export function TimelineFeed({
  activities,
  users,
  currentUser,
  comments,
  reactions,
  dayNotes = [],
  tripId,
  locationUpdates = [],
  currentUserLocation,
  onLocationUpdate,
  canShareLocation = false,
  onAddComment,
  onDeleteComment,
  onAddReaction,
  onRemoveReaction,
  onSaveDayNote,
  onDeleteDayNote,
  onAddActivity,
  showShare = false,
}: TimelineFeedProps) {
  const [statusFilter, setStatusFilter] = useState<FilterType>("all")
  const [typeFilter, setTypeFilter] = useState<ActivityType>("all")
  const [editingNoteDate, setEditingNoteDate] = useState<string | null>(null)

  const filteredActivities = useMemo(() => {
    let filtered = activities

    if (statusFilter !== "all") {
      filtered = filtered.filter((activity) => activity.status === statusFilter)
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((activity) => activity.type === typeFilter)
    }

    // Sort all activities chronologically from earliest to latest
    return filtered.sort((a, b) => {
      const dateA = a.scheduledFor ? new Date(a.scheduledFor) : new Date(a.startTime)
      const dateB = b.scheduledFor ? new Date(b.scheduledFor) : new Date(b.startTime)
      return dateA.getTime() - dateB.getTime()
    })
  }, [activities, statusFilter, typeFilter])

  const groupedActivities = useMemo(() => {
    const groups: { [key: string]: Activity[] } = {}

    // Group activities by date
    filteredActivities.forEach((activity) => {
      const date = format(activity.scheduledFor || activity.startTime, "yyyy-MM-dd")
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(activity)
    })

    // Sort dates chronologically
    const sortedDates = Object.keys(groups).sort((a, b) => {
      return new Date(a).getTime() - new Date(b).getTime()
    })

    const sortedGroups: { [key: string]: Activity[] } = {}
    sortedDates.forEach((date) => {
      sortedGroups[date] = groups[date]
    })

    return sortedGroups
  }, [filteredActivities])

  const liveLocationPosition = useMemo(() => {
    const now = new Date()

    // Find the first activity that hasn't started yet
    for (const [dateString, dayActivities] of Object.entries(groupedActivities)) {
      for (let i = 0; i < dayActivities.length; i++) {
        const activity = dayActivities[i]
        const activityTime = activity.scheduledFor ? new Date(activity.scheduledFor) : new Date(activity.startTime)

        if (activityTime > now) {
          // Found the next upcoming activity
          return { date: dateString, index: i }
        }
      }
    }

    // If no upcoming activities, show at the end of the last date
    const dates = Object.keys(groupedActivities)
    if (dates.length > 0) {
      const lastDate = dates[dates.length - 1]
      return { date: lastDate, index: groupedActivities[lastDate].length }
    }

    // If no activities at all, show on today
    return { date: format(new Date(), "yyyy-MM-dd"), index: 0 }
  }, [groupedActivities])

  const getDateLabel = (dateString: string) => {
    const date = new Date(dateString)

    if (isToday(date)) return "Today"
    if (isTomorrow(date)) return "Tomorrow"
    if (isYesterday(date)) return "Yesterday"

    return format(date, "EEEE, MMMM d, yyyy")
  }

  const getUserById = (userId: string) => {
    return users.find((user) => user.id === userId)
  }

  const getNoteForDate = (dateString: string) => {
    return dayNotes.find((note) => note.date === dateString)
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "flight":
      case "transportation":
        return Plane
      case "hotel":
      case "accommodation":
        return Hotel
      case "car_rental":
        return Car
      case "restaurant":
      case "dining":
        return UtensilsCrossed
      case "attraction":
      case "sightseeing":
        return Eye
      case "note":
        return FileText
      default:
        return Calendar
    }
  }

  const getActivityStatus = (activity: Activity) => {
    const now = new Date()
    const activityTime = activity.scheduledFor ? new Date(activity.scheduledFor) : new Date(activity.startTime)
    const endTime = activity.endTime ? new Date(activity.endTime) : null

    if (endTime && now > endTime) {
      return "past"
    } else if (now >= activityTime && (!endTime || now <= endTime)) {
      return "current"
    } else {
      return "future"
    }
  }

  const getDotStyle = (status: string) => {
    switch (status) {
      case "past":
        return "bg-muted-foreground/40 border-muted-foreground/40"
      case "current":
        return "bg-blue-500 border-blue-500"
      case "future":
        return "bg-border border-border"
      default:
        return "bg-accent border-accent"
    }
  }

  const getCardBorderStyle = (status: string) => {
    switch (status) {
      case "past":
        return "border-muted-foreground/20"
      case "current":
        return "border-blue-500/50"
      case "future":
        return "border-border"
      default:
        return ""
    }
  }

  if (activities.length === 0) {
    return (
      <Card className="text-center py-8">
        <CardContent className="space-y-4">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto" />
          <div>
            <CardTitle className="mb-2">No activities yet</CardTitle>
            <p className="text-muted-foreground">Start documenting your journey by adding your first activity</p>
          </div>
          {onAddActivity && (
            <Button onClick={onAddActivity} size="lg">
              <Plus className="h-4 w-4 mr-2" />
              Add Activity
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Timeline</h2>
        <div className="flex items-center gap-2">
          {showShare && (
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          )}
          <TimelineFilterDropdown
            statusFilter={statusFilter}
            typeFilter={typeFilter}
            onStatusFilterChange={setStatusFilter}
            onTypeFilterChange={setTypeFilter}
          />
        </div>
      </div>

      <div className="space-y-0">
        {Object.entries(groupedActivities).map(([dateString, dayActivities]) => {
          const existingNote = getNoteForDate(dateString)
          const isEditingThisDate = editingNoteDate === dateString
          const shouldShowLiveLocationInThisDate = liveLocationPosition.date === dateString

          return (
            <div key={dateString}>
              {/* Sticky date header */}
              <div className="sticky top-0 bg-background z-20 py-3 border-b border-border/50">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="text-lg font-semibold text-foreground">{getDateLabel(dateString)}</h3>
                  {onSaveDayNote && !existingNote && !isEditingThisDate && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingNoteDate(dateString)}
                      className="text-muted-foreground hover:text-foreground ml-auto"
                    >
                      <StickyNote className="h-4 w-4 mr-1" />
                      Add note
                    </Button>
                  )}
                </div>
              </div>

              {/* Date section content */}
              <div className="py-4 space-y-4">
                {onSaveDayNote && (existingNote || isEditingThisDate) && (
                  <DayNoteCard
                    note={existingNote}
                    date={dateString}
                    tripId={tripId}
                    currentUser={currentUser}
                    users={users}
                    onSaveNote={(date, content) => {
                      onSaveDayNote(date, content)
                      setEditingNoteDate(null)
                    }}
                    onDeleteNote={onDeleteDayNote}
                    onCancel={() => setEditingNoteDate(null)}
                    autoEdit={isEditingThisDate && !existingNote}
                  />
                )}

                {dayActivities.map((activity, index) => {
                  const activityUser = getUserById(activity.createdBy || activity.userId || currentUser.id)
                  const user = activityUser || currentUser

                  const shouldShowLiveLocationHere =
                    shouldShowLiveLocationInThisDate && index === liveLocationPosition.index

                  const activityStatus = getActivityStatus(activity)
                  const cardBorderStyle = getCardBorderStyle(activityStatus)

                  return (
                    <div key={activity.id}>
                      {shouldShowLiveLocationHere && (
                        <div className="mb-4" id="live-location-card">
                          <LiveLocationCard
                            tripId={tripId}
                            locationUpdates={locationUpdates}
                            users={users}
                            currentUserLocation={currentUserLocation}
                            onLocationUpdate={onLocationUpdate}
                            canShare={canShareLocation}
                          />
                        </div>
                      )}

                      <ActivityCard
                        activity={activity}
                        user={user}
                        currentUser={currentUser}
                        users={users}
                        comments={comments}
                        reactions={reactions}
                        onAddComment={onAddComment}
                        onDeleteComment={onDeleteComment}
                        onAddReaction={onAddReaction}
                        onRemoveReaction={onRemoveReaction}
                        activityStatus={activityStatus}
                        cardBorderStyle={cardBorderStyle}
                      />
                    </div>
                  )
                })}

                {shouldShowLiveLocationInThisDate && liveLocationPosition.index === dayActivities.length && (
                  <div id="live-location-card">
                    <LiveLocationCard
                      tripId={tripId}
                      locationUpdates={locationUpdates}
                      users={users}
                      currentUserLocation={currentUserLocation}
                      onLocationUpdate={onLocationUpdate}
                      canShare={canShareLocation}
                    />
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {filteredActivities.length === 0 && activities.length > 0 && (
        <Card className="text-center py-8">
          <CardContent>
            <Filter className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">
              No activities match your current filters. Try adjusting your selection.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
