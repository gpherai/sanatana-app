import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { eventFormUpdateSchema } from '@/lib/validations'
import { Prisma, EventType, RecurrenceType, Paksha } from '@prisma/client'
import { handleGenericError, notFoundError, invalidInputError } from '@/lib/api-errors'

// GET /api/events/[id] - Fetch single event
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const eventId = parseInt(id)

    if (isNaN(eventId)) {
      return invalidInputError('event ID', 'must be a valid number')
    }

    // Define include with Prisma types
    const include: Prisma.EventInclude = {
      category: true,
      occurrences: {
        orderBy: { date: 'asc' as const },
      },
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include,
    })

    if (!event) {
      return notFoundError('Event', eventId)
    }

    return NextResponse.json({
      success: true,
      data: { event },
    })
  } catch (error) {
    const { id } = await params
    return handleGenericError(error, `fetching event ${id}`)
  }
}

// PUT /api/events/[id] - Update event
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const eventId = parseInt(id)

    if (isNaN(eventId)) {
      return invalidInputError('event ID', 'must be a valid number')
    }

    // Parse request body
    const body = await request.json()

    // Validate with Zod schema (partial update)
    const validatedData = eventFormUpdateSchema.parse(body)

    // Check if event exists
    const existingEvent = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        occurrences: {
          orderBy: { date: 'asc' as const },
          take: 1,
        },
      },
    })

    if (!existingEvent) {
      return notFoundError('Event', eventId)
    }

    // Prepare Event update data
    const eventUpdateData: Prisma.EventUpdateInput = {}
    if (validatedData.name !== undefined) eventUpdateData.name = validatedData.name
    if (validatedData.description !== undefined)
      eventUpdateData.description = validatedData.description
    if (validatedData.type !== undefined) eventUpdateData.type = validatedData.type as EventType
    if (validatedData.categoryId !== undefined) {
      eventUpdateData.category = validatedData.categoryId
        ? { connect: { id: validatedData.categoryId } }
        : { disconnect: true }
    }
    if (validatedData.isRecurring !== undefined)
      eventUpdateData.isRecurring = validatedData.isRecurring
    if (validatedData.recurrenceType !== undefined)
      eventUpdateData.recurrenceType = validatedData.recurrenceType as RecurrenceType
    if (validatedData.importance !== undefined)
      eventUpdateData.importance = validatedData.importance
    if (validatedData.tags !== undefined) eventUpdateData.tags = validatedData.tags ?? []

    // Update Event
    await prisma.event.update({
      where: { id: eventId },
      data: eventUpdateData,
    })

    // Update first EventOccurrence if date/time fields provided
    const firstOccurrence = existingEvent.occurrences[0]
    if (firstOccurrence) {
      const occurrenceUpdateData: Prisma.EventOccurrenceUpdateInput = {}

      if (validatedData.date !== undefined) {
        // Transform date string to Date object
        // We store dates as UTC midnight to avoid timezone issues
        // Input: "2025-10-11" -> Store as: 2025-10-11T00:00:00.000Z
        const [year, month, day] = validatedData.date.split('-').map(Number)
        const eventDate = new Date(Date.UTC(year, month - 1, day))
        occurrenceUpdateData.date = eventDate
        // Note: year field removed in Session 15 - year is derived from date
      }
      if (validatedData.startTime !== undefined)
        occurrenceUpdateData.startTime = validatedData.startTime
      if (validatedData.endTime !== undefined) occurrenceUpdateData.endTime = validatedData.endTime
      if (validatedData.tithi !== undefined) occurrenceUpdateData.tithi = validatedData.tithi
      if (validatedData.nakshatra !== undefined)
        occurrenceUpdateData.nakshatra = validatedData.nakshatra
      if (validatedData.paksha !== undefined)
        occurrenceUpdateData.paksha = validatedData.paksha as Paksha | undefined
      if (validatedData.maas !== undefined) occurrenceUpdateData.maas = validatedData.maas

      if (Object.keys(occurrenceUpdateData).length > 0) {
        await prisma.eventOccurrence.update({
          where: { id: firstOccurrence.id },
          data: occurrenceUpdateData,
        })
      }
    }

    // Fetch updated event with all relations
    const finalInclude: Prisma.EventInclude = {
      category: true,
      occurrences: {
        orderBy: { date: 'asc' as const },
      },
    }

    const finalEvent = await prisma.event.findUnique({
      where: { id: eventId },
      include: finalInclude,
    })

    return NextResponse.json({
      success: true,
      data: { event: finalEvent },
      message: 'Event updated successfully',
    })
  } catch (error) {
    const { id } = await params
    return handleGenericError(error, `updating event ${id}`)
  }
}

// DELETE /api/events/[id] - Delete event
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const eventId = parseInt(id)

    if (isNaN(eventId)) {
      return invalidInputError('event ID', 'must be a valid number')
    }

    // Check if event exists
    const existingEvent = await prisma.event.findUnique({
      where: { id: eventId },
    })

    if (!existingEvent) {
      return notFoundError('Event', eventId)
    }

    // Delete event (cascade to occurrences via schema)
    await prisma.event.delete({
      where: { id: eventId },
    })

    return NextResponse.json({
      success: true,
      message: 'Event deleted successfully',
    })
  } catch (error) {
    const { id } = await params
    return handleGenericError(error, `deleting event ${id}`)
  }
}
