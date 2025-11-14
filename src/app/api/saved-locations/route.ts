import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { handleGenericError } from '@/lib/api-errors'
import { generateDailyAstronomyForYear, type DailyAstronomyData } from '@/lib/moon-calculator'

// GET /api/saved-locations - Get all saved locations
export async function GET() {
  try {
    const locations = await prisma.savedLocation.findMany({
      orderBy: [
        { isPrimary: 'desc' }, // Primary first
        { createdAt: 'asc' }, // Then by creation date
      ],
      include: {
        _count: {
          select: {
            dailyAstronomy: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        locations,
        count: locations.length,
      },
    })
  } catch (error) {
    return handleGenericError(error, 'fetching saved locations')
  }
}

// POST /api/saved-locations - Add new saved location
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, lat, lon, isPrimary } = body

    // Validate input
    if (!name || lat === undefined || lon === undefined) {
      return NextResponse.json(
        {
          success: false,
          message: 'name, lat, and lon are required',
        },
        { status: 400 }
      )
    }

    // If setting as primary, unset all other primary flags
    if (isPrimary) {
      await prisma.savedLocation.updateMany({
        where: { isPrimary: true },
        data: { isPrimary: false },
      })
    }

    // Create location
    const location = await prisma.savedLocation.create({
      data: {
        name,
        lat: parseFloat(lat),
        lon: parseFloat(lon),
        isPrimary: isPrimary ?? false,
      },
    })

    // Generate astronomy data for this location
    // Rest of 2025 + Full 2026 + Full 2027
    console.log(`🌙 Generating astronomy data for "${location.name}"...`)

    const today = new Date()
    const currentYear = today.getFullYear()
    const allAstronomyData: DailyAstronomyData[] = []

    // 2025 (rest of year)
    if (currentYear === 2025) {
      const astronomy2025 = generateDailyAstronomyForYear(2025, location.lat, location.lon)
      const filtered2025 = astronomy2025.filter((day) => day.date >= today)
      allAstronomyData.push(...filtered2025)
    }

    // 2026 (full year)
    const astronomy2026 = generateDailyAstronomyForYear(2026, location.lat, location.lon)
    allAstronomyData.push(...astronomy2026)

    // 2027 (full year)
    const astronomy2027 = generateDailyAstronomyForYear(2027, location.lat, location.lon)
    allAstronomyData.push(...astronomy2027)

    // Insert into database
    await prisma.dailyAstronomy.createMany({
      data: allAstronomyData.map((data) => ({
        date: data.date,
        locationId: location.id,
        percentageVisible: data.percentageVisible,
        isWaxing: data.isWaxing,
        phase: data.phase,
        sunrise: data.sunrise,
        sunset: data.sunset,
        moonrise: data.moonrise,
        moonset: data.moonset,
      })),
    })

    console.log(`✅ Generated ${allAstronomyData.length} entries for "${location.name}"`)

    // If this is primary, update user preferences
    if (isPrimary) {
      await prisma.userPreference.updateMany({
        data: {
          activeLocationId: location.id,
        },
      })
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          location,
          entriesGenerated: allAstronomyData.length,
        },
        message: `Location "${name}" created with ${allAstronomyData.length} astronomy entries`,
      },
      { status: 201 }
    )
  } catch (error) {
    return handleGenericError(error, 'creating saved location')
  }
}
