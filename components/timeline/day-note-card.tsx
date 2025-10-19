"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Edit2, Save, X, StickyNote } from "lucide-react"
import type { DayNote, User } from "@/lib/types"
import { format } from "date-fns"

interface DayNoteCardProps {
  note?: DayNote
  date: string
  tripId: string
  currentUser: User
  users: User[]
  onSaveNote: (date: string, content: string) => void
  onDeleteNote?: (noteId: string) => void
  onCancel?: () => void
  autoEdit?: boolean
}

export function DayNoteCard({
  note,
  date,
  tripId,
  currentUser,
  users,
  onSaveNote,
  onDeleteNote,
  onCancel,
  autoEdit = false,
}: DayNoteCardProps) {
  const [isEditing, setIsEditing] = useState(autoEdit)
  const [noteContent, setNoteContent] = useState(note?.content || "")

  useEffect(() => {
    if (autoEdit) {
      setIsEditing(true)
    }
  }, [autoEdit])

  const noteAuthor = note ? users.find((u) => u.id === note.userId) : null

  const handleSave = () => {
    if (noteContent.trim()) {
      onSaveNote(date, noteContent.trim())
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setNoteContent(note?.content || "")
    setIsEditing(false)
    onCancel?.()
  }

  const canEdit = !note || note.userId === currentUser.id

  return (
    <Card className="bg-muted/30 border-accent/20">
      <CardContent className="pt-4">
        <div className="flex items-start gap-3">
          <StickyNote className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
          <div className="flex-1 space-y-2">
            {isEditing ? (
              <>
                <Textarea
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Add your thoughts about this day..."
                  className="min-h-[80px] resize-none"
                  autoFocus
                />
                <div className="flex items-center gap-2">
                  <Button size="sm" onClick={handleSave}>
                    <Save className="h-3 w-3 mr-1" />
                    Save
                  </Button>
                  <Button size="sm" variant="ghost" onClick={handleCancel}>
                    <X className="h-3 w-3 mr-1" />
                    Cancel
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm text-foreground leading-relaxed">{note?.content}</p>
                {noteAuthor && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={noteAuthor.avatar || "/placeholder.svg"} alt={noteAuthor.name} />
                        <AvatarFallback className="text-xs">
                          {noteAuthor.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-muted-foreground">
                        {noteAuthor.name} • {format(note.updatedAt, "MMM d, h:mm a")}
                      </span>
                    </div>
                    {canEdit && (
                      <Button size="sm" variant="ghost" onClick={() => setIsEditing(true)}>
                        <Edit2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
