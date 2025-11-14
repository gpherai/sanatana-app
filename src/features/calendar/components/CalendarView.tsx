/**
 * Calendar View Component
 * Main calendar grid display
 */

'use client'

import { useState } from 'react'
import { Button } from '@/shared/components/ui/Button'
import { Event } from '@/features/events/types/event.types'
import { toDisplayDate, getStartOfMonth, getEndOfMonth, getDateRange, isToday } from '@/shared/utils/date.utils'
import { cn } from '@/shared/utils/cn'
import { EVENT_COLORS } from '@/core/config/constants'

interface CalendarViewProps {
  events: Event[]
  onEventClick?: (event: Event) => void
  onDateClick?: (date: Date) => void
  onMonthChange?: (date: Date) => void
}

export function CalendarView({ events, onEventClick, onDateClick, onMonthChange }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const monthStart = getStartOfMonth(currentMonth)
  const monthEnd = getEndOfMonth(currentMonth)

  // Get all days to display (including padding days from prev/next month)
  const startDate = new Date(monthStart)
  startDate.setDate(startDate.getDate() - monthStart.getDay()) // Start from Sunday

  const endDate = new Date(monthEnd)
  endDate.setDate(endDate.getDate() + (6 - monthEnd.getDay())) // End on Saturday

  const calendarDays = getDateRange(startDate, endDate)

  const goToPreviousMonth = () => {
    const newDate = new Date(currentMonth)
    newDate.setMonth(newDate.getMonth() - 1)
    setCurrentMonth(newDate)
    onMonthChange?.(newDate)
  }

  const goToNextMonth = () => {
    const newDate = new Date(currentMonth)
    newDate.setMonth(newDate.getMonth() + 1)
    setCurrentMonth(newDate)
    onMonthChange?.(newDate)
  }

  const goToToday = () => {
    const today = new Date()
    setCurrentMonth(today)
    onMonthChange?.(today)
  }

  const getEventsForDate = (date: Date): Event[] => {
    return events.filter(event => {
      const eventStart = new Date(event.startDate)
      const eventEnd = event.endDate ? new Date(event.endDate) : eventStart

      return date >= new Date(eventStart.setHours(0, 0, 0, 0)) &&
             date <= new Date(eventEnd.setHours(23, 59, 59, 999))
    })
  }

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentMonth.getMonth()
  }

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">
          {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h2>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={goToToday}>
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Button>
          <Button variant="outline" size="sm" onClick={goToNextMonth}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((date, index) => {
            const dayEvents = getEventsForDate(date)
            const isCurrent = isCurrentMonth(date)
            const isTodayDate = isToday(date)

            return (
              <div
                key={index}
                className={cn(
                  'min-h-24 p-2 border rounded-lg cursor-pointer transition-colors',
                  isCurrent ? 'bg-background border-border' : 'bg-muted/30 border-muted',
                  isTodayDate && 'ring-2 ring-primary',
                  'hover:bg-muted'
                )}
                onClick={() => onDateClick?.(date)}
              >
                <div className={cn(
                  'text-sm font-medium mb-1',
                  isCurrent ? 'text-foreground' : 'text-muted-foreground',
                  isTodayDate && 'text-primary font-bold'
                )}>
                  {date.getDate()}
                </div>

                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map((event) => {
                    const color = EVENT_COLORS.find(c => c.value === event.color)
                    return (
                      <div
                        key={event.id}
                        className="text-xs px-2 py-1 rounded truncate cursor-pointer hover:opacity-80"
                        style={{
                          backgroundColor: color?.hex || '#3b82f6',
                          color: 'white'
                        }}
                        onClick={(e) => {
                          e.stopPropagation()
                          onEventClick?.(event)
                        }}
                      >
                        {event.title}
                      </div>
                    )
                  })}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-muted-foreground px-2">
                      +{dayEvents.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
