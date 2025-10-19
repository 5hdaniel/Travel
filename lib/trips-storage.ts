import { mockTrips, mockTripMembers } from "./mock-data"
import type { Trip, TripMember } from "./types"

const TRIPS_STORAGE_KEY = "travelshare_trips"
const TRIP_MEMBERS_STORAGE_KEY = "travelshare_trip_members"

export function getAllTrips(): Trip[] {
  if (typeof window === "undefined") return mockTrips

  try {
    const stored = localStorage.getItem(TRIPS_STORAGE_KEY)
    const customTrips = stored ? JSON.parse(stored) : []

    // Convert date strings back to Date objects
    const parsedCustomTrips = customTrips.map((trip: any) => ({
      ...trip,
      startDate: trip.startDate,
      endDate: trip.endDate,
      createdAt: new Date(trip.createdAt),
      updatedAt: new Date(trip.updatedAt),
    }))

    return [...mockTrips, ...parsedCustomTrips]
  } catch (error) {
    console.error("[v0] Error loading trips from storage:", error)
    return mockTrips
  }
}

export function getAllTripMembers(): TripMember[] {
  if (typeof window === "undefined") return mockTripMembers

  try {
    const stored = localStorage.getItem(TRIP_MEMBERS_STORAGE_KEY)
    const customMembers = stored ? JSON.parse(stored) : []

    // Convert date strings back to Date objects
    const parsedCustomMembers = customMembers.map((member: any) => ({
      ...member,
      joinedAt: new Date(member.joinedAt),
    }))

    return [...mockTripMembers, ...parsedCustomMembers]
  } catch (error) {
    console.error("[v0] Error loading trip members from storage:", error)
    return mockTripMembers
  }
}

export function saveTrip(trip: Trip): void {
  if (typeof window === "undefined") return

  try {
    const stored = localStorage.getItem(TRIPS_STORAGE_KEY)
    const customTrips = stored ? JSON.parse(stored) : []
    customTrips.push(trip)
    localStorage.setItem(TRIPS_STORAGE_KEY, JSON.stringify(customTrips))
    console.log("[v0] Trip saved to storage:", trip.id)
  } catch (error) {
    console.error("[v0] Error saving trip to storage:", error)
  }
}

export function saveTripMember(member: TripMember): void {
  if (typeof window === "undefined") return

  try {
    const stored = localStorage.getItem(TRIP_MEMBERS_STORAGE_KEY)
    const customMembers = stored ? JSON.parse(stored) : []
    customMembers.push(member)
    localStorage.setItem(TRIP_MEMBERS_STORAGE_KEY, JSON.stringify(customMembers))
    console.log("[v0] Trip member saved to storage:", member.id)
  } catch (error) {
    console.error("[v0] Error saving trip member to storage:", error)
  }
}

export function updateTrip(tripId: string, updates: Partial<Trip>): void {
  if (typeof window === "undefined") return

  try {
    const stored = localStorage.getItem(TRIPS_STORAGE_KEY)
    const customTrips = stored ? JSON.parse(stored) : []

    const tripIndex = customTrips.findIndex((t: Trip) => t.id === tripId)
    if (tripIndex >= 0) {
      customTrips[tripIndex] = { ...customTrips[tripIndex], ...updates, updatedAt: new Date() }
      localStorage.setItem(TRIPS_STORAGE_KEY, JSON.stringify(customTrips))
      console.log("[v0] Trip updated in storage:", tripId)
    }
  } catch (error) {
    console.error("[v0] Error updating trip in storage:", error)
  }
}

export function deleteTrip(tripId: string): void {
  if (typeof window === "undefined") return

  try {
    const stored = localStorage.getItem(TRIPS_STORAGE_KEY)
    const customTrips = stored ? JSON.parse(stored) : []

    const filteredTrips = customTrips.filter((t: Trip) => t.id !== tripId)
    localStorage.setItem(TRIPS_STORAGE_KEY, JSON.stringify(filteredTrips))
    console.log("[v0] Trip deleted from storage:", tripId)
  } catch (error) {
    console.error("[v0] Error deleting trip from storage:", error)
  }
}

export function getNextTripId(): string {
  const allTrips = getAllTrips()
  const maxId = Math.max(...allTrips.map((t) => Number.parseInt(t.id) || 0), 0)
  return String(maxId + 1)
}

export function getNextMemberId(): string {
  const allMembers = getAllTripMembers()
  const maxId = Math.max(...allMembers.map((m) => Number.parseInt(m.id) || 0), 0)
  return String(maxId + 1)
}
