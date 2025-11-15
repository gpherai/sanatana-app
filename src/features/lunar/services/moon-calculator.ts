/**
 * Moon Calculator Service
 * Calculates lunar phases and Hindu lunar calendar data
 * This is a simplified implementation - in production, use a specialized astronomy library
 */

import { LunarPhase, TITHIS, NAKSHATRAS, PAKSHAS, HINDU_MONTHS } from '@/core/config/constants'
import { LunarData, MoonCalculationInput } from '../types/lunar.types'
import { AppError } from '@/core/errors/AppError'

export class MoonCalculatorService {
  /**
   * Calculates lunar data for a given date and location
   * NOTE: This is a simplified implementation for demonstration
   * In production, use libraries like suncalc, astronomia, or call an astronomy API
   */
  async calculateLunarData(input: MoonCalculationInput): Promise<LunarData> {
    try {
      const { date, latitude, longitude } = input

      // Validate coordinates
      if (latitude < -90 || latitude > 90) {
        throw AppError.validation('Invalid latitude', { latitude })
      }
      if (longitude < -180 || longitude > 180) {
        throw AppError.validation('Invalid longitude', { longitude })
      }

      // Calculate days since a known new moon (J2000.0)
      const knownNewMoon = new Date('2000-01-06T18:14:00Z')
      const daysSinceKnownNewMoon = (date.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24)

      // Lunar cycle is approximately 29.53 days
      const lunarCycle = 29.53058867
      const currentCycle = daysSinceKnownNewMoon % lunarCycle

      // Calculate illumination (0-1)
      const illumination = (1 - Math.cos((currentCycle / lunarCycle) * 2 * Math.PI)) / 2

      // Determine phase
      const phase = this.getPhaseFromIllumination(currentCycle / lunarCycle)

      // Calculate tithi (lunar day)
      const tithiIndex = Math.floor((currentCycle / lunarCycle) * 30) % 15
      const tithi = TITHIS[tithiIndex] ?? TITHIS[0]

      // Determine paksha (fortnight)
      const paksha = currentCycle < lunarCycle / 2 ? PAKSHAS[0] : PAKSHAS[1]

      // Calculate nakshatra (lunar mansion)
      const nakshatraIndex = Math.floor((currentCycle / lunarCycle) * 27) % 27
      const nakshatra = NAKSHATRAS[nakshatraIndex] ?? NAKSHATRAS[0]

      // Get Hindu month (simplified - based on solar month approximation)
      const monthIndex = date.getMonth()
      const hinduMonth = HINDU_MONTHS[monthIndex] ?? HINDU_MONTHS[0]

      return {
        date,
        phase: phase ?? 'NEW_MOON',
        illumination: Math.round(illumination * 100) / 100,
        tithi: tithi ?? 'Pratipada',
        paksha: paksha ?? 'Shukla Paksha',
        nakshatra: nakshatra ?? 'Ashwini',
        hinduMonth: hinduMonth ?? 'Chaitra',
        moonrise: null, // Would need proper astronomy calculations
        moonset: null    // Would need proper astronomy calculations
      }
    } catch (error) {
      if (error instanceof AppError) {
        throw error
      }
      throw AppError.internal('Moon calculation failed', error)
    }
  }

  private getPhaseFromIllumination(cyclePosition: number): LunarPhase {
    if (cyclePosition < 0.03 || cyclePosition > 0.97) return 'NEW_MOON'
    if (cyclePosition >= 0.03 && cyclePosition < 0.22) return 'WAXING_CRESCENT'
    if (cyclePosition >= 0.22 && cyclePosition < 0.28) return 'FIRST_QUARTER'
    if (cyclePosition >= 0.28 && cyclePosition < 0.47) return 'WAXING_GIBBOUS'
    if (cyclePosition >= 0.47 && cyclePosition < 0.53) return 'FULL_MOON'
    if (cyclePosition >= 0.53 && cyclePosition < 0.72) return 'WANING_GIBBOUS'
    if (cyclePosition >= 0.72 && cyclePosition < 0.78) return 'LAST_QUARTER'
    return 'WANING_CRESCENT'
  }

  /**
   * Gets lunar data for a date range
   */
  async getLunarDataRange(
    startDate: Date,
    endDate: Date,
    latitude: number,
    longitude: number,
    timezone: string
  ): Promise<LunarData[]> {
    const results: LunarData[] = []
    const currentDate = new Date(startDate)

    while (currentDate <= endDate) {
      const lunarData = await this.calculateLunarData({
        date: new Date(currentDate),
        latitude,
        longitude,
        timezone
      })
      results.push(lunarData)
      currentDate.setDate(currentDate.getDate() + 1)
    }

    return results
  }
}

export const moonCalculator = new MoonCalculatorService()
