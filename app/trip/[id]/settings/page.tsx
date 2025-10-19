"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { MemberManagement } from "@/components/user-management/member-management"
import { PendingInvitations } from "@/components/user-management/pending-invitations"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ArrowLeft, Settings, Trash2, Save } from "lucide-react"
import { mockTrips, mockTripMembers, mockUsers } from "@/lib/mock-data"
import type { Trip, TripMember, User, Invitation } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

interface TripSettingsPageProps {
  params: {
    id: string
  }
}

// Mock pending invitations
const mockInvitations: Invitation[] = [
  {
    id: "1",
    tripId: "1",
    email: "alice@example.com",
    role: "participant",
    token: "mock-token-1",
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
  {
    id: "2",
    tripId: "1",
    email: "bob@example.com",
    role: "viewer",
    token: "mock-token-2",
    expiresAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Expired 1 day ago
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
  },
]

export default function TripSettingsPage({ params }: TripSettingsPageProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [trip, setTrip] = useState<Trip | null>(null)
  const [tripMembers, setTripMembers] = useState<TripMember[]>([])
  const [memberUsers, setMemberUsers] = useState<User[]>([])
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Form state
  const [tripName, setTripName] = useState("")
  const [tripDescription, setTripDescription] = useState("")
  const [isPublic, setIsPublic] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
      return
    }

    // Find the trip
    const foundTrip = mockTrips.find((t) => t.id === params.id)
    if (!foundTrip) {
      router.push("/dashboard")
      return
    }

    // Check if user is admin
    const userMembership = mockTripMembers.find((m) => m.tripId === params.id && m.userId === user?.id)
    if (!userMembership || userMembership.role !== "admin") {
      router.push(`/trip/${params.id}`)
      return
    }

    setTrip(foundTrip)
    setTripName(foundTrip.name)
    setTripDescription(foundTrip.description || "")
    setIsPublic(foundTrip.isPublic)

    // Get trip members
    const members = mockTripMembers.filter((m) => m.tripId === params.id)
    setTripMembers(members)

    // Get member user details
    const memberUserIds = members.map((m) => m.userId)
    const memberUserDetails = mockUsers.filter((u) => memberUserIds.includes(u.id))
    setMemberUsers(memberUserDetails)

    // Get pending invitations
    const tripInvitations = mockInvitations.filter((i) => i.tripId === params.id)
    setInvitations(tripInvitations)
  }, [params.id, user, loading, router])

  const handleSaveTrip = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update trip in mock data
      if (trip) {
        const updatedTrip = {
          ...trip,
          name: tripName,
          description: tripDescription,
          isPublic,
          updatedAt: new Date(),
        }
        setTrip(updatedTrip)
      }

      toast({
        title: "Trip updated",
        description: "Your trip settings have been saved successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update trip settings",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteTrip = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Trip deleted",
        description: "The trip has been permanently deleted",
      })

      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete trip",
        variant: "destructive",
      })
    }
  }

  const handleMemberRoleChange = (memberId: string, newRole: string) => {
    setTripMembers((prev) =>
      prev.map((member) => (member.id === memberId ? { ...member, role: newRole as any } : member)),
    )
  }

  const handleMemberRemove = (memberId: string) => {
    setTripMembers((prev) => prev.filter((member) => member.id !== memberId))
  }

  const handleInviteSent = (email: string, role: string) => {
    const newInvitation: Invitation = {
      id: `inv-${Date.now()}`,
      tripId: params.id,
      email,
      role: role as any,
      token: `token-${Date.now()}`,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
    }
    setInvitations((prev) => [...prev, newInvitation])
  }

  const handleResendInvitation = (invitationId: string) => {
    setInvitations((prev) =>
      prev.map((inv) =>
        inv.id === invitationId
          ? { ...inv, createdAt: new Date(), expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }
          : inv,
      ),
    )
  }

  const handleCancelInvitation = (invitationId: string) => {
    setInvitations((prev) => prev.filter((inv) => inv.id !== invitationId))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Settings className="h-12 w-12 text-accent mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading trip settings...</p>
        </div>
      </div>
    )
  }

  if (!trip || !user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.push(`/trip/${params.id}`)}>
              <ArrowLeft className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Back to Trip</span>
            </Button>
            <div className="flex items-center gap-2">
              <Settings className="h-6 w-6 text-accent" />
              <h1 className="text-xl font-bold text-foreground">Trip Settings</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          {/* Trip Information */}
          <Card>
            <CardHeader>
              <CardTitle>Trip Information</CardTitle>
              <CardDescription>Update your trip details and privacy settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tripName">Trip Name</Label>
                <Input
                  id="tripName"
                  value={tripName}
                  onChange={(e) => setTripName(e.target.value)}
                  placeholder="Enter trip name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tripDescription">Description</Label>
                <Textarea
                  id="tripDescription"
                  value={tripDescription}
                  onChange={(e) => setTripDescription(e.target.value)}
                  placeholder="Describe your trip..."
                  rows={3}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="isPublic">Public Trip</Label>
                  <p className="text-sm text-muted-foreground">Allow anyone with the link to view this trip</p>
                </div>
                <Switch id="isPublic" checked={isPublic} onCheckedChange={setIsPublic} />
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveTrip} disabled={isLoading}>
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Member Management */}
          <MemberManagement
            tripId={params.id}
            members={tripMembers}
            users={memberUsers}
            currentUserId={user.id}
            currentUserRole="admin"
            onMemberRoleChange={handleMemberRoleChange}
            onMemberRemove={handleMemberRemove}
            onInviteSent={handleInviteSent}
          />

          {/* Pending Invitations */}
          <PendingInvitations
            tripId={params.id}
            invitations={invitations}
            onResendInvitation={handleResendInvitation}
            onCancelInvitation={handleCancelInvitation}
          />

          {/* Danger Zone */}
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>Irreversible actions that will permanently affect your trip</CardDescription>
            </CardHeader>
            <CardContent>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Trip
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Trip</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{trip.name}"? This action cannot be undone. All activities,
                      photos, comments, and member access will be permanently removed.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteTrip}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete Trip
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
