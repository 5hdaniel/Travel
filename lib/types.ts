export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  createdAt: Date
  updatedAt: Date
}

export interface Trip {
  id: string
  name: string
  description?: string
  startDate: Date
  endDate: Date
  coverImage?: string
  ownerId: string
  isPublic: boolean
  isArchived?: boolean
  createdAt: Date
  updatedAt: Date
  locationPermissions?: {
    admin: { canView: boolean; canShare: boolean; canManage: boolean }
    participant: { canView: boolean; canShare: boolean; canManage: boolean }
    commentor: { canView: boolean; canShare: boolean; canManage: boolean }
    viewer: { canView: boolean; canShare: boolean; canManage: boolean }
  }
}

export interface TripMember {
  id: string
  tripId: string
  userId: string
  role: "admin" | "participant" | "commentor" | "viewer"
  joinedAt: Date
}

export interface Activity {
  id: string
  tripId: string
  createdBy?: string
  userId?: string
  type: "sightseeing" | "dining" | "accommodation" | "transportation" | "activity" | "note" | "other"
  title: string
  description?: string
  scheduledFor?: Date
  startTime?: Date
  endTime?: Date
  location?:
    | string
    | {
        name: string
        address: string
        coordinates: {
          lat: number
          lng: number
        }
      }
  images?: string[]
  metadata?: Record<string, any>
  status: "planned" | "in_progress" | "completed"
  createdAt: Date
  updatedAt: Date
}

export interface Comment {
  id: string
  activityId: string
  userId: string
  content: string
  createdAt: Date
  updatedAt: Date
}

export interface Reaction {
  id: string
  activityId: string
  userId: string
  emoji: string
  createdAt: Date
}

export interface Invitation {
  id: string
  tripId: string
  email: string
  role: "admin" | "participant" | "commentor" | "viewer"
  token: string
  expiresAt: Date
  acceptedAt?: Date
  createdAt: Date
}

export interface LocationUpdate {
  id: string
  userId: string
  tripId: string
  coordinates: {
    lat: number
    lng: number
  }
  accuracy?: number
  timestamp: Date
}

export interface DayNote {
  id: string
  tripId: string
  date: string // Format: yyyy-MM-dd
  userId: string
  content: string
  createdAt: Date
  updatedAt: Date
}

// Activity template types for different activity categories
export interface FlightMetadata {
  // Booking Information
  confirmationNumber?: string
  bookingDate?: string
  totalCost?: number
  currency?: string

  // Airline Information
  operatingAirline?: string
  operatingFlightNumber?: string
  soldByAirline?: string
  soldByFlightNumber?: string

  // Flight Details
  aircraft?: string
  stops?: number
  fareClass?: string
  fareRules?: string
  distanceMiles?: number

  // Airport Information
  departureAirport: string
  departureGate?: string
  departureTerminal?: string
  arrivalAirport: string
  arrivalGate?: string
  arrivalTerminal?: string

  // Duration
  durationMinutes?: number

  // Scheduled Times
  scheduledDepartureDate?: string
  scheduledDepartureTime?: string
  scheduledDepartureTimezone?: string
  scheduledArrivalDate?: string
  scheduledArrivalTime?: string
  scheduledArrivalTimezone?: string

  // Actual Times
  actualDepartureDate?: string
  actualDepartureTime?: string
  actualDepartureTimezone?: string
  actualDepartureGate?: string
  actualArrivalDate?: string
  actualArrivalTime?: string
  actualArrivalTimezone?: string
  actualArrivalGate?: string
  baggageClaimCarousel?: string

  // Legacy fields for backward compatibility
  airline?: string
  flightNumber?: string
  seat?: string
  durationKm?: number
}

export interface CarRentalMetadata {
  company?: string
  confirmationNumber?: string
  pickupAddress?: string
  pickupDate?: string
  pickupTime?: string
  pickupTimezone?: string
  dropoffAddress?: string
  dropoffDate?: string
  dropoffTime?: string
  dropoffTimezone?: string
  dropoffLocationPhone?: string
  carType?: string
}

export interface HotelMetadata {
  hotelName?: string
  checkinDate?: string
  checkinTime?: string
  checkinTimezone?: string
  address?: string
  phone?: string
  confirmationNumber?: string
  totalCost?: number
  currency?: string
  numberOfGuests?: number
  restrictions?: string
}

export interface RestaurantMetadata {
  restaurantName?: string
  reservationDate?: string
  reservationTime?: string
  reservationTimezone?: string
  cancellationPolicy?: string
  phone?: string
  address?: string
  numberOfPeople?: number
}

export interface TrainMetadata {
  trainCompany?: string
  trainNumber?: string
  confirmationNumber?: string
  departureStation?: string
  arrivalStation?: string
  departureDate?: string
  departureTime?: string
  departureTimezone?: string
  arrivalDate?: string
  arrivalTime?: string
  arrivalTimezone?: string
  seatNumber?: string
  carNumber?: string
  class?: string
}

export interface BusMetadata {
  busCompany?: string
  busNumber?: string
  confirmationNumber?: string
  departureStation?: string
  arrivalStation?: string
  departureDate?: string
  departureTime?: string
  departureTimezone?: string
  arrivalDate?: string
  arrivalTime?: string
  arrivalTimezone?: string
  seatNumber?: string
}

export interface FerryMetadata {
  ferryCompany?: string
  ferryName?: string
  confirmationNumber?: string
  departurePort?: string
  arrivalPort?: string
  departureDate?: string
  departureTime?: string
  departureTimezone?: string
  arrivalDate?: string
  arrivalTime?: string
  arrivalTimezone?: string
  cabinNumber?: string
  vehicleIncluded?: boolean
}

export interface AttractionMetadata {
  category: string
  ticketInfo?: string
  duration?: string
  website?: string
}

export interface NoteMetadata {
  autoLocation?: boolean
  capturedAt?: Date
}
