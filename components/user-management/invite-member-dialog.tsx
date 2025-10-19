"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Plus, Mail, Users, Loader2, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface InviteMemberDialogProps {
  tripId: string
  onInviteSent?: (email: string, role: string) => void
  children?: React.ReactNode
}

type Role = "admin" | "participant" | "commentor" | "viewer"

const roleDescriptions = {
  admin: "Full access - can manage trip, invite members, and edit all activities",
  participant: "Can add activities, photos, and comments",
  commentor: "Can view activities and add comments only",
  viewer: "Read-only access to view trip activities",
}

export function InviteMemberDialog({ tripId, onInviteSent, children }: InviteMemberDialogProps) {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<Role>("participant")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { toast } = useToast()

  const handleInvite = async () => {
    if (!email.trim()) {
      setError("Email is required")
      return
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock invitation logic
      console.log(`[v0] Sending invitation to ${email} for trip ${tripId} with role ${role}`)

      onInviteSent?.(email, role)

      toast({
        title: "Invitation sent!",
        description: `${email} has been invited as a ${role}`,
      })

      // Reset form
      setEmail("")
      setRole("participant")
      setOpen(false)
    } catch (err) {
      setError("Failed to send invitation. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Invite Member
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Invite Trip Member
          </DialogTitle>
          <DialogDescription>
            Send an invitation to join this trip. They'll receive an email with a link to accept.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-muted/50"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select value={role} onValueChange={(value: Role) => setRole(value)} disabled={isLoading}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive" className="text-xs">
                      Admin
                    </Badge>
                    <span>Administrator</span>
                  </div>
                </SelectItem>
                <SelectItem value="participant">
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="text-xs">
                      Participant
                    </Badge>
                    <span>Participant</span>
                  </div>
                </SelectItem>
                <SelectItem value="commentor">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      Commentor
                    </Badge>
                    <span>Commentor</span>
                  </div>
                </SelectItem>
                <SelectItem value="viewer">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      Viewer
                    </Badge>
                    <span>Viewer</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">{roleDescriptions[role]}</p>
          </div>

          {error && (
            <Alert variant="destructive">
              <X className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleInvite} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Mail className="h-4 w-4 mr-2" />
                Send Invitation
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
