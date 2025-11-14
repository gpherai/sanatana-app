/**
 * Event Validation Schemas
 * Zod schemas for event validation
 */

import { z } from 'zod'
import { EVENT_TYPES, EVENT_COLORS, TITHIS, NAKSHATRAS, PAKSHAS } from '@/core/config/constants'

const eventTypeValues = EVENT_TYPES.map(t => t.value) as [string, ...string[]]
const eventColorValues = EVENT_COLORS.map(c => c.value) as [string, ...string[]]

export const lunarDateSchema = z.object({
  tithi: z.enum(TITHIS),
  paksha: z.enum(PAKSHAS),
  nakshatra: z.enum(NAKSHATRAS),
  hinduMonth: z.string().min(1)
}).optional()

export const createEventSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().max(2000, 'Description must be less than 2000 characters').optional(),
  eventType: z.enum(eventTypeValues, { required_error: 'Event type is required' }),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()).optional(),
  isAllDay: z.boolean().default(true),
  color: z.enum(eventColorValues).default('blue'),
  categoryId: z.number().int().positive().optional(),
  isRecurring: z.boolean().default(false),
  recurrenceRule: z.string().optional(),
  lunarDate: lunarDateSchema,
  location: z.string().max(200).optional(),
  reminder: z.boolean().default(false),
  reminderMinutes: z.number().int().min(0).max(10080).optional() // max 1 week
}).refine((data) => {
  if (!data.endDate) return true
  const start = new Date(data.startDate)
  const end = new Date(data.endDate)
  return end >= start
}, {
  message: 'End date must be after start date',
  path: ['endDate']
}).refine((data) => {
  if (!data.reminder) return true
  return data.reminderMinutes !== undefined && data.reminderMinutes > 0
}, {
  message: 'Reminder minutes must be set when reminder is enabled',
  path: ['reminderMinutes']
})

export const updateEventSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional().nullable(),
  eventType: z.enum(eventTypeValues).optional(),
  startDate: z.string().or(z.date()).optional(),
  endDate: z.string().or(z.date()).optional().nullable(),
  isAllDay: z.boolean().optional(),
  color: z.enum(eventColorValues).optional(),
  categoryId: z.number().int().positive().optional().nullable(),
  isRecurring: z.boolean().optional(),
  recurrenceRule: z.string().optional().nullable(),
  lunarDate: lunarDateSchema.nullable(),
  location: z.string().max(200).optional().nullable(),
  reminder: z.boolean().optional(),
  reminderMinutes: z.number().int().min(0).max(10080).optional().nullable()
}).refine((data) => {
  if (!data.startDate || !data.endDate) return true
  const start = new Date(data.startDate)
  const end = new Date(data.endDate)
  return end >= start
}, {
  message: 'End date must be after start date',
  path: ['endDate']
})

export const eventFiltersSchema = z.object({
  eventTypes: z.array(z.enum(eventTypeValues)).optional(),
  categoryIds: z.array(z.number().int().positive()).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  searchQuery: z.string().optional(),
  isRecurring: z.boolean().optional()
})

export type CreateEventInput = z.infer<typeof createEventSchema>
export type UpdateEventInput = z.infer<typeof updateEventSchema>
export type EventFilters = z.infer<typeof eventFiltersSchema>
