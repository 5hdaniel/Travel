"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface FloatingSearchMobileProps {
  onSearch: (query: string) => void
  onAddClick: () => void
}

export function FloatingSearchMobile({ onSearch, onAddClick }: FloatingSearchMobileProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [query, setQuery] = useState("")
  const [lastScrollY, setLastScrollY] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!isExpanded) return

    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // If user scrolls while search is expanded, collapse it
      if (Math.abs(currentScrollY - lastScrollY) > 20) {
        setIsExpanded(false)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isExpanded, lastScrollY])

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isExpanded])

  const handleSearchChange = (value: string) => {
    setQuery(value)
    onSearch(value)
  }

  const handleClear = () => {
    setQuery("")
    onSearch("")
  }

  const handleSearchClick = () => {
    setIsExpanded(true)
  }

  return (
    <div className="fixed bottom-6 left-0 right-0 z-[100] md:hidden px-6">
      <div className="flex items-center justify-between gap-3">
        <div
          className={cn(
            "relative overflow-hidden bg-primary/90 backdrop-blur-2xl rounded-full shadow-2xl border border-white/10 transition-all duration-500 ease-out",
            isExpanded ? "flex-1 h-14" : "h-16 w-16 flex-shrink-0",
          )}
        >
          {/* Search Icon Button - visible when collapsed */}
          <button
            onClick={handleSearchClick}
            className={cn(
              "absolute inset-0 flex items-center justify-center transition-opacity duration-300",
              isExpanded ? "opacity-0 pointer-events-none" : "opacity-100",
            )}
          >
            <Search className="h-6 w-6 text-primary-foreground" />
          </button>

          {/* Search Input - visible when expanded */}
          <div
            className={cn(
              "absolute inset-0 flex items-center px-5 transition-opacity duration-300",
              isExpanded ? "opacity-100 delay-200" : "opacity-0 pointer-events-none",
            )}
          >
            <Search className="h-5 w-5 text-primary-foreground/70 flex-shrink-0 mr-3" />
            <Input
              ref={inputRef}
              type="text"
              placeholder="Search..."
              value={query}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="flex-1 border-0 bg-transparent text-primary-foreground placeholder:text-primary-foreground/50 focus-visible:ring-0 focus-visible:ring-offset-0 h-full px-0"
            />
            {query && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-full ml-2 hover:bg-primary-foreground/10 flex-shrink-0"
                onClick={handleClear}
              >
                <X className="h-4 w-4 text-primary-foreground" />
              </Button>
            )}
            {!query && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-full ml-2 hover:bg-primary-foreground/10 flex-shrink-0"
                onClick={() => setIsExpanded(false)}
              >
                <X className="h-4 w-4 text-primary-foreground" />
              </Button>
            )}
          </div>
        </div>

        {/* Plus Button - always visible */}
        <Button
          size="lg"
          className="h-16 w-16 rounded-full shadow-2xl hover:scale-110 transition-transform flex-shrink-0 bg-primary/90 backdrop-blur-2xl border border-white/10"
          onClick={onAddClick}
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>
    </div>
  )
}
