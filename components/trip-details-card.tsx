"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Users, Edit2, X, Check, Upload } from "lucide-react"
import { format } from "date-fns"
import type { Trip } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

interface TripDetailsCardProps {
  trip: Trip
  memberCount: number
  userRole: string
  canEdit: boolean
  onUpdate?: (updates: Partial<Trip>) => void
}

export function TripDetailsCard({ trip, memberCount, userRole, canEdit, onUpdate }: TripDetailsCardProps) {
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [editedTrip, setEditedTrip] = useState({
    name: trip.name,
    description: trip.description || "",
    startDate: format(trip.startDate, "yyyy-MM-dd"),
    endDate: format(trip.endDate, "yyyy-MM-dd"),
    coverImage: trip.coverImage || "",
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setEditedTrip({ ...editedTrip, coverImage: imageUrl })
      toast({
        title: "Image selected",
        description: "Your new cover image will be saved when you click Save.",
      })
    }
  }

  const handleSave = () => {
    if (onUpdate) {
      onUpdate({
        name: editedTrip.name,
        description: editedTrip.description,
        startDate: new Date(editedTrip.startDate),
        endDate: new Date(editedTrip.endDate),
        coverImage: editedTrip.coverImage,
      })
    }
    setIsEditing(false)
    toast({
      title: "Trip updated",
      description: "Your trip details have been saved successfully.",
    })
  }

  const handleCancel = () => {
    setEditedTrip({
      name: trip.name,
      description: trip.description || "",
      startDate: format(trip.startDate, "yyyy-MM-dd"),
      endDate: format(trip.endDate, "yyyy-MM-dd"),
      coverImage: trip.coverImage || "",
    })
    setIsEditing(false)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Trip Details</CardTitle>
          {canEdit && !isEditing && (
            <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
              <Edit2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row lg:gap-6">
          {/* Left column: Trip details */}
          <div className="flex-1 space-y-4">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Trip Name</label>
                  <Input
                    value={editedTrip.name}
                    onChange={(e) => setEditedTrip({ ...editedTrip, name: e.target.value })}
                    placeholder="Enter trip name"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Description</label>
                  <Textarea
                    value={editedTrip.description}
                    onChange={(e) => setEditedTrip({ ...editedTrip, description: e.target.value })}
                    placeholder="Enter trip description"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Start Date</label>
                    <Input
                      type="date"
                      value={editedTrip.startDate}
                      onChange={(e) => setEditedTrip({ ...editedTrip, startDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">End Date</label>
                    <Input
                      type="date"
                      value={editedTrip.endDate}
                      onChange={(e) => setEditedTrip({ ...editedTrip, endDate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSave} size="sm" className="flex-1">
                    <Check className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button onClick={handleCancel} variant="outline" size="sm" className="flex-1 bg-transparent">
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{trip.name}</h3>
                  {trip.description && <p className="text-sm text-muted-foreground">{trip.description}</p>}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">
                      {format(trip.startDate, "MMM d")} - {format(trip.endDate, "MMM d, yyyy")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">{memberCount} members</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant={trip.isPublic ? "default" : "secondary"}>
                    {trip.isPublic ? "Public" : "Private"}
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    {userRole}
                  </Badge>
                </div>
              </>
            )}
          </div>

          {(trip.coverImage || isEditing) && (
            <div className="lg:w-80 mt-4 lg:mt-0">
              <div className="relative aspect-video bg-muted rounded-lg overflow-hidden group">
                <img
                  src={editedTrip.coverImage || trip.coverImage || "/placeholder.svg"}
                  alt={trip.name}
                  className="w-full h-full object-cover"
                />
                {isEditing && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <label htmlFor="cover-image-upload" className="cursor-pointer">
                      <Button type="button" size="sm" variant="secondary" asChild>
                        <span>
                          <Upload className="h-4 w-4 mr-2" />
                          Change Image
                        </span>
                      </Button>
                    </label>
                    <input
                      id="cover-image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
