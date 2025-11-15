/**
 * Saved Location by ID API Routes
 * GET /api/saved-locations/[id] - Get location by ID
 * PUT /api/saved-locations/[id] - Update location
 * DELETE /api/saved-locations/[id] - Delete location
 */

import { NextRequest } from 'next/server'
import { settingsService } from '@/features/settings/services/settings.service'
import { handleApiError } from '@/core/errors/error-handler'
import { success, noContent } from '@/core/lib/api-response'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params
    const id = parseInt(idStr)
    const location = await settingsService.getSavedLocationById(id)
    return success(location)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params
    const id = parseInt(idStr)
    const body = await request.json()
    const location = await settingsService.updateSavedLocation({ id, ...body })
    return success(location)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params
    const id = parseInt(idStr)
    await settingsService.deleteSavedLocation(id)
    return noContent()
  } catch (error) {
    return handleApiError(error)
  }
}
