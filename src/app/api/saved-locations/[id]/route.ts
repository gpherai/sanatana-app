import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { handleGenericError, notFoundError } from '@/lib/api-errors'
import { Prisma } from '@prisma/client'

// PUT /api/saved-locations/[id] - Update saved location
export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params
    const id = parseInt(params.id)
    const body = await request.json()
    const { name, lat, lon, isPrimary, setActive } = body

    // Check if location exists
    const existing = await prisma.savedLocation.findUnique({
      where: { id },
    })

    if (!existing) {
      return notFoundError('Saved location')
    }

    // If setting as primary, unset all other primary flags
    if (isPrimary === true) {
      await prisma.savedLocation.updateMany({
        where: { isPrimary: true, id: { not: id } },
        data: { isPrimary: false },
      })
    }

    // Update location
    const updateData: Prisma.SavedLocationUpdateInput = {}
    if (name !== undefined) updateData.name = name
    if (lat !== undefined) updateData.lat = parseFloat(lat)
    if (lon !== undefined) updateData.lon = parseFloat(lon)
    if (isPrimary !== undefined) updateData.isPrimary = isPrimary

    const location = await prisma.savedLocation.update({
      where: { id },
      data: updateData,
    })

    // If setActive flag is true, update user preferences
    if (setActive === true) {
      await prisma.userPreference.updateMany({
        data: {
          activeLocationId: id,
          // Clear temporary location when switching to saved
          tempLocationName: null,
          tempLocationLat: null,
          tempLocationLon: null,
        },
      })
    }

    return NextResponse.json({
      success: true,
      data: { location },
      message: `Location "${location.name}" updated`,
    })
  } catch (error) {
    return handleGenericError(error, 'updating saved location')
  }
}

// DELETE /api/saved-locations/[id] - Delete saved location
export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params
    const id = parseInt(params.id)

    // Check if location exists
    const existing = await prisma.savedLocation.findUnique({
      where: { id },
    })

    if (!existing) {
      return notFoundError('Saved location')
    }

    // Don't allow deleting if it's the active location
    const preferences = await prisma.userPreference.findFirst()
    if (preferences?.activeLocationId === id) {
      return NextResponse.json(
        {
          success: false,
          message: 'Cannot delete active location. Please switch to another location first.',
        },
        { status: 400 }
      )
    }

    // Delete location (cascade deletes astronomy data)
    await prisma.savedLocation.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: `Location "${existing.name}" deleted`,
    })
  } catch (error) {
    return handleGenericError(error, 'deleting saved location')
  }
}
