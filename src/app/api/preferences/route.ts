import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { userPreferencesSchema } from '@/lib/validations'
import { handleGenericError } from '@/lib/api-errors'
import { CalendarView, Prisma } from '@prisma/client'

// GET /api/preferences - Fetch user preferences (upsert: create if not exists)
export async function GET() {
  try {
    // Single user app - always use id: 1
    let preferences = await prisma.userPreference.findUnique({
      where: { id: 1 },
    })

    // If no preferences exist, create default
    if (!preferences) {
      preferences = await prisma.userPreference.create({
        data: {
          id: 1,
          currentTheme: 'spiritual-minimal',
          defaultView: CalendarView.month,
          weekStartsOn: 0,
          visibleTypes: [],
          visibleCategories: [],
          timezone: 'Europe/Amsterdam',
          notificationsEnabled: false,
          notificationDaysBefore: 1,
        },
      })
    }

    return NextResponse.json({
      success: true,
      data: { preferences },
    })
  } catch (error) {
    return handleGenericError(error, 'fetching preferences')
  }
}

// PUT /api/preferences - Update user preferences
export async function PUT(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json()

    // Validate with Zod schema (partial update)
    const validatedData = userPreferencesSchema.partial().parse(body)

    // Cast defaultView to CalendarView enum if present
    const updateData: Prisma.UserPreferenceUpdateInput = { ...validatedData }
    if (updateData.defaultView) {
      updateData.defaultView = updateData.defaultView as CalendarView
    }

    // Single user app - always update id: 1
    // Use upsert to handle case where preferences don't exist yet
    const preferences = await prisma.userPreference.upsert({
      where: { id: 1 },
      update: updateData,
      create: {
        id: 1,
        currentTheme: validatedData.currentTheme ?? 'spiritual-minimal',
        defaultView: (validatedData.defaultView as CalendarView | undefined) ?? CalendarView.month,
        weekStartsOn: validatedData.weekStartsOn ?? 0,
        visibleTypes: validatedData.visibleTypes ?? [],
        visibleCategories: validatedData.visibleCategories ?? [],
        locationName: validatedData.locationName,
        locationLat: validatedData.locationLat,
        locationLon: validatedData.locationLon,
        timezone: validatedData.timezone ?? 'Europe/Amsterdam',
        notificationsEnabled: validatedData.notificationsEnabled ?? false,
        notificationDaysBefore: validatedData.notificationDaysBefore ?? 1,
      },
    })

    return NextResponse.json({
      success: true,
      data: { preferences },
      message: 'Preferences updated successfully',
    })
  } catch (error) {
    return handleGenericError(error, 'updating preferences')
  }
}
