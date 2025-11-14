/**
 * Category Validation Schemas
 * Zod schemas for category validation
 */

import { z } from 'zod'
import { EVENT_TYPES, EVENT_COLORS } from '@/core/config/constants'

const eventTypeValues = EVENT_TYPES.map(t => t.value) as [string, ...string[]]
const eventColorValues = EVENT_COLORS.map(c => c.value) as [string, ...string[]]

export const createCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  color: z.enum(eventColorValues, { required_error: 'Color is required' }),
  icon: z.string().min(1, 'Icon is required'),
  defaultEventType: z.enum(eventTypeValues, { required_error: 'Default event type is required' })
})

export const updateCategorySchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional().nullable(),
  color: z.enum(eventColorValues).optional(),
  icon: z.string().min(1).optional(),
  defaultEventType: z.enum(eventTypeValues).optional()
})

export type CreateCategoryInput = z.infer<typeof createCategorySchema>
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>
