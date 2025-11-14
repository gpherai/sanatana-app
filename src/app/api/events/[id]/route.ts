/**
 * Event by ID API Routes
 * GET /api/events/[id] - Get event by ID
 * PUT /api/events/[id] - Update event
 * DELETE /api/events/[id] - Delete event
 */

import { NextRequest } from 'next/server'
import { eventService } from '@/features/events/services/event.service'
import { handleApiError } from '@/core/errors/error-handler'
import { success, noContent } from '@/core/lib/api-response'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const event = await eventService.getEventById(id)
    return success(event)
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
    const event = await eventService.updateEvent({ id, ...body })
    return success(event)
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
    await eventService.deleteEvent(id)
    return noContent()
  } catch (error) {
    return handleApiError(error)
  }
}
