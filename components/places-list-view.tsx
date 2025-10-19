"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronDown, ChevronRight, Map } from "lucide-react"
import { useState } from "react"

interface PlacesListViewProps {
  onSwitchToMap: () => void
}

export function PlacesListView({ onSwitchToMap }: PlacesListViewProps) {
  const [expandedCountries, setExpandedCountries] = useState<Set<string>>(new Set())

  // Mock data - in a real app, this would come from the backend
  const placesData = [
    {
      country: "France",
      cities: ["Paris", "Lyon", "Marseille", "Nice"],
      visitCount: 3,
    },
    {
      country: "Italy",
      cities: ["Rome", "Venice", "Florence", "Milan"],
      visitCount: 2,
    },
    {
      country: "Spain",
      cities: ["Barcelona", "Madrid", "Seville"],
      visitCount: 2,
    },
    {
      country: "Japan",
      cities: ["Tokyo", "Kyoto", "Osaka", "Hiroshima"],
      visitCount: 1,
    },
    {
      country: "USA",
      cities: ["New York", "Los Angeles", "San Francisco", "San Diego", "Santa Barbara"],
      visitCount: 4,
    },
    {
      country: "UK",
      cities: ["London", "Edinburgh", "Manchester"],
      visitCount: 2,
    },
    {
      country: "Germany",
      cities: ["Berlin", "Munich", "Hamburg"],
      visitCount: 1,
    },
    {
      country: "Australia",
      cities: ["Sydney", "Melbourne", "Brisbane"],
      visitCount: 1,
    },
    {
      country: "Canada",
      cities: ["Toronto", "Vancouver", "Montreal"],
      visitCount: 1,
    },
    {
      country: "Mexico",
      cities: ["Mexico City", "Cancun", "Playa del Carmen"],
      visitCount: 2,
    },
    {
      country: "Brazil",
      cities: ["Rio de Janeiro", "São Paulo"],
      visitCount: 1,
    },
    {
      country: "Thailand",
      cities: ["Bangkok", "Chiang Mai", "Phuket"],
      visitCount: 1,
    },
  ]

  const toggleCountry = (country: string) => {
    const newExpanded = new Set(expandedCountries)
    if (newExpanded.has(country)) {
      newExpanded.delete(country)
    } else {
      newExpanded.add(country)
    }
    setExpandedCountries(newExpanded)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            {placesData.length} countries • {placesData.reduce((acc, p) => acc + p.cities.length, 0)} cities
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={onSwitchToMap}>
          <Map className="h-4 w-4 mr-2" />
          Switch to map view
        </Button>
      </div>

      <div className="space-y-2 max-h-[60vh] overflow-y-auto">
        {placesData.map((place) => {
          const isExpanded = expandedCountries.has(place.country)
          return (
            <Card key={place.country} className="overflow-hidden">
              <button
                onClick={() => toggleCountry(place.country)}
                className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                  <div>
                    <p className="font-semibold text-foreground">{place.country}</p>
                    <p className="text-xs text-muted-foreground">
                      {place.cities.length} {place.cities.length === 1 ? "city" : "cities"}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">
                  {place.visitCount} {place.visitCount === 1 ? "trip" : "trips"}
                </span>
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 pt-0 border-t bg-muted/20">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-3">
                    {place.cities.map((city) => (
                      <div key={city} className="text-sm text-foreground py-1 px-2 rounded-md bg-background">
                        {city}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
