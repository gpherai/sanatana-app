// API request/response TypeScript types

import type { Event, EventOccurrence, EventFormData } from './event'
import type { LunarEvent } from './lunar'
import type { Theme, UserPreference } from './theme'

// Generic API Response
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Events API
export interface GetEventsParams {
  startDate?: string // ISO date
  endDate?: string // ISO date
  types?: string[]
  categoryIds?: number[]
}

export interface GetEventsResponse {
  events: Event[]
  occurrences: EventOccurrence[]
}

export type CreateEventRequest = EventFormData

export interface CreateEventResponse {
  event: Event
  occurrence: EventOccurrence
}

// Lunar API
export interface GetLunarEventsParams {
  startDate?: string
  endDate?: string
  types?: string[]
}

export interface GetLunarEventsResponse {
  lunarEvents: LunarEvent[]
}

// Themes API
export interface GetThemesResponse {
  themes: Theme[]
  current: string
}

// Preferences API
export interface UpdatePreferencesRequest {
  currentTheme?: string
  defaultView?: string
  weekStartsOn?: number
  visibleTypes?: string[]
  visibleCategories?: number[]
  locationName?: string
  locationLat?: number
  locationLon?: number
  timezone?: string
  notificationsEnabled?: boolean
  notificationDaysBefore?: number
}

export interface GetPreferencesResponse {
  preferences: UserPreference
}
