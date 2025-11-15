/**
 * Active Theme API Route
 * GET /api/themes/active - Get currently active theme
 */

import { themeService } from '@/features/themes/services/theme.service'
import { handleApiError } from '@/core/errors/error-handler'
import { success } from '@/core/lib/api-response'

export async function GET() {
  try {
    const theme = await themeService.getActiveTheme()
    return success(theme)
  } catch (error) {
    return handleApiError(error)
  }
}
