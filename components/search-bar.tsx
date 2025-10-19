"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search, X, MapPin, Calendar, Users, Plane, Hotel, UtensilsCrossed, Building } from "lucide-react"
import { cn } from "@/lib/utils"

interface SearchBarProps {
  onSearch: (query: string) => void
  className?: string
  variant?: "desktop" | "mobile"
}

export function SearchBar({ onSearch, className, variant = "mobile" }: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [showHelper, setShowHelper] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const hasSearchedBefore = localStorage.getItem("hasSearched")
    if (hasSearchedBefore) {
      setHasInteracted(true)
    }
  }, [])

  const handleSearch = (value: string) => {
    setQuery(value)
    onSearch(value)

    if (!hasInteracted && value.length > 0) {
      localStorage.setItem("hasSearched", "true")
      setShowHelper(false)
      setHasInteracted(true)
    }
  }

  const handleFocus = () => {
    if (!hasInteracted) {
      setShowHelper(true)
    }
  }

  const handleClear = () => {
    setQuery("")
    onSearch("")
  }

  const searchExamples = [
    { icon: MapPin, text: "Paris, Tokyo, Rome" },
    { icon: Calendar, text: "February 2025" },
    { icon: Users, text: "Sarah, Mike" },
    { icon: Plane, text: "Air France, JL006" },
    { icon: Hotel, text: "Hotel Le Marais" },
    { icon: UtensilsCrossed, text: "Sushi Saito" },
    { icon: Building, text: "Louvre Museum" },
  ]

  return (
    <div className={cn("relative", className)}>
      {showHelper && (
        <Card className="absolute top-full mt-3 left-1/2 -translate-x-1/2 w-max max-w-md shadow-2xl border-accent/20 animate-in fade-in slide-in-from-top-2 z-[60]">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-2 mb-3">
              <p className="text-sm font-medium text-foreground">Search</p>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 -mt-1" onClick={() => setShowHelper(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {searchExamples.map((example, index) => {
                const Icon = example.icon
                return (
                  <div key={index} className="flex items-center gap-2 text-xs text-muted-foreground whitespace-nowrap">
                    <Icon className="h-3 w-3 flex-shrink-0" />
                    <span>{example.text}</span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search trips, activities, destinations..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={handleFocus}
          className={cn(
            "pl-11 pr-10 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0",
            variant === "desktop" ? "h-11 rounded-full" : "h-10 text-base rounded-full",
          )}
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 rounded-full"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
