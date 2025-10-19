"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, Archive, AlertTriangle } from "lucide-react"
import type { Trip } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface TripDangerZoneCardProps {
  trip: Trip
  onDelete?: () => void
  onArchive?: () => void
}

export function TripDangerZoneCard({ trip, onDelete, onArchive }: TripDangerZoneCardProps) {
  const { toast } = useToast()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showArchiveDialog, setShowArchiveDialog] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState("")

  const handleDeleteConfirm = () => {
    if (deleteConfirmation === trip.name) {
      onDelete?.()
      setShowDeleteDialog(false)
      setDeleteConfirmation("")
    } else {
      toast({
        title: "Incorrect trip name",
        description: "Please type the exact trip name to confirm deletion.",
        variant: "destructive",
      })
    }
  }

  const handleArchiveConfirm = () => {
    onArchive?.()
    setShowArchiveDialog(false)
    toast({
      title: "Trip archived",
      description: "Your trip has been archived successfully.",
    })
  }

  return (
    <>
      <Card className="border-destructive/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <div>
              <CardTitle className="text-lg text-destructive">Danger Zone</CardTitle>
              <CardDescription className="mt-1">Irreversible actions that will affect your trip data</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <h4 className="text-sm font-medium mb-1">Archive Trip</h4>
              <p className="text-xs text-muted-foreground mb-2">
                Hide this trip from your active trips. You can restore it later.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowArchiveDialog(true)}
                className="w-full sm:w-auto"
              >
                <Archive className="h-4 w-4 mr-2" />
                Archive Trip
              </Button>
            </div>

            <div className="flex-1 pt-3 sm:pt-0 sm:pl-3 border-t sm:border-t-0 sm:border-l">
              <h4 className="text-sm font-medium mb-1 text-destructive">Delete Trip</h4>
              <p className="text-xs text-muted-foreground mb-2">
                Permanently delete this trip and all its data. This cannot be undone.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDeleteDialog(true)}
                className="w-full sm:w-auto text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Trip
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Trip</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your trip and all associated activities,
              comments, and data.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                To confirm deletion, please type the trip name:{" "}
                <span className="font-semibold text-foreground">{trip.name}</span>
              </p>
              <Input
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                placeholder="Type trip name here"
                className="font-mono"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteDialog(false)
                setDeleteConfirmation("")
              }}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm} disabled={deleteConfirmation !== trip.name}>
              Delete Trip
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showArchiveDialog} onOpenChange={setShowArchiveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive Trip</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to archive this trip? You can restore it later from your archived trips.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleArchiveConfirm}>Archive</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
