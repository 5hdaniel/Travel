"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { InviteMemberDialog } from "./invite-member-dialog"
import { Users, MoreHorizontal, UserMinus, Settings, Crown, MessageCircle, Eye } from "lucide-react"
import type { TripMember, User } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"

interface MemberManagementProps {
  tripId: string
  members: TripMember[]
  users: User[]
  currentUserId: string
  currentUserRole: string
  onMemberRoleChange?: (memberId: string, newRole: string) => void
  onMemberRemove?: (memberId: string) => void
  onInviteSent?: (email: string, role: string) => void
}

type Role = "admin" | "participant" | "commentor" | "viewer"

const roleIcons = {
  admin: Crown,
  participant: Users,
  commentor: MessageCircle,
  viewer: Eye,
}

const roleColors = {
  admin: "destructive",
  participant: "default",
  commentor: "secondary",
  viewer: "outline",
} as const

export function MemberManagement({
  tripId,
  members,
  users,
  currentUserId,
  currentUserRole,
  onMemberRoleChange,
  onMemberRemove,
  onInviteSent,
}: MemberManagementProps) {
  const [changingRole, setChangingRole] = useState<string | null>(null)
  const { toast } = useToast()

  const isCurrentUserAdmin = currentUserRole === "admin"
  const canManageMembers = isCurrentUserAdmin

  const handleRoleChange = async (memberId: string, newRole: Role) => {
    if (!canManageMembers) return

    setChangingRole(memberId)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      onMemberRoleChange?.(memberId, newRole)

      const member = members.find((m) => m.id === memberId)
      const user = users.find((u) => u.id === member?.userId)

      toast({
        title: "Role updated",
        description: `${user?.name}'s role has been changed to ${newRole}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update member role",
        variant: "destructive",
      })
    } finally {
      setChangingRole(null)
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    if (!canManageMembers) return

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      onMemberRemove?.(memberId)

      const member = members.find((m) => m.id === memberId)
      const user = users.find((u) => u.id === member?.userId)

      toast({
        title: "Member removed",
        description: `${user?.name} has been removed from the trip`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove member",
        variant: "destructive",
      })
    }
  }

  const getMemberUser = (member: TripMember) => {
    return users.find((u) => u.id === member.userId)
  }

  const canModifyMember = (member: TripMember) => {
    // Can't modify yourself
    if (member.userId === currentUserId) return false
    // Only admins can modify others
    if (!isCurrentUserAdmin) return false
    // Can't modify other admins unless you're the trip owner (simplified logic)
    return true
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Trip Members ({members.length})
            </CardTitle>
            <CardDescription>Manage who has access to this trip and their permissions</CardDescription>
          </div>
          {canManageMembers && (
            <InviteMemberDialog tripId={tripId} onInviteSent={onInviteSent}>
              <Button>
                <Users className="h-4 w-4 mr-2" />
                Invite Member
              </Button>
            </InviteMemberDialog>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {members.map((member) => {
            const user = getMemberUser(member)
            if (!user) return null

            const RoleIcon = roleIcons[member.role as Role]
            const isCurrentUser = member.userId === currentUserId
            const canModify = canModifyMember(member)

            return (
              <div key={member.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground">
                        {user.name}
                        {isCurrentUser && <span className="text-muted-foreground">(You)</span>}
                      </p>
                      <Badge variant={roleColors[member.role as Role]} className="flex items-center gap-1">
                        <RoleIcon className="h-3 w-3" />
                        {member.role}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <p className="text-xs text-muted-foreground">Joined {format(member.joinedAt, "MMM d, yyyy")}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {canManageMembers && canModify && (
                    <Select
                      value={member.role}
                      onValueChange={(newRole: Role) => handleRoleChange(member.id, newRole)}
                      disabled={changingRole === member.id}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="participant">Participant</SelectItem>
                        <SelectItem value="commentor">Commentor</SelectItem>
                        <SelectItem value="viewer">Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                  )}

                  {canManageMembers && canModify && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Settings className="h-4 w-4 mr-2" />
                          Member Settings
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                              <UserMinus className="h-4 w-4 mr-2" />
                              Remove Member
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remove Member</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to remove {user.name} from this trip? They will lose access to all
                                trip activities and won't be able to view or participate.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleRemoveMember(member.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Remove Member
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Role Permissions Guide */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h4 className="text-sm font-medium text-foreground mb-3">Role Permissions</h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <Badge variant="destructive" className="w-20 justify-center">
                <Crown className="h-3 w-3 mr-1" />
                Admin
              </Badge>
              <span className="text-muted-foreground">
                Full access - manage trip, invite members, edit all activities
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="default" className="w-20 justify-center">
                <Users className="h-3 w-3 mr-1" />
                Participant
              </Badge>
              <span className="text-muted-foreground">Can add activities, photos, and comments</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="w-20 justify-center">
                <MessageCircle className="h-3 w-3 mr-1" />
                Commentor
              </Badge>
              <span className="text-muted-foreground">Can view activities and add comments only</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="w-20 justify-center">
                <Eye className="h-3 w-3 mr-1" />
                Viewer
              </Badge>
              <span className="text-muted-foreground">Read-only access to view trip activities</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
