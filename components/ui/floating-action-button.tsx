"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface FloatingActionButtonProps {
  onClick: () => void
  icon: React.ReactNode
  label?: string
  className?: string
}

export function FloatingActionButton({ onClick, icon, label, className }: FloatingActionButtonProps) {
  return (
    <Button
      onClick={onClick}
      size="lg"
      className={cn(
        "fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-50",
        "bg-accent hover:bg-accent/90 text-accent-foreground",
        "border-2 border-background",
        className,
      )}
      aria-label={label}
    >
      {icon}
    </Button>
  )
}
