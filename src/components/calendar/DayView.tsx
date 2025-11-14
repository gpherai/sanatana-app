'use client'

import { format } from 'date-fns'
import { Calendar, PlusCircle, Clock } from 'lucide-react'
import Link from 'next/link'
import { getEventTypeIcon, getLunarIcon, getMoonPhaseEmoji, getSunEmoji } from '@/lib/event-utils'
import type { EventType } from '@/types/event'

interface DayViewEvent {
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

interface DayViewProps {
  date: Date
  events: DayViewEvent[]
  dailyAstronomy?: {
    percentage: number
    isWaxing: boolean
    phase?: string
    sunrise?: string
    sunset?: string
    moonrise?: string
    moonset?: string
  }
  onEventClick: (event: DayViewEvent) => void
}

export function DayView({ date, events, dailyAstronomy, onEventClick }: DayViewProps) {
  const dateStr = format(date, 'EEEE, MMMM d, yyyy')
  const eventsForDay = events.filter(
    (event) => format(event.start, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
  )

  return (
    <div className="space-y-6 p-6">
      {/* Date Header */}
      <div className="text-center border-b border-border pb-4">
        <h2 className="text-3xl font-bold text-text-primary">{dateStr}</h2>
        {dailyAstronomy && (
          <p className="text-text-secondary mt-2">
            {getMoonPhaseEmoji(
              dailyAstronomy.percentage,
              dailyAstronomy.isWaxing,
              dailyAstronomy.phase
            )}{' '}
            Moon {dailyAstronomy.percentage}% visible (
            {dailyAstronomy.isWaxing ? 'Waxing' : 'Waning'})
            {dailyAstronomy.phase && ` - ${dailyAstronomy.phase.replace('_', ' ')}`}
          </p>
        )}
      </div>

      {/* Astronomy Info Grid */}
      {dailyAstronomy && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Sun Times */}
          <div className="surface p-6 rounded-lg border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-3xl">{getSunEmoji()}</div>
              <h3 className="text-xl font-semibold text-text-primary">Sun</h3>
            </div>
            <div className="space-y-2">
              {dailyAstronomy.sunrise && (
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Sunrise</span>
                  <span className="font-mono text-lg text-text-primary">
                    {dailyAstronomy.sunrise}
                  </span>
                </div>
              )}
              {dailyAstronomy.sunset && (
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Sunset</span>
                  <span className="font-mono text-lg text-text-primary">
                    {dailyAstronomy.sunset}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Moon Times */}
          <div className="surface p-6 rounded-lg border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-3xl">
                {getMoonPhaseEmoji(
                  dailyAstronomy.percentage,
                  dailyAstronomy.isWaxing,
                  dailyAstronomy.phase
                )}
              </div>
              <h3 className="text-xl font-semibold text-text-primary">Moon</h3>
            </div>
            <div className="space-y-2">
              {dailyAstronomy.moonrise && (
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Moonrise</span>
                  <span className="font-mono text-lg text-text-primary">
                    {dailyAstronomy.moonrise}
                  </span>
                </div>
              )}
              {dailyAstronomy.moonset && (
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Moonset</span>
                  <span className="font-mono text-lg text-text-primary">
                    {dailyAstronomy.moonset}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Events Section */}
      <div className="space-y-4">
        {/* Header with conditional add button */}
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-text-primary flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            Events
          </h3>

          {/* Small + button - only show when there are events */}
          {eventsForDay.length > 0 && (
            <Link href={`/events/new?date=${format(date, 'yyyy-MM-dd')}`}>
              <button
                className="p-2 rounded-lg border border-border hover:border-primary hover:bg-primary/10 transition-colors"
                title="Add Event"
              >
                <PlusCircle className="w-5 h-5 text-primary" />
              </button>
            </Link>
          )}
        </div>

        {/* Events List */}
        {eventsForDay.length > 0 ? (
          <div className="space-y-3">
            {eventsForDay.map((event) => (
              <button
                key={event.id}
                onClick={() => onEventClick(event)}
                className={`
                  w-full text-left p-4 rounded-lg border transition-all
                  hover:shadow-md hover:-translate-y-0.5
                  event-category-${event.resource.categoryName.toLowerCase()}
                `}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{getEventTypeIcon(event.resource.type)}</span>
                      {event.resource.tithi && (
                        <span className="text-xl" title={event.resource.tithi}>
                          {getLunarIcon(event.resource.tithi)}
                        </span>
                      )}
                      <h4 className="text-lg font-semibold text-text-primary">{event.title}</h4>
                    </div>

                    {event.resource.description && (
                      <p className="text-text-secondary text-sm mb-2 line-clamp-2">
                        {event.resource.description}
                      </p>
                    )}

                    {/* Time Display (if event has times) */}
                    {!event.allDay && (
                      <div className="flex items-center gap-2 text-text-muted text-sm">
                        <Clock className="w-4 h-4" />
                        <span>
                          {format(event.start, 'HH:mm')}
                          {event.end && ` - ${format(event.end, 'HH:mm')}`}
                        </span>
                      </div>
                    )}

                    {/* Tags */}
                    {event.resource.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {event.resource.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 text-xs rounded-full bg-surface-hover text-text-secondary"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Category Badge */}
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-surface-hover border border-border text-text-secondary whitespace-nowrap">
                    {event.resource.categoryName}
                  </span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          // No Events - Show Add Button
          <div className="text-center py-12 surface rounded-lg border-2 border-dashed border-border">
            <Calendar className="w-16 h-16 text-text-muted mx-auto mb-4" />
            <p className="text-text-secondary mb-4">No events on this day</p>
            <Link href={`/events/new?date=${format(date, 'yyyy-MM-dd')}`}>
              <button className="px-6 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors inline-flex items-center gap-2">
                <PlusCircle className="w-5 h-5" />
                Add Your First Event
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
