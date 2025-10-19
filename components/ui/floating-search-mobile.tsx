"use client"

import { useState } from "react"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface FloatingSearchMobileProps {
  onSearch: (query: string) => void
  className?: string
}

export function FloatingSearchMobile({ onSearch, className = "" }: FloatingSearchMobileProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    onSearch(value)
  }

  const handleClear = () => {
    setSearchQuery("")
    onSearch("")
    setIsOpen(false)
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 left-6 z-40 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all flex items-center justify-center ${className}`}
        aria-label="Open search"
      >
        <Search className="h-6 w-6" />
      </button>
    )
  }

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border shadow-lg ${className}`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search activities, members..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 pr-4"
              autoFocus
            />
          </div>
          <Button variant="ghost" size="icon" onClick={handleClear} aria-label="Close search">
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
