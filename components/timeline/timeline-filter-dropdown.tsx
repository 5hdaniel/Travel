"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter } from "lucide-react"

type FilterType = "all" | "planned" | "in_progress" | "completed"
type ActivityType = "all" | "flight" | "hotel" | "car_rental" | "restaurant" | "attraction" | "custom"

interface TimelineFilterDropdownProps {
  statusFilter: FilterType
  typeFilter: ActivityType
  onStatusFilterChange: (value: FilterType) => void
  onTypeFilterChange: (value: ActivityType) => void
}

export function TimelineFilterDropdown({
  statusFilter,
  typeFilter,
  onStatusFilterChange,
  onTypeFilterChange,
}: TimelineFilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)

  const hasActiveFilters = statusFilter !== "all" || typeFilter !== "all"

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`relative ${hasActiveFilters ? "border-accent text-accent" : ""}`}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {hasActiveFilters && <div className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Filter Timeline</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Status</label>
            <Select value={statusFilter} onValueChange={onStatusFilterChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="planned">Planned</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Type</label>
            <Select value={typeFilter} onValueChange={onTypeFilterChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="flight">Flights</SelectItem>
                <SelectItem value="hotel">Hotels</SelectItem>
                <SelectItem value="car_rental">Car Rentals</SelectItem>
                <SelectItem value="restaurant">Restaurants</SelectItem>
                <SelectItem value="attraction">Attractions</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={() => {
                onStatusFilterChange("all")
                onTypeFilterChange("all")
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
