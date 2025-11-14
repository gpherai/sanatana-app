// Event utility functions
import type { Event, EventOccurrence, EventType } from '@/types/event'
import { EVENT_TYPES } from '@/config/constants'

/**
 * Get event type label
 */
export function getEventTypeLabel(type: EventType): string {
  return EVENT_TYPES.find((t) => t.value === type)?.label ?? type
}

/**
 * Get event type icon
 */
export function getEventTypeIcon(type: EventType): string {
  return EVENT_TYPES.find((t) => t.value === type)?.icon ?? '📅'
}

/**
 * Combine event with occurrence for display
 */
export interface EventWithOccurrence extends Event {
  occurrence: EventOccurrence
}

/**
 * Format event for calendar display
 */
export function formatEventForCalendar(event: Event, occurrence: EventOccurrence) {
  return {
    id: occurrence.id,
    title: event.name,
    start: new Date(occurrence.date),
    end: new Date(occurrence.date),
    allDay: !occurrence.startTime,
    resource: {
      event,
      occurrence,
      type: event.type,
      category: event.category,
      importance: event.importance,
    },
  }
}

/**
 * Group occurrences by date
 */
export function groupOccurrencesByDate(
  occurrences: EventOccurrence[]
): Map<string, EventOccurrence[]> {
  const grouped = new Map<string, EventOccurrence[]>()

  for (const occurrence of occurrences) {
    const dateKey = new Date(occurrence.date).toDateString()
    const existing = grouped.get(dateKey) || []
    grouped.set(dateKey, [...existing, occurrence])
  }

  return grouped
}

/**
 * Get lunar icon based on Tithi - ONLY for important tithis in events
 * Daily moon phases are shown on calendar days themselves
 */
export function getLunarIcon(tithi?: string | null): string {
  if (!tithi) return ''

  const tithiLower = tithi.toLowerCase()

  // Only show emoji for important tithis
  // Purnima (Full Moon)
  if (tithiLower.includes('purnima') || tithiLower.includes('full moon')) {
    return '🌕'
  }

  // Amavasya (New Moon)
  if (tithiLower.includes('amavasya') || tithiLower.includes('new moon')) {
    return '🌑'
  }

  // Ekadashi
  if (tithiLower.includes('ekadashi')) {
    return '🌙'
  }

  // No emoji for other tithis - daily moon phase will show on day itself
  return ''
}

/**
 * Check if event has lunar information
 */
export function hasLunarInfo(event: { tithi?: string | null; nakshatra?: string | null }): boolean {
  return !!(event.tithi || event.nakshatra)
}

/**
 * Get Paksha emoji (lunar fortnight)
 */
export function getPakshaEmoji(paksha?: string | null): string {
  if (!paksha) return ''
  if (paksha.toLowerCase() === 'shukla') return '🌒' // Waxing
  if (paksha.toLowerCase() === 'krishna') return '🌘' // Waning
  return ''
}

/**
 * Get sun emoji (yellow circle)
 * Used for displaying sun times in calendar
 */
export function getSunEmoji(): string {
  return '🟡' // Yellow circle (matches moon phase circles)
}

/**
 * Get moon phase emoji based on percentage visible and waxing/waning direction
 */
export function getMoonPhaseEmoji(
  percentage: number,
  isWaxing: boolean,
  phase?: string | null
): string {
  // Special phases first (exact moments)
  if (phase === 'FULL_MOON') return '🌕'
  if (phase === 'NEW_MOON') return '🌑'
  if (phase === 'FIRST_QUARTER') return '🌓'
  if (phase === 'LAST_QUARTER') return '🌗'

  // Based on percentage + direction for smooth transitions
  if (isWaxing) {
    // Waxing (toenemend) - maan wordt voller
    if (percentage <= 10) return '🌒' // Waxing crescent (dunne sikkel)
    if (percentage <= 45) return '🌓' // First quarter (halve maan)
    if (percentage <= 95) return '🌔' // Waxing gibbous (bijna vol)
    return '🌕' // Full moon
  } else {
    // Waning (afnemend) - maan wordt smaller
    if (percentage >= 95) return '🌕' // Still full
    if (percentage >= 55) return '🌖' // Waning gibbous (net na vol)
    if (percentage >= 25) return '🌗' // Last quarter (halve maan)
    if (percentage >= 3) return '🌘' // Waning crescent (dunne sikkel)
    return '🌑' // New moon
  }
}
