/**
 * Settings Types
 * Type definitions for user settings
 */

import { Location } from '@/shared/types'

export interface UserPreferences {
  id: number
  defaultView: 'month' | 'week' | 'day'
  showLunarInfo: boolean
  showHolidays: boolean
  notifications: boolean
  tempLocation: Location | null
  createdAt: Date
  updatedAt: Date
}

export interface UpdatePreferencesInput {
  defaultView?: 'month' | 'week' | 'day'
  showLunarInfo?: boolean
  showHolidays?: boolean
  notifications?: boolean
}

export interface SavedLocation extends Location {
  id: number
  isDefault: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CreateLocationInput {
  latitude: number
  longitude: number
  timezone: string
  name: string
  isDefault?: boolean
}

export interface UpdateLocationInput extends Partial<CreateLocationInput> {
  id: number
}
