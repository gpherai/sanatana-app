/**
 * Lunar Types
 * Type definitions for lunar data
 */

import { LunarPhase, Tithi, Nakshatra, Paksha } from '@/core/config/constants'

export interface LunarData {
  date: Date
  phase: LunarPhase
  illumination: number
  tithi: Tithi
  paksha: Paksha
  nakshatra: Nakshatra
  hinduMonth: string
  moonrise: Date | null
  moonset: Date | null
}

export interface MoonCalculationInput {
  date: Date
  latitude: number
  longitude: number
  timezone: string
}
