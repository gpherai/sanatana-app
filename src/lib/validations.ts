// Zod validation schemas
import { z } from 'zod'
import { EventType, RecurrenceType, LunarType, Paksha, CalendarView } from '@prisma/client'

// ====================================
// ENUM HELPER - Centralized Zod enums from Prisma
// ====================================

/**
 * Creates a Zod enum from a Prisma enum
 * Usage: createZodEnum(EventType) -> z.enum(['FESTIVAL', 'PUJA', ...])
 */
function createZodEnum<T extends Record<string, string>>(prismaEnum: T) {
  const values = Object.values(prismaEnum) as [string, ...string[]]
  return z.enum(values)
}

// Centralized Zod enums (synced with Prisma schema)
export const zodEventType = createZodEnum(EventType)
export const zodRecurrenceType = createZodEnum(RecurrenceType)
export const zodLunarType = createZodEnum(LunarType)
export const zodPaksha = createZodEnum(Paksha)
export const zodCalendarView = createZodEnum(CalendarView)

// Event validation
export const eventSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name too long'),
  description: z.string().max(2000).optional(),
  type: zodEventType,
  categoryId: z.number().int().positive().optional(),
  isRecurring: z.boolean().default(true),
  recurrenceType: zodRecurrenceType.default('LUNAR'),
  importance: z.number().int().min(1).max(10).default(5),
  tags: z.array(z.string()).optional(),
})

// Event occurrence validation
export const eventOccurrenceSchema = z.object({
  date: z.coerce.date(),
  startTime: z
    .string()
    .regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format')
    .optional(),
  endTime: z
    .string()
    .regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format')
    .optional(),
  tithi: z.string().max(50).optional(),
  nakshatra: z.string().max(50).optional(),
  paksha: zodPaksha.optional(),
  maas: z.string().max(50).optional(),
})

// Combined event form validation (API - with date coercion)
export const eventFormSchema = z.object({
  ...eventSchema.shape,
  ...eventOccurrenceSchema.shape,
})

// ====================================
// FORM SCHEMAS (Phase 2 - Create & Manage)
// ====================================

/**
 * Event form schema for CREATE
 * - Used in /events/new page
 * - Date as string (ISO format: YYYY-MM-DD) for HTML input compatibility
 * - CategoryId optional (can default to "General" category)
 * - Tags optional (user may not add tags)
 * - No time validation (events can span midnight: 23:00-01:00)
 * - Lunar fields optional (manual input until Panchang API integration)
 */
export const eventFormCreateSchema = z.object({
  // Basic event info
  name: z.string().min(1, 'Name is required').max(200, 'Name too long'),
  description: z.string().max(2000, 'Description too long').optional(),
  type: zodEventType,
  categoryId: z.number().int().positive('Category must be positive').optional(),

  // Recurrence
  isRecurring: z.boolean().default(true),
  recurrenceType: zodRecurrenceType.default('LUNAR'),

  // Importance & tags
  importance: z
    .number()
    .int()
    .min(1, 'Importance must be at least 1')
    .max(10, 'Importance cannot exceed 10')
    .default(5),
  tags: z.array(z.string()).optional(),

  // Date & time (as strings for HTML form inputs)
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (expected YYYY-MM-DD)'),
  startTime: z
    .string()
    .regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (expected HH:mm)')
    .optional(),
  endTime: z
    .string()
    .regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (expected HH:mm)')
    .optional(),
  // Note: No validation that endTime > startTime (events can span midnight)

  // Lunar info (optional - manual input until Panchang API integration in Phase 5)
  tithi: z.string().max(50).optional(),
  nakshatra: z.string().max(50).optional(),
  paksha: zodPaksha.optional(),
  maas: z.string().max(50).optional(),
})

/**
 * Event form schema for UPDATE
 * - Used in /events/[id] edit page
 * - All fields optional (partial updates allowed)
 * - Same validation rules as create when fields are provided
 */
export const eventFormUpdateSchema = eventFormCreateSchema.partial()

// Type inference helpers
export type EventFormCreateInput = z.infer<typeof eventFormCreateSchema>
export type EventFormUpdateInput = z.infer<typeof eventFormUpdateSchema>

// Lunar event validation
export const lunarEventSchema = z.object({
  date: z.coerce.date(),
  time: z
    .string()
    .regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/)
    .optional(),
  type: zodLunarType,
  tithi: z.string().max(50).optional(),
  nakshatra: z.string().max(50).optional(),
})

// User preferences validation
export const userPreferencesSchema = z.object({
  currentTheme: z.string().default('spiritual-minimal'),
  defaultView: zodCalendarView.default('month'),
  weekStartsOn: z.number().int().min(0).max(6).default(0),
  visibleTypes: z.array(z.string()).optional(),
  visibleCategories: z.array(z.number().int()).optional(),
  locationName: z.string().max(200).optional(),
  locationLat: z.number().min(-90).max(90).optional(),
  locationLon: z.number().min(-180).max(180).optional(),
  timezone: z.string().default('Europe/Amsterdam'),
  notificationsEnabled: z.boolean().default(false),
  notificationDaysBefore: z.number().int().min(0).max(30).default(1),
})

// Query params validation (Phase 3 - Filter & Search)
export const getEventsQuerySchema = z.object({
  // Date range
  startDate: z.string().optional(),
  endDate: z.string().optional(),

  // Type filters
  types: z.array(z.string()).or(z.string()).optional(),
  categoryIds: z.array(z.number()).or(z.string()).optional(),
  recurrenceTypes: z.array(z.string()).or(z.string()).optional(),

  // Search
  search: z.string().optional(),

  // Lunar filters
  hasLunarInfo: z.coerce.boolean().optional(),
  hasTithi: z.coerce.boolean().optional(),
  hasNakshatra: z.coerce.boolean().optional(),
})

export const getLunarEventsQuerySchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  types: z.array(z.string()).or(z.string()).optional(),
})
