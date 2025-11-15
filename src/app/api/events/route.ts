/**
 * Events API Routes
 * GET /api/events - List events with filters
 * POST /api/events - Create new event
 */

import { NextRequest } from 'next/server'
import { eventService } from '@/features/events/services/event.service'
import { handleApiError } from '@/core/errors/error-handler'
import { success, created } from '@/core/lib/api-response'
import { EventFilters } from '@/features/events/types/event.types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl

    // Check for upcoming events query
    if (searchParams.get('upcoming') === 'true') {
      const limitParam = parseInt(searchParams.get('limit') || '10')
      const limit = Number.isFinite(limitParam) && limitParam > 0 ? limitParam : 10
      const events = await eventService.getUpcomingEvents(limit)
      return success(events)
    }

    // Parse filters
    const filters: EventFilters = {}

    const eventTypes = searchParams.getAll('eventTypes')
    if (eventTypes.length > 0) {
      filters.eventTypes = eventTypes as EventFilters['eventTypes']
    }

    const categoryIds = searchParams.getAll('categoryIds')
    if (categoryIds.length > 0) {
      filters.categoryIds = categoryIds.map(id => parseInt(id))
    }

    const startDate = searchParams.get('startDate')
    if (startDate) filters.startDate = startDate

    const endDate = searchParams.get('endDate')
    if (endDate) filters.endDate = endDate

    const searchQuery = searchParams.get('searchQuery')
    if (searchQuery) filters.searchQuery = searchQuery

    const isRecurring = searchParams.get('isRecurring')
    if (isRecurring) filters.isRecurring = isRecurring === 'true'

    const events = await eventService.getEvents(filters)
    return success(events)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const event = await eventService.createEvent(body)
    return created(event)
  } catch (error) {
    return handleApiError(error)
  }
}
