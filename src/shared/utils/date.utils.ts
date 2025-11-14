/**
 * Date Utilities
 * Date formatting and manipulation helpers
 */

import { format, parseISO, isValid, addDays, subDays, startOfDay, endOfDay, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns'
import { DATE_FORMATS } from '@/core/config/constants'

/**
 * Formats a date to a specific format
 */
export function formatDate(date: Date | string, formatStr: string = DATE_FORMATS.DISPLAY): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date

  if (!isValid(dateObj)) {
    throw new Error('Invalid date provided')
  }

  return format(dateObj, formatStr)
}

/**
 * Formats a date to ISO format (YYYY-MM-DD)
 */
export function toISODate(date: Date | string): string {
  return formatDate(date, DATE_FORMATS.ISO)
}

/**
 * Formats a date to display format
 */
export function toDisplayDate(date: Date | string): string {
  return formatDate(date, DATE_FORMATS.DISPLAY)
}

/**
 * Formats a date to full format
 */
export function toFullDate(date: Date | string): string {
  return formatDate(date, DATE_FORMATS.FULL)
}

/**
 * Formats time
 */
export function formatTime(date: Date | string): string {
  return formatDate(date, DATE_FORMATS.TIME)
}

/**
 * Formats datetime
 */
export function formatDateTime(date: Date | string): string {
  return formatDate(date, DATE_FORMATS.DATETIME)
}

/**
 * Parses an ISO date string to Date object
 */
export function parseDate(dateString: string): Date {
  const date = parseISO(dateString)

  if (!isValid(date)) {
    throw new Error('Invalid date string provided')
  }

  return date
}

/**
 * Checks if a date is valid
 */
export function isValidDate(date: unknown): date is Date {
  return date instanceof Date && isValid(date)
}

/**
 * Gets the start of day for a date
 */
export function getStartOfDay(date: Date | string): Date {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return startOfDay(dateObj)
}

/**
 * Gets the end of day for a date
 */
export function getEndOfDay(date: Date | string): Date {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return endOfDay(dateObj)
}

/**
 * Gets the start of month for a date
 */
export function getStartOfMonth(date: Date | string): Date {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return startOfMonth(dateObj)
}

/**
 * Gets the end of month for a date
 */
export function getEndOfMonth(date: Date | string): Date {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return endOfMonth(dateObj)
}

/**
 * Gets the start of week for a date
 */
export function getStartOfWeek(date: Date | string): Date {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return startOfWeek(dateObj, { weekStartsOn: 0 }) // Sunday
}

/**
 * Gets the end of week for a date
 */
export function getEndOfWeek(date: Date | string): Date {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return endOfWeek(dateObj, { weekStartsOn: 0 }) // Sunday
}

/**
 * Adds days to a date
 */
export function addDaysToDate(date: Date | string, days: number): Date {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return addDays(dateObj, days)
}

/**
 * Subtracts days from a date
 */
export function subtractDaysFromDate(date: Date | string, days: number): Date {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return subDays(dateObj, days)
}

/**
 * Gets today's date at start of day
 */
export function getToday(): Date {
  return startOfDay(new Date())
}

/**
 * Checks if a date is today
 */
export function isToday(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  const today = getToday()
  return startOfDay(dateObj).getTime() === today.getTime()
}

/**
 * Checks if a date is in the past
 */
export function isPast(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return dateObj < getToday()
}

/**
 * Checks if a date is in the future
 */
export function isFuture(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return dateObj > getToday()
}

/**
 * Gets a date range
 */
export function getDateRange(startDate: Date | string, endDate: Date | string): Date[] {
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate

  const dates: Date[] = []
  let currentDate = startOfDay(start)
  const endOfRange = startOfDay(end)

  while (currentDate <= endOfRange) {
    dates.push(currentDate)
    currentDate = addDays(currentDate, 1)
  }

  return dates
}
