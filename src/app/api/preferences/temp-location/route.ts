import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { handleGenericError } from '@/lib/api-errors'

// POST /api/preferences/temp-location - Set temporary location
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, lat, lon } = body

    // Validate input
    if (lat === undefined || lon === undefined) {
      return NextResponse.json(
        {
          success: false,
          message: 'lat and lon are required',
        },
        { status: 400 }
      )
    }

    // Update user preferences with temp location
    await prisma.userPreference.updateMany({
      data: {
        tempLocationName: name || null,
        tempLocationLat: parseFloat(lat),
        tempLocationLon: parseFloat(lon),
      },
    })

    return NextResponse.json({
      success: true,
      message: `Temporary location set: ${name || 'GPS location'}`,
    })
  } catch (error) {
    return handleGenericError(error, 'setting temporary location')
  }
}

// DELETE /api/preferences/temp-location - Clear temporary location
export async function DELETE() {
  try {
    // Clear temp location from user preferences
    await prisma.userPreference.updateMany({
      data: {
        tempLocationName: null,
        tempLocationLat: null,
        tempLocationLon: null,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Temporary location cleared',
    })
  } catch (error) {
    return handleGenericError(error, 'clearing temporary location')
  }
}
