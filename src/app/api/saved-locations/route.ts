/**
 * Saved Locations API Routes
 * GET /api/saved-locations - List saved locations
 * POST /api/saved-locations - Create saved location
 */

import { NextRequest } from 'next/server'
import { settingsService } from '@/features/settings/services/settings.service'
import { handleApiError } from '@/core/errors/error-handler'
import { success, created } from '@/core/lib/api-response'

export async function GET() {
  try {
    const locations = await settingsService.getSavedLocations()
    return success(locations)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const location = await settingsService.createSavedLocation(body)
    return created(location)
  } catch (error) {
    return handleApiError(error)
  }
}
