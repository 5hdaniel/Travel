"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import { Mail, Clock, X, RefreshCw } from "lucide-react"
import type { Invitation } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { format, formatDistanceToNow } from "date-fns"

interface PendingInvitationsProps {
  tripId: string
  invitations: Invitation[]
  onResendInvitation?: (invitationId: string) => void
  onCancelInvitation?: (invitationId: string) => void
}

export function PendingInvitations({
  tripId,
  invitations,
  onResendInvitation,
  onCancelInvitation,
}: PendingInvitationsProps) {
  const [resending, setResending] = useState<string | null>(null)
  const { toast } = useToast()

  const handleResendInvitation = async (invitationId: string) => {
    setResending(invitationId)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      onResendInvitation?.(invitationId)

      const invitation = invitations.find((i) => i.id === invitationId)
      toast({
        title: "Invitation resent",
        description: `Invitation has been resent to ${invitation?.email}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resend invitation",
        variant: "destructive",
      })
    } finally {
      setResending(null)
    }
  }

  const handleCancelInvitation = async (invitationId: string) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      onCancelInvitation?.(invitationId)

      const invitation = invitations.find((i) => i.id === invitationId)
      toast({
        title: "Invitation cancelled",
        description: `Invitation to ${invitation?.email} has been cancelled`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel invitation",
        variant: "destructive",
      })
    }
  }

  const isExpired = (invitation: Invitation) => {
    return new Date() > invitation.expiresAt
  }

  if (invitations.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Pending Invitations ({invitations.length})
        </CardTitle>
        <CardDescription>Invitations that haven't been accepted yet</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {invitations.map((invitation) => {
            const expired = isExpired(invitation)

            return (
              <div
                key={invitation.id}
                className="flex items-center justify-between p-3 border border-border rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-foreground">{invitation.email}</p>
                    <Badge variant="outline" className="capitalize">
                      {invitation.role}
                    </Badge>
                    {expired && <Badge variant="destructive">Expired</Badge>}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>Sent {formatDistanceToNow(invitation.createdAt, { addSuffix: true })}</span>
                    </div>
                    <span>Expires {format(invitation.expiresAt, "MMM d, yyyy")}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleResendInvitation(invitation.id)}
                    disabled={resending === invitation.id}
                  >
                    {resending === invitation.id ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <X className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Cancel Invitation</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to cancel the invitation to {invitation.email}? They won't be able to
                          use the invitation link anymore.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Keep Invitation</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleCancelInvitation(invitation.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Cancel Invitation
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
