/**
 * Event Service
 * Business logic for events
 */

import { AppError } from '@/core/errors/AppError'
import { eventRepository } from '../repositories/event.repository'
import { CreateEventInput, UpdateEventInput, EventFilters } from '../types/event.types'
import { createEventSchema, updateEventSchema, eventFiltersSchema } from '../validations/event.schema'

export class EventService {
  async getEventById(id: number) {
    const event = await eventRepository.findByIdWithCategory(id)

    if (!event) {
      throw AppError.notFound('Event')
    }

    return event
  }

  async getEvents(filters?: EventFilters) {
    if (filters) {
      const validatedFilters = eventFiltersSchema.parse(filters) as EventFilters
      return await eventRepository.findWithFilters(validatedFilters)
    }

    return await eventRepository.findMany({
      orderBy: { startDate: 'asc' }
    })
  }

  async getEventsByDateRange(startDate: Date, endDate: Date) {
    if (endDate < startDate) {
      throw AppError.validation('End date must be after start date')
    }

    return await eventRepository.findByDateRange(startDate, endDate)
  }

  async getUpcomingEvents(limit: number = 10) {
    if (limit < 1 || limit > 100) {
      throw AppError.validation('Limit must be between 1 and 100')
    }

    return await eventRepository.findUpcoming(limit)
  }

  async createEvent(input: CreateEventInput) {
    const validatedData = createEventSchema.parse(input)

    // Convert date strings to Date objects
    const eventData = {
      ...validatedData,
      startDate: new Date(validatedData.startDate),
      endDate: validatedData.endDate ? new Date(validatedData.endDate) : null,
      description: validatedData.description ?? null,
      categoryId: validatedData.categoryId ?? null,
      recurrenceRule: validatedData.recurrenceRule ?? null,
      lunarDate: validatedData.lunarDate ?? null,
      location: validatedData.location ?? null,
      reminderMinutes: validatedData.reminderMinutes ?? null
    }

    // Check if category exists if provided
    if (eventData.categoryId) {
      const categoryExists = await prisma.category.findUnique({
        where: { id: eventData.categoryId }
      })

      if (!categoryExists) {
        throw AppError.notFound('Category')
      }
    }

    return await eventRepository.create(eventData)
  }

  async updateEvent(input: UpdateEventInput) {
    const validatedData = updateEventSchema.parse(input)
    const { id, ...updateData } = validatedData

    // Check if event exists
    const existingEvent = await eventRepository.findById(id)
    if (!existingEvent) {
      throw AppError.notFound('Event')
    }

    // Convert date strings to Date objects if provided
    const eventData: Record<string, unknown> = { ...updateData }
    if (updateData.startDate) {
      eventData.startDate = new Date(updateData.startDate)
    }
    if (updateData.endDate) {
      eventData.endDate = new Date(updateData.endDate)
    }

    // Check if category exists if provided
    if (updateData.categoryId) {
      const categoryExists = await prisma.category.findUnique({
        where: { id: updateData.categoryId }
      })

      if (!categoryExists) {
        throw AppError.notFound('Category')
      }
    }

    return await eventRepository.update(id, eventData)
  }

  async deleteEvent(id: number) {
    const event = await eventRepository.findById(id)

    if (!event) {
      throw AppError.notFound('Event')
    }

    return await eventRepository.delete(id)
  }

  async deleteEventsByCategory(categoryId: number) {
    return await eventRepository.deleteMany({ categoryId })
  }
}

export const eventService = new EventService()

// Import prisma for category check
import { prisma } from '@/core/database/prisma'
