"use client"

import { useState } from "react"
import type { Activity, User, Comment, Reaction } from "@/lib/types"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { CommentSection } from "@/components/social/comment-section"
import { ReactionBar } from "@/components/social/reaction-bar"
import { MapPin, Clock, MessageCircle, MoreHorizontal } from "lucide-react"
import { formatDistanceToNow, format } from "date-fns"
import { cn } from "@/lib/utils"

interface ActivityCardProps {
  activity: Activity
  user: User
  currentUser: User
  users: User[]
  comments: Comment[]
  reactions: Reaction[]
  onAddComment: (activityId: string, content: string) => void
  onDeleteComment?: (commentId: string) => void
  onAddReaction: (activityId: string, emoji: string) => void
  onRemoveReaction: (reactionId: string) => void
  activityStatus?: string
  cardBorderStyle?: string
}

export function ActivityCard({
  activity,
  user,
  currentUser,
  users,
  comments,
  reactions,
  onAddComment,
  onDeleteComment,
  onAddReaction,
  onRemoveReaction,
  activityStatus = "future",
  cardBorderStyle = "",
}: ActivityCardProps) {
  const [showComments, setShowComments] = useState(false)

  const formatTime = (date: Date) => {
    return format(date, "h:mm a")
  }

  const getActivityDetails = () => {
    if (activity.type === "note") {
      return null
    }

    switch (activity.type) {
      case "flight":
      case "transportation":
        return (
          <div className="text-sm text-muted-foreground space-y-0.5">
            {activity.metadata?.airline && activity.metadata?.flightNumber && (
              <p className="font-medium">
                {activity.metadata.airline} {activity.metadata.flightNumber}
              </p>
            )}
            {activity.metadata?.departureAirport && activity.metadata?.arrivalAirport && (
              <p>
                {activity.metadata.departureAirport} → {activity.metadata.arrivalAirport}
              </p>
            )}
            {activity.metadata?.seat && <p>Seat: {activity.metadata.seat}</p>}
          </div>
        )
      case "hotel":
      case "accommodation":
        return (
          <div className="text-sm text-muted-foreground space-y-0.5">
            {activity.metadata?.hotelName && <p className="font-medium">{activity.metadata.hotelName}</p>}
            {activity.metadata?.roomNumber && <p>Room: {activity.metadata.roomNumber}</p>}
            {activity.metadata?.checkInTime && <p>Check-in: {activity.metadata.checkInTime}</p>}
          </div>
        )
      case "restaurant":
      case "dining":
        return (
          <div className="text-sm text-muted-foreground space-y-0.5">
            {activity.metadata?.cuisine && <p>{activity.metadata.cuisine} cuisine</p>}
            {activity.metadata?.reservationTime && <p>Reservation: {activity.metadata.reservationTime}</p>}
            {activity.metadata?.partySize && <p>Party of {activity.metadata.partySize}</p>}
          </div>
        )
      case "car_rental":
        return (
          <div className="text-sm text-muted-foreground space-y-0.5">
            {activity.metadata?.company && <p className="font-medium">{activity.metadata.company}</p>}
            {activity.metadata?.vehicleType && <p>{activity.metadata.vehicleType}</p>}
            {activity.metadata?.pickupLocation && <p>Pickup: {activity.metadata.pickupLocation}</p>}
          </div>
        )
      case "attraction":
      case "sightseeing":
        return (
          <div className="text-sm text-muted-foreground space-y-0.5">
            {activity.metadata?.category && <p>{activity.metadata.category}</p>}
            {activity.metadata?.duration && <p>Duration: {activity.metadata.duration}</p>}
          </div>
        )
      default:
        return null
    }
  }

  const activityComments = comments.filter((c) => c.activityId === activity.id)
  const activityReactions = reactions.filter((r) => r.activityId === activity.id)

  const isNote = activity.type === "note"

  return (
    <Card className={cn("w-full border-l-4 p-2", cardBorderStyle)}>
      <CardHeader className="p-0 pb-0">
        <div className="flex items-start justify-between gap-1">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              {activity.title && activity.title !== "Note" && (
                <h3 className="font-semibold text-foreground text-sm truncate leading-tight">{activity.title}</h3>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground leading-none">
              <Avatar className="h-4 w-4">
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback className="text-[10px]">{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="truncate">{user.name}</span>
              <span>•</span>
              <span className="truncate">{formatDistanceToNow(activity.createdAt, { addSuffix: true })}</span>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 shrink-0">
            <MoreHorizontal className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0 space-y-0">
        {!isNote && (
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-xs leading-none">
              <Clock className="h-3 w-3 text-muted-foreground shrink-0" />
              <span className="text-foreground font-medium">
                {formatTime(activity.startTime || activity.createdAt)}
              </span>
              {activity.endTime && (
                <>
                  <span className="text-muted-foreground">-</span>
                  <span className="text-foreground font-medium">{formatTime(activity.endTime)}</span>
                </>
              )}
            </div>

            {activity.location && (
              <div className="flex items-center gap-1.5 text-xs leading-none">
                <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
                <span className="text-foreground truncate">
                  {typeof activity.location === "string" ? activity.location : activity.location.name}
                </span>
              </div>
            )}
          </div>
        )}

        {isNote && activity.location && (
          <div className="flex items-center gap-1.5 text-xs leading-none">
            <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
            <span className="text-foreground truncate">
              {typeof activity.location === "string" ? activity.location : activity.location.name}
            </span>
          </div>
        )}

        {getActivityDetails()}

        {activity.description && <p className="text-xs text-foreground line-clamp-2 mt-0.5">{activity.description}</p>}

        {activity.images && activity.images.length > 0 && (
          <div className={cn("grid gap-1.5 mt-1", activity.images.length === 1 ? "grid-cols-1" : "grid-cols-2")}>
            {activity.images.slice(0, 4).map((image, index) => (
              <div
                key={index}
                className={cn(
                  "rounded-md overflow-hidden bg-muted",
                  activity.images.length === 1 ? "aspect-[4/3]" : "aspect-video",
                )}
              >
                <img
                  src={image || "/placeholder.svg"}
                  alt={`${activity.title} image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}

        <div className="pt-1 border-t border-border mt-1">
          <div className="flex items-center justify-between gap-2">
            <ReactionBar
              activityId={activity.id}
              reactions={activityReactions}
              users={users}
              currentUser={currentUser}
              onAddReaction={onAddReaction}
              onRemoveReaction={onRemoveReaction}
            />

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComments(!showComments)}
              className={cn("text-muted-foreground hover:text-accent h-7 text-xs px-2", showComments && "text-accent")}
            >
              <MessageCircle className="h-3 w-3 mr-1" />
              {activityComments.length > 0 ? `${activityComments.length}` : "Comment"}
            </Button>
          </div>

          {showComments && (
            <CommentSection
              activityId={activity.id}
              comments={activityComments}
              users={users}
              currentUser={currentUser}
              onAddComment={onAddComment}
              onDeleteComment={onDeleteComment}
            />
          )}
        </div>
      </CardContent>
    </Card>
  )
}
