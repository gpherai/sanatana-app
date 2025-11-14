/**
 * Activate Theme API Route
 * POST /api/themes/[id]/activate - Activate a specific theme
 */

import { NextRequest } from 'next/server'
import { themeService } from '@/features/themes/services/theme.service'
import { handleApiError } from '@/core/errors/error-handler'
import { success } from '@/core/lib/api-response'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const themeId = parseInt(id, 10)

    if (isNaN(themeId)) {
      throw new Error('Invalid theme ID')
    }

    const theme = await themeService.activateTheme(themeId)
    return success(theme)
  } catch (error) {
    return handleApiError(error)
  }
}
