"use client"

import { useState } from "react"
import type { Reaction, User } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Plus } from "lucide-react"

interface ReactionBarProps {
  activityId: string
  reactions: Reaction[]
  users: User[]
  currentUser: User
  onAddReaction: (activityId: string, emoji: string) => void
  onRemoveReaction: (reactionId: string) => void
}

const EMOJI_OPTIONS = ["❤️", "👍", "😂", "😮", "😢", "😡", "🎉", "✈️"]

export function ReactionBar({
  activityId,
  reactions,
  users,
  currentUser,
  onAddReaction,
  onRemoveReaction,
}: ReactionBarProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  // Group reactions by emoji
  const groupedReactions = reactions.reduce(
    (acc, reaction) => {
      if (!acc[reaction.emoji]) {
        acc[reaction.emoji] = []
      }
      acc[reaction.emoji].push(reaction)
      return acc
    },
    {} as Record<string, Reaction[]>,
  )

  const handleEmojiClick = (emoji: string) => {
    const existingReaction = reactions.find((r) => r.emoji === emoji && r.userId === currentUser.id)

    if (existingReaction) {
      onRemoveReaction(existingReaction.id)
    } else {
      onAddReaction(activityId, emoji)
    }
    setShowEmojiPicker(false)
  }

  const getUserById = (userId: string) => {
    return users.find((user) => user.id === userId)
  }

  const getReactionTooltip = (reactions: Reaction[]) => {
    const userNames = reactions
      .map((r) => getUserById(r.userId)?.name)
      .filter(Boolean)
      .slice(0, 3)

    if (userNames.length === 0) return ""
    if (userNames.length === 1) return userNames[0]
    if (userNames.length === 2) return `${userNames[0]} and ${userNames[1]}`
    return `${userNames[0]}, ${userNames[1]} and ${reactions.length - 2} others`
  }

  if (Object.keys(groupedReactions).length === 0 && !showEmojiPicker) {
    return (
      <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            <Plus className="h-4 w-4 mr-1" />
            React
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2" align="start">
          <div className="flex gap-1">
            {EMOJI_OPTIONS.map((emoji) => (
              <Button
                key={emoji}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-accent"
                onClick={() => handleEmojiClick(emoji)}
              >
                {emoji}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {Object.entries(groupedReactions).map(([emoji, reactionList]) => {
        const hasUserReacted = reactionList.some((r) => r.userId === currentUser.id)
        const tooltip = getReactionTooltip(reactionList)

        return (
          <Button
            key={emoji}
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 px-2 py-1 text-sm border border-border hover:bg-accent",
              hasUserReacted && "bg-accent border-accent-foreground",
            )}
            onClick={() => handleEmojiClick(emoji)}
            title={tooltip}
          >
            <span className="mr-1">{emoji}</span>
            <span className="text-xs">{reactionList.length}</span>
          </Button>
        )
      })}

      <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground">
            <Plus className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2" align="start">
          <div className="flex gap-1">
            {EMOJI_OPTIONS.map((emoji) => (
              <Button
                key={emoji}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-accent"
                onClick={() => handleEmojiClick(emoji)}
              >
                {emoji}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
