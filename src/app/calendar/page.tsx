'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Calendar as BigCalendar, dateFnsLocalizer, View } from 'react-big-calendar'
import {
  format,
  parse,
  startOfWeek,
  getDay,
  addMonths,
  addWeeks,
  addDays,
  startOfMonth,
  endOfMonth,
  startOfDay,
  endOfDay,
  isWeekend,
  isToday,
} from 'date-fns'
import { enUS } from 'date-fns/locale'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { Calendar, ChevronLeft, ChevronRight, PlusCircle } from 'lucide-react'
import {
  getEventTypeIcon,
  getLunarIcon,
  hasLunarInfo,
  getMoonPhaseEmoji,
  getSunEmoji,
} from '@/lib/event-utils'
import type { EventType } from '@/types/event'
import { EventDetailModal } from '@/components/events/EventDetailModal'
import { FilterSidebar, type FilterState } from '@/components/calendar/FilterSidebar'
import { DayView } from '@/components/calendar/DayView'
import { WeekView } from '@/components/calendar/WeekView'
import { useToast } from '@/contexts/ToastContext'

// API Response types
interface ApiEvent {
  id: number
  name: string
  type: EventType
  description?: string | null
  importance: number
  tags: string[]
  category?: { name: string } | null
  occurrences: Array<{
    id: number
    date: string
    startTime?: string | null
    endTime?: string | null
    tithi?: string | null
    nakshatra?: string | null
    paksha?: string | null
    maas?: string | null
  }>
}

interface ApiAstronomyDay {
  date: string
  percentageVisible: number
  isWaxing: boolean
  phase?: string | null
  sunrise?: string
  sunset?: string
  moonrise?: string
  moonset?: string
}

