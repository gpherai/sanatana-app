import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { eventFormCreateSchema } from '@/lib/validations'
import { Prisma, EventType, RecurrenceType, Paksha } from '@prisma/client'
import { handleGenericError } from '@/lib/api-errors'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Parse query parameters
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const types = searchParams.get('types')?.split(',')
    const categoryIds = searchParams.get('categoryIds')?.split(',').map(Number)
    const recurrenceTypes = searchParams.get('recurrenceTypes')?.split(',')
    const search = searchParams.get('search')
    const hasLunarInfo = searchParams.get('hasLunarInfo') === 'true'
    const hasTithi = searchParams.get('hasTithi') === 'true'
    const hasNakshatra = searchParams.get('hasNakshatra') === 'true'

    // Build where clause with proper Prisma types
    const where: Prisma.EventWhereInput = {}
    const andConditions: Prisma.EventWhereInput[] = []

    // Date range filter
    if (startDate || endDate) {
      const occurrenceWhere: Prisma.EventOccurrenceWhereInput = {}
      if (startDate && endDate) {
        occurrenceWhere.date = { gte: new Date(startDate), lte: new Date(endDate) }
      } else if (startDate) {
        occurrenceWhere.date = { gte: new Date(startDate) }
      } else if (endDate) {
        occurrenceWhere.date = { lte: new Date(endDate) }
      }

      andConditions.push({ occurrences: { some: occurrenceWhere } })
    }

    // Event type filter
    if (types && types.length > 0) {
      andConditions.push({ type: { in: types as EventType[] } })
    }

    // Category filter
    if (categoryIds && categoryIds.length > 0) {
      andConditions.push({ categoryId: { in: categoryIds } })
    }

    // Recurrence type filter
    if (recurrenceTypes && recurrenceTypes.length > 0) {
      andConditions.push({ recurrenceType: { in: recurrenceTypes as RecurrenceType[] } })
    }

    // Search filter (name, description, tags, tithi, nakshatra)
    if (search && search.trim() !== '') {
      const searchTerm = search.trim()
      andConditions.push({
        OR: [
          { name: { contains: searchTerm, mode: 'insensitive' } },
          { description: { contains: searchTerm, mode: 'insensitive' } },
          { tags: { has: searchTerm } }, // Native array contains
          // Search in occurrence lunar data
          { occurrences: { some: { tithi: { contains: searchTerm, mode: 'insensitive' } } } },
          { occurrences: { some: { nakshatra: { contains: searchTerm, mode: 'insensitive' } } } },
        ],
      })
    }

    // Lunar info filters
    if (hasLunarInfo) {
      andConditions.push({
        occurrences: {
          some: {
            OR: [{ tithi: { not: null } }, { nakshatra: { not: null } }],
          },
        },
      })
    }

    if (hasTithi) {
      andConditions.push({
        occurrences: {
          some: { tithi: { not: null } },
        },
      })
    }

    if (hasNakshatra) {
      andConditions.push({
        occurrences: {
          some: { nakshatra: { not: null } },
        },
      })
    }

    // Combine all conditions with AND
    if (andConditions.length > 0) {
      where.AND = andConditions
    }

    // Define include with Prisma types
    const include: Prisma.EventInclude = {
      category: true,
      occurrences: {
        where: {
          ...(startDate && { date: { gte: new Date(startDate) } }),
          ...(endDate && { date: { lte: new Date(endDate) } }),
        },
        orderBy: { date: 'asc' as const },
      },
    }

    // Query events with occurrences and categories
    const events = await prisma.event.findMany({
      where,
      include,
      orderBy: { name: 'asc' as const },
    })

    return NextResponse.json({
      success: true,
      data: {
        events,
        count: events.length,
      },
    })
  } catch (error) {
    return handleGenericError(error, 'fetching events')
  }
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json()

    // Validate with Zod schema
    const validatedData = eventFormCreateSchema.parse(body)

    // Transform date string to Date object
    // We store dates as UTC midnight to avoid timezone issues
    // Input: "2025-10-11" -> Store as: 2025-10-11T00:00:00.000Z
    const [year, month, day] = validatedData.date.split('-').map(Number)
    const eventDate = new Date(Date.UTC(year, month - 1, day))

    // Prepare create data with proper Prisma types
    const createData: Prisma.EventCreateInput = {
      name: validatedData.name,
      description: validatedData.description,
      type: validatedData.type as EventType,
      category: validatedData.categoryId
        ? { connect: { id: validatedData.categoryId } }
        : undefined,
      isRecurring: validatedData.isRecurring,
      recurrenceType: validatedData.recurrenceType as RecurrenceType,
      source: 'MANUAL',
      importance: validatedData.importance,
      tags: validatedData.tags ?? [],
      occurrences: {
        create: {
          date: eventDate,
          startTime: validatedData.startTime,
          endTime: validatedData.endTime,
          tithi: validatedData.tithi,
          nakshatra: validatedData.nakshatra,
          paksha: validatedData.paksha as Paksha | undefined,
          maas: validatedData.maas,
        },
      },
    }

    // Define include with Prisma types
    const include: Prisma.EventInclude = {
      category: true,
      occurrences: true,
    }

    // Create Event + EventOccurrence in transaction
    const event = await prisma.event.create({
      data: createData,
      include,
    })

    return NextResponse.json(
      {
        success: true,
        data: { event },
        message: 'Event created successfully',
      },
      { status: 201 }
    )
  } catch (error) {
    return handleGenericError(error, 'creating event')
  }
}
