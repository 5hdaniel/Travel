"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AppHeader } from "@/components/ui/app-header"
import { FloatingSearchMobile } from "@/components/floating-search-mobile"
import { MemberManagement } from "@/components/user-management/member-management"
import { MapPin, Users, Shield, Eye, MessageSquare, ChevronDown } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { mockUsers, mockTrips, mockTripMembers } from "@/lib/mock-data"
import type { User, TripMember, Trip } from "@/lib/types"

interface TripWithMembers {
  trip: Trip
  members: Array<{
    user: User
    membership: TripMember
  }>
}

interface UserWithTrips {
  user: User
  tripMemberships: Array<{
    tripId: string
    tripName: string
    role: TripMember["role"]
  }>
}

export default function MembersPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedView, setSelectedView] = useState<"trip" | "user">("trip")
  const [expandedTripId, setExpandedTripId] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <MapPin className="h-12 w-12 text-accent mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading members...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const userTripMemberships = mockTripMembers.filter((member) => member.userId === user.id)
  const userTripIds = userTripMemberships.map((m) => m.tripId)
  const userTrips = mockTrips.filter((trip) => userTripIds.includes(trip.id))

  const tripsWithMembers: TripWithMembers[] = userTrips.map((trip) => {
    const tripMembers = mockTripMembers
      .filter((member) => member.tripId === trip.id)
      .map((membership) => {
        const memberUser = mockUsers.find((u) => u.id === membership.userId)
        return memberUser ? { user: memberUser, membership } : null
      })
      .filter((m): m is { user: User; membership: TripMember } => m !== null)

    return { trip, members: tripMembers }
  })

  const connectedUserIds = new Set<string>()
  mockTripMembers
    .filter((member) => userTripIds.includes(member.tripId) && member.userId !== user.id)
    .forEach((member) => connectedUserIds.add(member.userId))

  const usersWithTrips: UserWithTrips[] = Array.from(connectedUserIds)
    .map((userId) => {
      const connectedUser = mockUsers.find((u) => u.id === userId)
      if (!connectedUser) return null

      const tripMemberships = mockTripMembers
        .filter((member) => member.userId === userId && userTripIds.includes(member.tripId))
        .map((member) => {
          const trip = mockTrips.find((t) => t.id === member.tripId)
          return {
            tripId: member.tripId,
            tripName: trip?.name || "Unknown Trip",
            role: member.role,
          }
        })

      return { user: connectedUser, tripMemberships }
    })
    .filter((u): u is UserWithTrips => u !== null)

  const filteredTripsWithMembers = tripsWithMembers.filter(
    (twm) =>
      twm.trip.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      twm.members.some((m) => m.user.name.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const filteredUsersWithTrips = usersWithTrips.filter(
    (uwt) =>
      uwt.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      uwt.user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getRoleIcon = (role: TripMember["role"]) => {
    switch (role) {
      case "admin":
        return <Shield className="h-3 w-3" />
      case "participant":
        return <Users className="h-3 w-3" />
      case "commentor":
        return <MessageSquare className="h-3 w-3" />
      case "viewer":
        return <Eye className="h-3 w-3" />
    }
  }

  const getRoleBadgeVariant = (role: TripMember["role"]) => {
    switch (role) {
      case "admin":
        return "default"
      case "participant":
        return "secondary"
      case "commentor":
        return "outline"
      case "viewer":
        return "outline"
    }
  }

  const handleUpdateRole = (userId: string, tripId: string, newRole: TripMember["role"]) => {
    const membership = mockTripMembers.find((m) => m.userId === userId && m.tripId === tripId)
    if (membership) {
      membership.role = newRole
      router.refresh()
    }
  }

  const handleMemberRoleChange = (memberId: string, newRole: string) => {
    const membership = mockTripMembers.find((m) => m.id === memberId)
    if (membership) {
      membership.role = newRole as TripMember["role"]
      router.refresh()
    }
  }

  const handleMemberRemove = (memberId: string) => {
    const index = mockTripMembers.findIndex((m) => m.id === memberId)
    if (index !== -1) {
      mockTripMembers.splice(index, 1)
      router.refresh()
    }
  }

  const handleInviteSent = (email: string, role: string) => {
    // Handle invitation logic here
    console.log(`[v0] Invitation sent to ${email} with role ${role}`)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const getCurrentUserRole = (tripId: string): string => {
    const membership = mockTripMembers.find((m) => m.tripId === tripId && m.userId === user.id)
    return membership?.role || "viewer"
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader user={user} title="Members" showBack showSearch onSearch={handleSearch} />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <p className="text-muted-foreground mt-1">Manage trip members and access permissions</p>
        </div>

        <FloatingSearchMobile onSearch={handleSearch} />

        <Tabs value={selectedView} onValueChange={(v) => setSelectedView(v as "trip" | "user")}>
          <TabsList className="mb-6">
            <TabsTrigger value="trip">By Trip</TabsTrigger>
            <TabsTrigger value="user">By User</TabsTrigger>
          </TabsList>

          <TabsContent value="trip">
            {filteredTripsWithMembers.length > 0 ? (
              <div className="space-y-4">
                {filteredTripsWithMembers.map((twm) => {
                  const tripMembers = mockTripMembers.filter((m) => m.tripId === twm.trip.id)
                  const memberUsers = mockUsers.filter((u) => tripMembers.some((m) => m.userId === u.id))
                  const currentUserRole = getCurrentUserRole(twm.trip.id)
                  const isExpanded = expandedTripId === twm.trip.id

                  return (
                    <div key={twm.trip.id}>
                      {!isExpanded ? (
                        <Card>
                          <CardHeader>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <CardTitle className="text-lg truncate">{twm.trip.name}</CardTitle>
                                <CardDescription className="text-sm">
                                  {twm.members.length} {twm.members.length === 1 ? "member" : "members"}
                                </CardDescription>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                <Button variant="outline" size="sm" onClick={() => setExpandedTripId(twm.trip.id)}>
                                  View Members
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                        </Card>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h2 className="text-2xl font-bold">{twm.trip.name}</h2>
                              <p className="text-sm text-muted-foreground">
                                {twm.members.length} {twm.members.length === 1 ? "member" : "members"}
                              </p>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => setExpandedTripId(null)}>
                              Hide Members
                            </Button>
                          </div>
                          <MemberManagement
                            tripId={twm.trip.id}
                            members={tripMembers}
                            users={memberUsers}
                            currentUserId={user.id}
                            currentUserRole={currentUserRole}
                            onMemberRoleChange={handleMemberRoleChange}
                            onMemberRemove={handleMemberRemove}
                            onInviteSent={handleInviteSent}
                          />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <CardTitle className="mb-2">No trips found</CardTitle>
                  <CardDescription>
                    {searchQuery ? "Try a different search term" : "Create a trip to get started"}
                  </CardDescription>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="user">
            {filteredUsersWithTrips.length > 0 ? (
              <div className="space-y-4">
                {filteredUsersWithTrips.map((uwt) => (
                  <Card key={uwt.user.id}>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                          {uwt.user.avatar ? (
                            <img
                              src={uwt.user.avatar || "/placeholder.svg"}
                              alt={uwt.user.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Users className="h-6 w-6 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg truncate">{uwt.user.name}</CardTitle>
                          <CardDescription className="text-sm truncate">{uwt.user.email}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground mb-2">
                          Member of {uwt.tripMemberships.length} {uwt.tripMemberships.length === 1 ? "trip" : "trips"}:
                        </p>
                        <div className="space-y-2">
                          {uwt.tripMemberships.map((membership) => (
                            <div
                              key={membership.tripId}
                              className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-md bg-muted/50"
                            >
                              <span className="text-sm font-medium truncate">{membership.tripName}</span>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-auto p-0 hover:bg-transparent w-fit">
                                    <Badge
                                      variant={getRoleBadgeVariant(membership.role)}
                                      className="gap-1 cursor-pointer"
                                    >
                                      {getRoleIcon(membership.role)}
                                      <span className="capitalize">{membership.role}</span>
                                      <ChevronDown className="h-3 w-3 ml-1" />
                                    </Badge>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => handleUpdateRole(uwt.user.id, membership.tripId, "admin")}
                                  >
                                    <Shield className="h-3 w-3 mr-2" />
                                    Admin
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleUpdateRole(uwt.user.id, membership.tripId, "participant")}
                                  >
                                    <Users className="h-3 w-3 mr-2" />
                                    Participant
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleUpdateRole(uwt.user.id, membership.tripId, "commentor")}
                                  >
                                    <MessageSquare className="h-3 w-3 mr-2" />
                                    Commentor
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleUpdateRole(uwt.user.id, membership.tripId, "viewer")}
                                  >
                                    <Eye className="h-3 w-3 mr-2" />
                                    Viewer
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <CardTitle className="mb-2">No members found</CardTitle>
                  <CardDescription>
                    {searchQuery ? "Try a different search term" : "Invite people to your trips to see them here"}
                  </CardDescription>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
