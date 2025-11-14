// Date utility functions
import { format, parse, isValid, startOfMonth, endOfMonth, addMonths, subMonths } from 'date-fns'
import { DATE_FORMAT, TIME_FORMAT, DATETIME_FORMAT } from '@/config/constants'

/**
 * Format date to DD-MM-YYYY
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return format(d, DATE_FORMAT)
}

/**
 * Format time to HH:mm
 */
export function formatTime(time: string | Date): string {
  if (typeof time === 'string' && time.includes(':')) {
    return time // Already formatted
  }
  const d = typeof time === 'string' ? new Date(time) : time
  return format(d, TIME_FORMAT)
}

/**
 * Format datetime
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return format(d, DATETIME_FORMAT)
}

/**
 * Parse date string to Date object
 */
export function parseDate(dateString: string, formatString: string = DATE_FORMAT): Date | null {
  try {
    const parsed = parse(dateString, formatString, new Date())
    return isValid(parsed) ? parsed : null
  } catch {
    return null
  }
}

/**
 * Get start and end of current month
 */
export function getCurrentMonthRange(): { start: Date; end: Date } {
  const now = new Date()
  return {
    start: startOfMonth(now),
    end: endOfMonth(now),
  }
}

/**
 * Get month range for a specific date
 */
export function getMonthRange(date: Date): { start: Date; end: Date } {
  return {
    start: startOfMonth(date),
    end: endOfMonth(date),
  }
}

/**
 * Navigate months
 */
export function getNextMonth(date: Date): Date {
  return addMonths(date, 1)
}

export function getPreviousMonth(date: Date): Date {
  return subMonths(date, 1)
}

/**
 * Convert Date to ISO date string (YYYY-MM-DD)
 */
export function toISODateString(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}

/**
 * Get year from date
 */
export function getYear(date: Date | string): number {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.getFullYear()
}

/**
 * Check if date is today
 */
export function isToday(date: Date): boolean {
  const today = new Date()
  return date.toDateString() === today.toDateString()
}

/**
 * Check if date is weekend
 */
export function isWeekend(date: Date): boolean {
  const day = date.getDay()
  return day === 0 || day === 6
}
