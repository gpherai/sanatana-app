import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { handleGenericError } from '@/lib/api-errors'
import {
  calculateSunTimes,
  calculateMoonTimes,
  calculateMoonPhase,
  type DailyAstronomyData,
} from '@/lib/moon-calculator'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Parse query parameters
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // Validate date parameters
    if (!startDate || !endDate) {
      return NextResponse.json(
        {
          success: false,
          message: 'startDate and endDate are required',
        },
        { status: 400 }
      )
    }

    // Get user preferences to determine active location
    const preferences = await prisma.userPreference.findFirst()

    if (!preferences) {
      return NextResponse.json(
        {
          success: false,
          message: 'User preferences not found',
        },
        { status: 404 }
      )
    }

    let dailyAstronomy: DailyAstronomyData[]

    // Check if using temporary location (GPS/travel mode)
    if (preferences.tempLocationLat && preferences.tempLocationLon) {
      // TEMP LOCATION: Calculate on-the-fly (runtime)
      console.log('📍 Using temporary location:', preferences.tempLocationName || 'GPS')

      const start = new Date(startDate)
      const end = new Date(endDate)
      const tempData: DailyAstronomyData[] = []

      // Generate for each day in range
      let currentDate = new Date(start)
      while (currentDate <= end) {
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

        // Calculate moon phase (same worldwide)
        const moonPhase = calculateMoonPhase(dateAtNoon)

        // Calculate sun/moon times for temp location
        const localDate = new Date(
          currentDate.getUTCFullYear(),
          currentDate.getUTCMonth(),
          currentDate.getUTCDate()
        )
        const sunTimes = calculateSunTimes(
          localDate,
          preferences.tempLocationLat,
          preferences.tempLocationLon
        )
        const moonTimes = calculateMoonTimes(
          localDate,
          preferences.tempLocationLat,
          preferences.tempLocationLon
        )

        tempData.push({
          date: dateAtNoon,
          percentageVisible: moonPhase.percentageVisible,
          isWaxing: moonPhase.isWaxing,
          phase: moonPhase.phase,
          sunrise: sunTimes.sunrise,
          sunset: sunTimes.sunset,
          moonrise: moonTimes.moonrise,
          moonset: moonTimes.moonset,
        })

        // Next day
        currentDate = new Date(currentDate)
        currentDate.setUTCDate(currentDate.getUTCDate() + 1)
      }

      dailyAstronomy = tempData
    } else {
      // SAVED LOCATION: Query from database (fast)
      const locationId = preferences.activeLocationId

      if (!locationId) {
        return NextResponse.json(
          {
            success: false,
            message: 'No active location set',
          },
          { status: 400 }
        )
      }

      console.log('📍 Using saved location ID:', locationId)

      // Query pre-generated data from database
      dailyAstronomy = await prisma.dailyAstronomy.findMany({
        where: {
          locationId,
          date: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        },
        orderBy: {
          date: 'asc',
        },
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        dailyAstronomy,
        count: dailyAstronomy.length,
        source: preferences.tempLocationLat ? 'temporary' : 'saved',
      },
    })
  } catch (error) {
    return handleGenericError(error, 'fetching daily astronomy data')
  }
}
