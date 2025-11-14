'use client'

import { format, addDays, startOfWeek, isToday, isWeekend } from 'date-fns'
import { PlusCircle } from 'lucide-react'
import Link from 'next/link'
import { getEventTypeIcon, getLunarIcon, getMoonPhaseEmoji, getSunEmoji } from '@/lib/event-utils'
import type { EventType } from '@/types/event'

interface WeekViewEvent {
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

interface WeekViewProps {
  date: Date
  events: WeekViewEvent[]
  dailyAstronomy: Map<
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
  onEventClick: (event: WeekViewEvent) => void
  onDayClick: (date: Date) => void
  weekStartsOn?: 0 | 1 // 0 = Sunday, 1 = Monday
}

export function WeekView({
  date,
  events,
  dailyAstronomy,
  onEventClick,
  onDayClick,
  weekStartsOn = 0,
}: WeekViewProps) {
  const weekStart = startOfWeek(date, { weekStartsOn })
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  return (
    <div className="grid grid-cols-7 gap-3 p-4">
      {days.map((day) => {
        const dateStr = format(day, 'yyyy-MM-dd')
        const dayAstronomy = dailyAstronomy.get(dateStr)
        const eventsForDay = events.filter((event) => format(event.start, 'yyyy-MM-dd') === dateStr)
        const isCurrentDay = isToday(day)
        const isWeekendDay = isWeekend(day)

        return (
          <div
            key={dateStr}
            onClick={() => onDayClick(day)}
            className={`
              surface rounded-lg border min-h-[400px] flex flex-col cursor-pointer
              transition-all hover:shadow-lg hover:-translate-y-1
              ${isCurrentDay ? 'border-primary border-2 bg-primary/5' : 'border-border'}
              ${isWeekendDay && !isCurrentDay ? 'weekend-day' : ''}
            `}
          >
            {/* Day Header */}
            <div className="p-3 border-b border-border">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-text-secondary">{format(day, 'EEE')}</div>
                {/* Sun + Moon Icons */}
                <div className="flex items-center gap-1">
                  {dayAstronomy?.sunrise && (
                    <span
                      className="text-xs cursor-help"
                      title={`☀️ ${dayAstronomy.sunrise} - ${dayAstronomy.sunset}`}
                    >
                      {getSunEmoji()}
                    </span>
                  )}
                  {dayAstronomy && (
                    <span
                      className="text-xs cursor-help"
                      title={`${dayAstronomy.percentage}% ${dayAstronomy.isWaxing ? 'Waxing' : 'Waning'}`}
                    >
                      {getMoonPhaseEmoji(
                        dayAstronomy.percentage,
                        dayAstronomy.isWaxing,
                        dayAstronomy.phase
                      )}
                    </span>
                  )}
                </div>
              </div>

              <div
                className={`
                text-2xl font-bold
                ${isCurrentDay ? 'text-primary' : 'text-text-primary'}
              `}
              >
                {format(day, 'd')}
              </div>
            </div>

            {/* Events List */}
            <div className="flex-1 p-2 space-y-2 overflow-y-auto">
              {eventsForDay.length > 0 ? (
                eventsForDay.map((event) => (
                  <button
                    key={event.id}
                    onClick={(e) => {
                      e.stopPropagation() // Prevent day click
                      onEventClick(event)
                    }}
                    className={`
                      w-full text-left p-2 rounded-lg border transition-all
                      hover:shadow-sm
                      event-category-${event.resource.categoryName.toLowerCase()}
                    `}
                  >
                    <div className="flex items-start gap-1">
                      <span className="text-sm flex-shrink-0">
                        {getEventTypeIcon(event.resource.type)}
                      </span>
                      {event.resource.tithi && (
                        <span className="text-sm flex-shrink-0">
                          {getLunarIcon(event.resource.tithi)}
                        </span>
                      )}
                      <span className="text-xs font-medium text-text-primary truncate flex-1">
                        {event.title}
                      </span>
                    </div>
                  </button>
                ))
              ) : (
                // Empty state - small add button
                <Link
                  href={`/events/new?date=${dateStr}`}
                  onClick={(e) => e.stopPropagation()} // Prevent day click
                >
                  <button className="w-full p-2 rounded-lg border border-dashed border-border hover:border-primary hover:bg-primary/5 transition-all group">
                    <PlusCircle className="w-4 h-4 text-text-muted group-hover:text-primary mx-auto" />
                  </button>
                </Link>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
