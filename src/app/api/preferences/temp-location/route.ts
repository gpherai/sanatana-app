/**
 * Temporary Location API Route
 * PUT /api/preferences/temp-location - Set temporary location
 */

import { NextRequest } from 'next/server'
import { settingsService } from '@/features/settings/services/settings.service'
import { handleApiError } from '@/core/errors/error-handler'
import { success } from '@/core/lib/api-response'

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const preferences = await settingsService.setTempLocation(body)
    return success(preferences)
  } catch (error) {
    return handleApiError(error)
  }
}
