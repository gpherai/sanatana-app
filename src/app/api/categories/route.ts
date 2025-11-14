import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { Prisma } from '@prisma/client'
import { handleGenericError } from '@/lib/api-errors'

// GET /api/categories - Fetch all event categories
export async function GET() {
  try {
    // Define select with Prisma types
    const select: Prisma.EventCategorySelect = {
      id: true,
      name: true,
      description: true,
      icon: true,
    }

    const categories = await prisma.eventCategory.findMany({
      orderBy: { name: 'asc' as const },
      select,
    })

    return NextResponse.json({
      success: true,
      data: { categories },
    })
  } catch (error) {
    return handleGenericError(error, 'fetching categories')
  }
}
