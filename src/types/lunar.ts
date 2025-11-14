// Lunar calendar related TypeScript types
import { LUNAR_TYPES } from '@/config/constants'

// Generate type dynamically from constants for automatic sync
export type LunarType = (typeof LUNAR_TYPES)[number]['value']

export interface LunarEvent {
  id: number
  date: Date
  time?: string | null
  type: LunarType
  tithi?: string | null
  nakshatra?: string | null
  createdAt: Date
}

export interface LunarPhaseInfo {
  phase: number // 0-1 (0=new, 0.25=first quarter, 0.5=full, 0.75=last quarter)
  phaseName:
    | 'New Moon'
    | 'Waxing Crescent'
    | 'First Quarter'
    | 'Waxing Gibbous'
    | 'Full Moon'
    | 'Waning Gibbous'
    | 'Last Quarter'
    | 'Waning Crescent'
  illumination: number // 0-1
  isWaxing: boolean
}

export interface TithiInfo {
  number: number // 1-30
  name: string
  paksha: 'Shukla' | 'Krishna'
}
