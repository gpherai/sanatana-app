/**
 * useEvents Hook
 * Fetches and manages events data
 */

'use client'

import { useFetch } from '@/shared/hooks'
import { Event, EventFilters } from '../types/event.types'

interface UseEventsOptions {
  filters?: EventFilters
  enabled?: boolean
}

export function useEvents(options: UseEventsOptions = {}) {
  const { filters, enabled = true } = options

  const queryParams = new URLSearchParams()

  if (filters?.eventTypes) {
    filters.eventTypes.forEach(type => queryParams.append('eventTypes', type))
  }
  if (filters?.categoryIds) {
    filters.categoryIds.forEach(id => queryParams.append('categoryIds', id.toString()))
  }
  if (filters?.startDate) {
    queryParams.append('startDate', filters.startDate)
  }
  if (filters?.endDate) {
    queryParams.append('endDate', filters.endDate)
  }
  if (filters?.searchQuery) {
    queryParams.append('searchQuery', filters.searchQuery)
  }
  if (filters?.isRecurring !== undefined) {
    queryParams.append('isRecurring', filters.isRecurring.toString())
  }

  const queryString = queryParams.toString()
  const url = enabled ? `/api/events${queryString ? `?${queryString}` : ''}` : null

  return useFetch<Event[]>(url, { enabled })
}

export function useEvent(id: number | null) {
  const url = id ? `/api/events/${id}` : null
  return useFetch<Event>(url, { enabled: !!id })
}

export function useUpcomingEvents(limit: number = 10) {
  const url = `/api/events?upcoming=true&limit=${limit}`
  return useFetch<Event[]>(url)
}
