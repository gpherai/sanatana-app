/**
 * Categories API Routes
 * GET /api/categories - List all categories
 * POST /api/categories - Create new category
 */

import { NextRequest } from 'next/server'
import { categoryService } from '@/features/categories/services/category.service'
import { handleApiError } from '@/core/errors/error-handler'
import { success, created } from '@/core/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const query = searchParams.get('q')

    const categories = query
      ? await categoryService.searchCategories(query)
      : await categoryService.getCategories()

    return success(categories)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const category = await categoryService.createCategory(body)
    return created(category)
  } catch (error) {
    return handleApiError(error)
  }
}
