/**
 * Category by ID API Routes
 * GET /api/categories/[id] - Get category by ID
 * PUT /api/categories/[id] - Update category
 * DELETE /api/categories/[id] - Delete category
 */

import { NextRequest } from 'next/server'
import { categoryService } from '@/features/categories/services/category.service'
import { handleApiError } from '@/core/errors/error-handler'
import { success, noContent } from '@/core/lib/api-response'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const category = await categoryService.getCategoryById(id)
    return success(category)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const body = await request.json()
    const category = await categoryService.updateCategory({ id, ...body })
    return success(category)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const { searchParams } = request.nextUrl
    const deleteEvents = searchParams.get('deleteEvents') === 'true'

    await categoryService.deleteCategory(id, deleteEvents)
    return noContent()
  } catch (error) {
    return handleApiError(error)
  }
}
