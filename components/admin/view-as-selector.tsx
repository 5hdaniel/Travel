"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Eye, Crown, Users, MessageCircle, Glasses } from "lucide-react"

type UserRole = "admin" | "participant" | "commentor" | "viewer"

interface ViewAsSelectorProps {
  currentRole: UserRole
  onRoleChange: (role: UserRole) => void
  className?: string
}

const roleConfig = {
  admin: {
    label: "Admin",
    icon: Crown,
    description: "Full access to all features",
    color: "bg-red-100 text-red-800 border-red-200",
  },
  participant: {
    label: "Participant",
    icon: Users,
    description: "Can add activities and interact",
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
  commentor: {
    label: "Commentor",
    icon: MessageCircle,
    description: "Can comment and react only",
    color: "bg-green-100 text-green-800 border-green-200",
  },
  viewer: {
    label: "Viewer",
    icon: Glasses,
    description: "Read-only access",
    color: "bg-gray-100 text-gray-800 border-gray-200",
  },
}

export function ViewAsSelector({ currentRole, onRoleChange, className }: ViewAsSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const CurrentIcon = roleConfig[currentRole].icon

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className={className}>
          <Eye className="h-4 w-4 mr-2" />
          View as: {roleConfig[currentRole].label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Eye className="h-4 w-4" />
          Admin Preview Mode
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {(Object.entries(roleConfig) as [UserRole, (typeof roleConfig)[UserRole]][]).map(([role, config]) => {
          const Icon = config.icon
          const isSelected = currentRole === role

          return (
            <DropdownMenuItem
              key={role}
              onClick={() => onRoleChange(role)}
              className="flex items-start gap-3 p-3 cursor-pointer"
            >
              <Icon className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{config.label}</span>
                  {isSelected && (
                    <Badge variant="secondary" className="text-xs">
                      Current
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{config.description}</p>
              </div>
            </DropdownMenuItem>
          )
        })}
        <DropdownMenuSeparator />
        <div className="p-2 text-xs text-muted-foreground">
          This preview shows how the trip appears to users with different permission levels.
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
