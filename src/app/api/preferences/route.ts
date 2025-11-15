/**
 * Preferences API Routes
 * GET /api/preferences - Get user preferences
 * PUT /api/preferences - Update preferences
 */

import { NextRequest } from 'next/server'
import { settingsService } from '@/features/settings/services/settings.service'
import { handleApiError } from '@/core/errors/error-handler'
import { success } from '@/core/lib/api-response'

export async function GET() {
  try {
    const preferences = await settingsService.getPreferences()
    return success(preferences)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const preferences = await settingsService.updatePreferences(body)
    return success(preferences)
  } catch (error) {
    return handleApiError(error)
  }
}
