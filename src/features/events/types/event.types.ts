/**
 * Event Types
 * Type definitions for events
 */

import { EventType, EventColor, Tithi, Nakshatra, Paksha } from '@/core/config/constants'

export interface Event {
  id: number
  title: string
  description: string | null
  eventType: EventType
  startDate: Date
  endDate: Date | null
  isAllDay: boolean
  color: EventColor
  categoryId: number | null
  isRecurring: boolean
  recurrenceRule: string | null
  lunarDate: LunarDate | null
  location: string | null
  reminder: boolean
  reminderMinutes: number | null
  createdAt: Date
  updatedAt: Date
}

export interface LunarDate {
  tithi: Tithi
  paksha: Paksha
  nakshatra: Nakshatra
  hinduMonth: string
}

export interface CreateEventInput {
  title: string
  description?: string
  eventType: EventType
  startDate: Date | string
  endDate?: Date | string
  isAllDay?: boolean
  color?: EventColor
  categoryId?: number
  isRecurring?: boolean
  recurrenceRule?: string
  lunarDate?: LunarDate
  location?: string
  reminder?: boolean
  reminderMinutes?: number
}

export interface UpdateEventInput extends Partial<CreateEventInput> {
  id: number
}

export interface EventFilters {
  eventTypes?: EventType[]
  categoryIds?: number[]
  startDate?: string
  endDate?: string
  searchQuery?: string
  isRecurring?: boolean
}

export interface EventWithCategory extends Event {
  category: {
    id: number
    name: string
    color: string
    icon: string
  } | null
}
