/**
 * Event Repository
 * Database operations for events
 */

import { Event, Prisma } from '@prisma/client'
import { BaseRepository } from '@/core/database/base.repository'
import { prisma } from '@/core/database/prisma'
import { EventFilters } from '../types/event.types'

export class EventRepository extends BaseRepository<Event> {
  protected model = prisma.event

  async findByDateRange(startDate: Date, endDate: Date): Promise<Event[]> {
    return await this.model.findMany({
      where: {
        OR: [
          {
            AND: [
              { startDate: { lte: endDate } },
              { endDate: { gte: startDate } }
            ]
          },
          {
            AND: [
              { startDate: { gte: startDate } },
              { startDate: { lte: endDate } }
            ]
          }
        ]
      },
      orderBy: { startDate: 'asc' }
    })
  }

  async findWithFilters(filters: EventFilters): Promise<Event[]> {
    const where: Prisma.EventWhereInput = {}

    if (filters.eventTypes && filters.eventTypes.length > 0) {
      where.eventType = { in: filters.eventTypes }
    }

    if (filters.categoryIds && filters.categoryIds.length > 0) {
      where.categoryId = { in: filters.categoryIds }
    }

    if (filters.startDate && filters.endDate) {
      const start = new Date(filters.startDate)
      const end = new Date(filters.endDate)
      where.OR = [
        {
          AND: [
            { startDate: { lte: end } },
            { endDate: { gte: start } }
          ]
        },
        {
          AND: [
            { startDate: { gte: start } },
            { startDate: { lte: end } }
          ]
        }
      ]
    }

    if (filters.searchQuery) {
      where.OR = [
        { title: { contains: filters.searchQuery, mode: 'insensitive' } },
        { description: { contains: filters.searchQuery, mode: 'insensitive' } }
      ]
    }

    if (filters.isRecurring !== undefined) {
      where.isRecurring = filters.isRecurring
    }

    return await this.model.findMany({
      where,
      orderBy: { startDate: 'asc' },
      include: {
        category: true
      }
    })
  }

  async findByCategory(categoryId: number): Promise<Event[]> {
    return await this.model.findMany({
      where: { categoryId },
      orderBy: { startDate: 'asc' }
    })
  }

  async findRecurring(): Promise<Event[]> {
    return await this.model.findMany({
      where: { isRecurring: true },
      orderBy: { startDate: 'asc' }
    })
  }

  async findUpcoming(limit: number = 10): Promise<Event[]> {
    const now = new Date()
    return await this.model.findMany({
      where: {
        startDate: { gte: now }
      },
      orderBy: { startDate: 'asc' },
      take: limit,
      include: {
        category: true
      }
    })
  }

  async findByIdWithCategory(id: number): Promise<(Event & { category: unknown }) | null> {
    return await this.model.findUnique({
      where: { id },
      include: {
        category: true
      }
    })
  }
}

export const eventRepository = new EventRepository()
