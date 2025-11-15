/**
 * Daily Astronomy API Route
 * GET /api/daily-astronomy - Get lunar data for a specific date and location
 */

import { NextRequest } from 'next/server'
import { moonCalculator } from '@/features/lunar/services/moon-calculator'
import { handleApiError } from '@/core/errors/error-handler'
import { success } from '@/core/lib/api-response'
import { AppError } from '@/core/errors/AppError'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl

    const dateStr = searchParams.get('date')
    const latStr = searchParams.get('latitude')
    const lngStr = searchParams.get('longitude')
    const timezone = searchParams.get('timezone') || 'Asia/Kolkata'

    if (!latStr || !lngStr) {
      throw AppError.badRequest('Latitude and longitude are required')
    }

    const date = dateStr ? new Date(dateStr) : new Date()
    const latitude = parseFloat(latStr)
    const longitude = parseFloat(lngStr)

    const lunarData = await moonCalculator.calculateLunarData({
      date,
      latitude,
      longitude,
      timezone
    })

    return success(lunarData)
  } catch (error) {
    return handleApiError(error)
  }
}
