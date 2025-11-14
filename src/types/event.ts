// Event related TypeScript types
import { EVENT_TYPES, RECURRENCE_TYPES, EVENT_SOURCES } from '@/config/constants'

// Generate types dynamically from constants for automatic sync
export type EventType = (typeof EVENT_TYPES)[number]['value']
export type RecurrenceType = (typeof RECURRENCE_TYPES)[number]['value']
export type EventSource = (typeof EVENT_SOURCES)[number]['value']

export interface EventCategory {
  id: number
  name: string
  description?: string | null
  icon?: string | null
  createdAt: Date
}

export interface Event {
  id: number
  name: string
  description?: string | null
  type: EventType
  categoryId?: number | null
  category?: EventCategory | null
  isRecurring: boolean
  recurrenceType: RecurrenceType
  source: EventSource
  apiId?: string | null
  importance: number
  tags: string[] // Native array
  createdAt: Date
  updatedAt: Date
}

export interface EventOccurrence {
  id: number
  eventId: number
  event?: Event
  date: Date
  startTime?: string | null
  endTime?: string | null
  tithi?: string | null
  nakshatra?: string | null
  paksha?: string | null
  maas?: string | null
  moonPhase?: number | null
  sunrise?: string | null
  sunset?: string | null
  locationLat?: number | null
  locationLon?: number | null
  createdAt: Date
}

export interface EventFormData {
  name: string
  description?: string
  type: EventType
  categoryId?: number
  isRecurring: boolean
  recurrenceType: RecurrenceType
  importance: number
  tags?: string[]
  // Occurrence data
  date: Date
  startTime?: string
  endTime?: string
  tithi?: string
  nakshatra?: string
  paksha?: string
  maas?: string
}