const locales = {
  'en-US': enUS,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

// Type for calendar events
interface CalendarEvent {
  id: number
  title: string
  start: Date
  end: Date
  allDay: boolean
  resource: {
    eventId: number
    occurrenceId: number
    type: EventType
    categoryName: string
    importance: number
    description?: string | null
    tags: string[]
    tithi?: string | null
    nakshatra?: string | null
    paksha?: string | null
    maas?: string | null
  }
}

export default function CalendarPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [date, setDate] = useState(new Date())
  const [view, setView] = useState<View>('month')
  const [isLoading, setIsLoading] = useState(true)
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [dailyAstronomy, setDailyAstronomy] = useState<
    Map<
      string,
      {
        percentage: number
        isWaxing: boolean
        phase?: string
        sunrise?: string
        sunset?: string
        moonrise?: string
        moonset?: string
      }
    >
  >(new Map())
  const [error, setError] = useState<string | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [weekStartsOn, setWeekStartsOn] = useState<0 | 1>(0) // 0 = Sunday, 1 = Monday
  const { showToast } = useToast()

  // Filter state - initialized from URL
  const [filters, setFilters] = useState<FilterState>(() => {
    return {
      search: searchParams.get('search') || '',
      categoryIds: searchParams.get('categoryIds')?.split(',').map(Number).filter(Boolean) || [],
      types: searchParams.get('types')?.split(',').filter(Boolean) || [],
      recurrenceTypes: searchParams.get('recurrenceTypes')?.split(',').filter(Boolean) || [],
      hasLunarInfo: searchParams.get('hasLunarInfo') === 'true',
      hasTithi: searchParams.get('hasTithi') === 'true',
      hasNakshatra: searchParams.get('hasNakshatra') === 'true',
    }
  })

  // Sidebar state - persisted in localStorage
  // Start with true (default), then read from localStorage in useEffect
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Load sidebar state from localStorage on mount (client-only)
  useEffect(() => {
    const saved = localStorage.getItem('filterSidebarOpen')
    if (saved !== null) {
      setSidebarOpen(saved === 'true')
    }
  }, [])

  // Persist sidebar state to localStorage
  useEffect(() => {
    localStorage.setItem('filterSidebarOpen', String(sidebarOpen))
  }, [sidebarOpen])

  const fetchEvents = useCallback(
    async (signal: AbortSignal) => {
      try {
        setIsLoading(true)
        setError(null)

        // Calculate date range based on current view
        let startDate: Date
        let endDate: Date

        if (view === 'month') {
          startDate = startOfMonth(date)
          endDate = endOfMonth(date)
        } else if (view === 'week') {
          startDate = startOfWeek(date, { weekStartsOn })
          endDate = endOfDay(addDays(startDate, 6))
        } else {
          startDate = startOfDay(date)
          endDate = endOfDay(date)
        }

        // Build query params with filters
        const params = new URLSearchParams({
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        })

        // Add filter parameters
        if (filters.search) params.set('search', filters.search)
        if (filters.categoryIds.length > 0) params.set('categoryIds', filters.categoryIds.join(','))
        if (filters.types.length > 0) params.set('types', filters.types.join(','))
        if (filters.recurrenceTypes.length > 0)
          params.set('recurrenceTypes', filters.recurrenceTypes.join(','))
        if (filters.hasLunarInfo) params.set('hasLunarInfo', 'true')
        if (filters.hasTithi) params.set('hasTithi', 'true')
        if (filters.hasNakshatra) params.set('hasNakshatra', 'true')

        // Fetch events, daily astronomy, and user preferences in parallel
        const [eventsResponse, astronomyResponse, preferencesResponse] = await Promise.all([
          fetch(`/api/events?${params}`, { signal }),
          fetch(
            `/api/daily-astronomy?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`,
            { signal }
          ),
          fetch('/api/preferences', { signal }),
        ])

        const eventsData = await eventsResponse.json()
        const astronomyData = await astronomyResponse.json()
        const preferencesData = await preferencesResponse.json()

        if (!eventsData.success) {
          throw new Error(eventsData.message || 'Failed to fetch events')
        }

        // Update weekStartsOn from preferences
        if (preferencesData.success && preferencesData.data.preferences) {
          setWeekStartsOn(preferencesData.data.preferences.weekStartsOn as 0 | 1)
        }

        // Transform API data to calendar format
        const calendarEvents: CalendarEvent[] = []

        eventsData.data.events.forEach((event: ApiEvent) => {
          event.occurrences.forEach((occurrence) => {
            const occurrenceDate = new Date(occurrence.date)

            calendarEvents.push({
              id: occurrence.id,
              title: event.name,
              start: occurrence.startTime
                ? new Date(`${occurrence.date.split('T')[0]}T${occurrence.startTime}`)
                : occurrenceDate,
              end: occurrence.endTime
                ? new Date(`${occurrence.date.split('T')[0]}T${occurrence.endTime}`)
                : occurrenceDate,
              allDay: !occurrence.startTime,
              resource: {
                eventId: event.id,
                occurrenceId: occurrence.id,
                type: event.type,
                categoryName: event.category?.name || 'General',
                importance: event.importance,
                description: event.description,
                tags: event.tags,
                tithi: occurrence.tithi,
                nakshatra: occurrence.nakshatra,
                paksha: occurrence.paksha,
                maas: occurrence.maas,
              },
            })
          })
        })

        setEvents(calendarEvents)

        // Process daily astronomy data into a Map for quick lookup
        if (astronomyData.success) {
          const astronomyMap = new Map()
          astronomyData.data.dailyAstronomy.forEach((day: ApiAstronomyDay) => {
            const dateKey = format(new Date(day.date), 'yyyy-MM-dd')
            astronomyMap.set(dateKey, {
              percentage: day.percentageVisible,
              isWaxing: day.isWaxing,
              phase: day.phase,
              sunrise: day.sunrise,
              sunset: day.sunset,
              moonrise: day.moonrise,
              moonset: day.moonset,
            })
          })
          setDailyAstronomy(astronomyMap)
        }
      } catch (err) {
        // Ignore abort errors (new fetch started or component unmounted)
        if (err instanceof Error && err.name === 'AbortError') {
          return
        }
        console.error('Error fetching events:', err)
        setError(err instanceof Error ? err.message : 'Failed to load events')
        // Show error toast
        showToast(err instanceof Error ? err.message : 'Failed to load events', 'error', 5000)
      } finally {
        // Only update loading state if not aborted
        if (!signal.aborted) {
          setIsLoading(false)
        }
      }
    },
    [date, view, filters, weekStartsOn, showToast]
  )

  // Fetch events when date/view/filters change
  useEffect(() => {
    const abortController = new AbortController()

    fetchEvents(abortController.signal)

    // Cleanup: abort fetch on date/view/filters change or unmount
    return () => abortController.abort()
  }, [fetchEvents])

  // Handle filter changes - updates both state and URL
  const handleFiltersChange = useCallback(
    (newFilters: FilterState) => {
      setFilters(newFilters)

      // Update URL with new filters
      const params = new URLSearchParams()
      if (newFilters.search) params.set('search', newFilters.search)
      if (newFilters.categoryIds.length > 0)
        params.set('categoryIds', newFilters.categoryIds.join(','))
      if (newFilters.types.length > 0) params.set('types', newFilters.types.join(','))
      if (newFilters.recurrenceTypes.length > 0)
        params.set('recurrenceTypes', newFilters.recurrenceTypes.join(','))
      if (newFilters.hasLunarInfo) params.set('hasLunarInfo', 'true')
      if (newFilters.hasTithi) params.set('hasTithi', 'true')
      if (newFilters.hasNakshatra) params.set('hasNakshatra', 'true')

      // Update URL (without page reload)
      const newUrl = params.toString() ? `/calendar?${params.toString()}` : '/calendar'
      router.push(newUrl, { scroll: false })
    },
    [router]
  )

  // Refresh events after delete/update
  const handleRefreshEvents = () => {
    const abortController = new AbortController()
    fetchEvents(abortController.signal)
  }

  // Navigate to previous period
  const handlePrevious = () => {
    if (view === 'month') {
      setDate(addMonths(date, -1))
    } else if (view === 'week') {
      setDate(addWeeks(date, -1))
    } else {
      setDate(addDays(date, -1))
    }
  }

  // Navigate to next period
  const handleNext = () => {
    if (view === 'month') {
      setDate(addMonths(date, 1))
    } else if (view === 'week') {
      setDate(addWeeks(date, 1))
    } else {
      setDate(addDays(date, 1))
    }
  }

  // Navigate to today
  const handleToday = () => {
    setDate(new Date())
  }

  // Format toolbar title
  const getToolbarTitle = () => {
    if (view === 'month') {
      return format(date, 'MMMM yyyy')
    } else if (view === 'week') {
      const start = startOfWeek(date, { weekStartsOn })
      const end = endOfDay(addDays(start, 6))
      return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`
    } else {
      return format(date, 'MMMM d, yyyy')
    }
  }

  // Custom event styling - uses CSS classes for theme-aware colors
  const eventStyleGetter = (event: CalendarEvent) => {
    const categoryClass = `event-category-${event.resource.categoryName.toLowerCase()}`
    return {
      className: categoryClass,
    }
  }

  // Day styling - weekend, lunar events, today indicator, and daily moon phases
  const dayPropGetter = (date: Date) => {
    const classes: string[] = []

    // Today indicator
    if (isToday(date)) {
      classes.push('today')
    }

    // Weekend styling
    if (isWeekend(date)) {
      classes.push('weekend-day')
    }

    // Lunar day styling - check if any event on this date has specific lunar info
    // This provides the gradient background for special days
    const dateStr = format(date, 'yyyy-MM-dd')

    // Find events on this date with lunar info
    const eventsOnDate = events.filter((event) => {
      const eventDateStr = format(event.start, 'yyyy-MM-dd')
      return eventDateStr === dateStr && hasLunarInfo(event.resource)
    })

    if (eventsOnDate.length > 0) {
      // Determine lunar type from tithi
      const hasPurnima = eventsOnDate.some((event) =>
        event.resource.tithi?.toLowerCase().includes('purnima')
      )
      const hasAmavasya = eventsOnDate.some((event) =>
        event.resource.tithi?.toLowerCase().includes('amavasya')
      )
      const hasEkadashi = eventsOnDate.some((event) =>
        event.resource.tithi?.toLowerCase().includes('ekadashi')
      )

      // Add specific lunar class for gradient
      if (hasPurnima) {
        classes.push('lunar-day', 'lunar-purnima')
      } else if (hasAmavasya) {
        classes.push('lunar-day', 'lunar-amavasya')
      } else if (hasEkadashi) {
        classes.push('lunar-day', 'lunar-ekadashi')
      } else {
        classes.push('lunar-day')
      }
    }

    return classes.length > 0 ? { className: classes.join(' ') } : {}
  }

  // Custom event component with icon
  const EventComponent = ({ event }: { event: CalendarEvent }) => {
    const typeIcon = getEventTypeIcon(event.resource.type)
    const lunarIcon = getLunarIcon(event.resource.tithi)

    return (
      <div className="flex items-center gap-1">
        <span className="text-xs">{typeIcon}</span>
        {lunarIcon && (
          <span className="text-xs" title={event.resource.tithi || 'Lunar event'}>
            {lunarIcon}
          </span>
        )}
        <span className="truncate">{event.title}</span>
      </div>
    )
  }

  // Custom date header component with sun (left) and moon (right)
  const DateHeader = ({ date, label }: { date: Date; label: React.ReactNode }) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    const dayData = dailyAstronomy.get(dateStr)

    return (
      <div className="relative flex items-center justify-end gap-1">
        {/* Sun emoji - linksboven with sun times tooltip */}
        {dayData?.sunrise && (
          <span
            className="absolute left-0 top-0 text-sm cursor-help"
            title={`Sunrise: ${dayData.sunrise} | Sunset: ${dayData.sunset}`}
          >
            {getSunEmoji()}
          </span>
        )}

        {/* Moon phase emoji - rechtsboven with moon times + phase tooltip */}
        {dayData && (
          <span
            className="text-sm cursor-help"
            title={[
              `Moon ${dayData.percentage}% visible`,
              dayData.isWaxing ? 'Waxing' : 'Waning',
              dayData.moonrise ? `Moonrise: ${dayData.moonrise}` : null,
              dayData.moonset ? `Moonset: ${dayData.moonset}` : null,
            ]
              .filter(Boolean)
              .join(' | ')}
          >
            {getMoonPhaseEmoji(dayData.percentage, dayData.isWaxing, dayData.phase)}
          </span>
        )}
        <span>{label}</span>
      </div>
    )
  }

  // Handle event click
  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event)
  }

  // Handle day click from week view
  const handleDayClick = (clickedDate: Date) => {
    setDate(clickedDate)
    setView('day')
  }

  return (
    <>
      {/* Filter Sidebar */}
      <FilterSidebar
        filters={filters}
        onFiltersChange={handleFiltersChange}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Content */}
      <main
        className={`
          flex-1 container mx-auto px-4 py-6 transition-all duration-300
          ${sidebarOpen ? 'md:ml-80' : ''}
        `}
      >
        <div className="max-w-7xl mx-auto space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold text-text-primary">Calendar</h1>
            </div>

            {/* New Event Button - Only show in month view */}
            {view === 'month' && (
              <Link href="/events/new">
                <button className="px-6 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors flex items-center gap-2">
                  <PlusCircle className="w-5 h-5" />
                  New Event
                </button>
              </Link>
            )}
          </div>

          {/* Toolbar */}
          <div className="surface p-4 rounded-lg border border-border">
            <div className="flex items-center justify-between flex-wrap gap-4">
              {/* Navigation */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevious}
                  className="p-2 rounded-lg surface-hover border border-border transition-colors"
                  title="Previous"
                >
                  <ChevronLeft className="w-5 h-5 text-text-primary" />
                </button>

                <button
                  onClick={handleToday}
                  className="px-4 py-2 rounded-lg surface-hover border border-border text-text-primary font-medium transition-colors hover:bg-primary hover:text-white"
                >
                  Today
                </button>

                <button
                  onClick={handleNext}
                  className="p-2 rounded-lg surface-hover border border-border transition-colors"
                  title="Next"
                >
                  <ChevronRight className="w-5 h-5 text-text-primary" />
                </button>
              </div>

              {/* Current Date Display */}
              <div className="text-lg font-semibold text-text-primary">{getToolbarTitle()}</div>

              {/* View Switcher */}
              <div className="flex gap-2">
                <button
                  onClick={() => setView('day')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    view === 'day'
                      ? 'bg-primary text-white'
                      : 'surface-hover border border-border text-text-primary hover:bg-surface-hover'
                  }`}
                >
                  Day
                </button>
                <button
                  onClick={() => setView('week')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    view === 'week'
                      ? 'bg-primary text-white'
                      : 'surface-hover border border-border text-text-primary hover:bg-surface-hover'
                  }`}
                >
                  Week
                </button>
                <button
                  onClick={() => setView('month')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    view === 'month'
                      ? 'bg-primary text-white'
                      : 'surface-hover border border-border text-text-primary hover:bg-surface-hover'
                  }`}
                >
                  Month
                </button>
              </div>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="surface p-4 rounded-lg border-2 border-red-500 bg-red-50 dark:bg-red-900/20">
              <p className="text-red-700 dark:text-red-300">⚠️ {error}</p>
              <button
                onClick={() => {
                  // Force re-fetch by updating state
                  setError(null)
                  setDate(new Date(date.getTime())) // Trigger dependency change
                }}
                className="mt-2 px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
              >
                Retry
              </button>
            </div>
          )}

          {/* Calendar */}
          <div className="surface rounded-lg border border-border overflow-hidden">
            {isLoading ? (
              // Loading State
              <div className="flex items-center justify-center h-[600px]">
                <div className="text-center space-y-3">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto"></div>
                  <p className="text-text-secondary">Loading events...</p>
                </div>
              </div>
            ) : view === 'day' ? (
              // Custom Day View
              <DayView
                date={date}
                events={events}
                dailyAstronomy={dailyAstronomy.get(format(date, 'yyyy-MM-dd'))}
                onEventClick={handleEventClick}
              />
            ) : view === 'week' ? (
              // Custom Week View
              <WeekView
                date={date}
                events={events}
                dailyAstronomy={dailyAstronomy}
                onEventClick={handleEventClick}
                onDayClick={handleDayClick}
                weekStartsOn={weekStartsOn}
              />
            ) : (
              // Month View - Use BigCalendar
              <BigCalendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                date={date}
                onNavigate={setDate}
                view={view}
                onView={setView}
                toolbar={false}
                style={{ height: 600 }}
                eventPropGetter={eventStyleGetter}
                dayPropGetter={dayPropGetter}
                components={{
                  event: EventComponent,
                  month: {
                    dateHeader: DateHeader,
                  },
                }}
                onSelectEvent={handleEventClick}
              />
            )}
          </div>

          {/* Event Count */}
          {!isLoading && (
            <div className="text-sm text-text-muted text-center">
              {events.length > 0 ? (
                <>
                  Showing <span className="font-semibold text-text-primary">{events.length}</span>{' '}
                  event{events.length !== 1 ? 's' : ''}
                  {(filters.categoryIds.length > 0 ||
                    filters.types.length > 0 ||
                    filters.recurrenceTypes.length > 0 ||
                    filters.search ||
                    filters.hasLunarInfo ||
                    filters.hasTithi ||
                    filters.hasNakshatra) && <span className="text-primary"> (filtered)</span>}
                </>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-text-secondary mb-2">No events found</p>
                  {(filters.categoryIds.length > 0 ||
                    filters.types.length > 0 ||
                    filters.recurrenceTypes.length > 0 ||
                    filters.search ||
                    filters.hasLunarInfo ||
                    filters.hasTithi ||
                    filters.hasNakshatra) && (
                    <p className="text-sm text-text-muted">Try adjusting your filters</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Event Detail Modal */}
      <EventDetailModal
        isOpen={selectedEvent !== null}
        onClose={() => setSelectedEvent(null)}
        onDelete={handleRefreshEvents}
        event={selectedEvent}
      />
    </>
  )
}
