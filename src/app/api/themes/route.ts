/**
 * Themes API Routes
 * GET /api/themes - List all themes
 * POST /api/themes - Create new theme
 */

import { NextRequest } from 'next/server'
import { themeService } from '@/features/themes/services/theme.service'
import { handleApiError } from '@/core/errors/error-handler'
import { success, created } from '@/core/lib/api-response'

export async function GET() {
  try {
    const themes = await themeService.getThemes()
    return success(themes)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const theme = await themeService.createTheme(body)
    return created(theme)
  } catch (error) {
    return handleApiError(error)
  }
}
