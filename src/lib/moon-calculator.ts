// Moon phase AND sun/moon times calculation utilities using SunCalc
import SunCalc from 'suncalc'
import { MoonPhaseType } from '@prisma/client'

/**
 * Default location: Den Haag, Netherlands
 */
const DEFAULT_LATITUDE = 52.08
const DEFAULT_LONGITUDE = 4.31

/**
 * Moon phase data structure (basic - no location data)
 */
export interface MoonPhaseData {
  date: Date
  percentageVisible: number
  isWaxing: boolean
  phase: MoonPhaseType | null
}

/**
 * Daily astronomy data structure (extends MoonPhaseData with location-specific sun/moon times)
 */
export interface DailyAstronomyData extends MoonPhaseData {
  sunrise?: string // HH:mm format
  sunset?: string // HH:mm format
  moonrise?: string // HH:mm format
  moonset?: string // HH:mm format
}

/**
 * Determine special phase type based on moon illumination fraction
 * SunCalc returns fraction 0-1 where:
 * - 0.0 = New Moon
 * - 0.25 = First Quarter
 * - 0.5 = Full Moon
 * - 0.75 = Last Quarter
 */
function getPhaseType(fraction: number): MoonPhaseType | null {
  // Allow small tolerance (±0.02) for special phases
  const tolerance = 0.02

  if (Math.abs(fraction - 0.0) < tolerance) return MoonPhaseType.NEW_MOON
  if (Math.abs(fraction - 0.25) < tolerance) return MoonPhaseType.FIRST_QUARTER
  if (Math.abs(fraction - 0.5) < tolerance) return MoonPhaseType.FULL_MOON
  if (Math.abs(fraction - 0.75) < tolerance) return MoonPhaseType.LAST_QUARTER

  return null // Not a special phase
}

/**
 * Calculate moon phase data for a specific date
 * @param date - Date to calculate moon phase for
 * @returns Moon phase data with percentage, waxing/waning, and special phase
 */
export function calculateMoonPhase(date: Date): MoonPhaseData {
  const illumination = SunCalc.getMoonIllumination(date)

  // SunCalc returns:
  // - fraction: illuminated fraction (0-1)
  // - phase: moon phase value
  //   - 0: New Moon
  //   - 0.25: First Quarter
  //   - 0.5: Full Moon
  //   - 0.75: Last Quarter
  //   - Values increase over lunar cycle

  const percentage = Math.round(illumination.fraction * 100)

  // Determine waxing vs waning
  // Phase 0-0.5 = waxing (new to full)
  // Phase 0.5-1 = waning (full to new)
  const isWaxing = illumination.phase < 0.5

  // Check if it's a special phase
  const phase = getPhaseType(illumination.phase)

  return {
    date,
    percentageVisible: percentage,
    isWaxing,
    phase,
  }
}

/**
 * Calculate sunrise and sunset times for a specific date and location
 * @param date - Date to calculate sun times for
 * @param latitude - Location latitude (default: Den Haag)
 * @param longitude - Location longitude (default: Den Haag)
 * @returns Object with sunrise and sunset in HH:mm format
 */
export function calculateSunTimes(
  date: Date,
  latitude: number = DEFAULT_LATITUDE,
  longitude: number = DEFAULT_LONGITUDE
): { sunrise: string; sunset: string } {
  const times = SunCalc.getTimes(date, latitude, longitude)

  // Format to HH:mm
  const formatTime = (d: Date): string => {
    const hours = d.getHours().toString().padStart(2, '0')
    const minutes = d.getMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes}`
  }

  return {
    sunrise: formatTime(times.sunrise),
    sunset: formatTime(times.sunset),
  }
}

/**
 * Calculate moonrise and moonset times for a specific date and location
 * @param date - Date to calculate moon times for
 * @param latitude - Location latitude (default: Den Haag)
 * @param longitude - Location longitude (default: Den Haag)
 * @returns Object with moonrise and moonset in HH:mm format, or null if moon doesn't rise/set
 */
export function calculateMoonTimes(
  date: Date,
  latitude: number = DEFAULT_LATITUDE,
  longitude: number = DEFAULT_LONGITUDE
): { moonrise: string | null; moonset: string | null } {
  const times = SunCalc.getMoonTimes(date, latitude, longitude)

  // Format to HH:mm
  const formatTime = (d: Date | null): string | null => {
    if (!d) return null
    const hours = d.getHours().toString().padStart(2, '0')
    const minutes = d.getMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes}`
  }

  return {
    moonrise: formatTime(times.rise),
    moonset: formatTime(times.set),
  }
}

/**
 * Generate daily astronomy data (moon + sun/moon times) for every day in a year
 * @param year - Year to generate data for (e.g., 2025)
 * @param latitude - Location latitude (default: Den Haag)
 * @param longitude - Location longitude (default: Den Haag)
 * @returns Array of daily astronomy data for each day
 */
export function generateDailyAstronomyForYear(
  year: number,
  latitude: number = DEFAULT_LATITUDE,
  longitude: number = DEFAULT_LONGITUDE
): DailyAstronomyData[] {
  const astronomyData: DailyAstronomyData[] = []

  // Generate for every day of the year
  const startDate = new Date(Date.UTC(year, 0, 1)) // January 1st
  const endDate = new Date(Date.UTC(year, 11, 31)) // December 31st

  let currentDate = new Date(startDate)

  while (currentDate <= endDate) {
    // Calculate at noon UTC for consistency
    const dateAtNoon = new Date(
      Date.UTC(
        currentDate.getUTCFullYear(),
        currentDate.getUTCMonth(),
        currentDate.getUTCDate(),
        12,
        0,
        0
      )
    )

    // Calculate moon phase
    const phaseData = calculateMoonPhase(dateAtNoon)

    // Calculate sun times (use local date for accurate times)
    const localDate = new Date(
      currentDate.getUTCFullYear(),
      currentDate.getUTCMonth(),
      currentDate.getUTCDate()
    )
    const sunTimes = calculateSunTimes(localDate, latitude, longitude)
    const moonTimes = calculateMoonTimes(localDate, latitude, longitude)

    // Combine data
    astronomyData.push({
      ...phaseData,
      sunrise: sunTimes.sunrise,
      sunset: sunTimes.sunset,
      moonrise: moonTimes.moonrise ?? undefined,
      moonset: moonTimes.moonset ?? undefined,
    })

    // Move to next day
    currentDate = new Date(currentDate)
    currentDate.setUTCDate(currentDate.getUTCDate() + 1)
  }

  return astronomyData
}

/**
 * Get daily astronomy data for a specific date (convenience function)
 * @param dateString - ISO date string (YYYY-MM-DD)
 * @returns Daily astronomy data
 */
export function getDailyAstronomyForDate(dateString: string): DailyAstronomyData {
  const date = new Date(dateString + 'T12:00:00Z') // Noon UTC
  const localDate = new Date(dateString)

  const phaseData = calculateMoonPhase(date)
  const sunTimes = calculateSunTimes(localDate)
  const moonTimes = calculateMoonTimes(localDate)

  return {
    ...phaseData,
    sunrise: sunTimes.sunrise,
    sunset: sunTimes.sunset,
    moonrise: moonTimes.moonrise ?? undefined,
    moonset: moonTimes.moonset ?? undefined,
  }
}
