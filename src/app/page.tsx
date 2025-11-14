/**
 * Home Page
 * Main landing page with upcoming events
 */

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Container } from '@/shared/components/layout/Container'
import { Button } from '@/shared/components/ui/Button'
import { Loading } from '@/shared/components/ui/Loading'
import { EventDetailModal } from '@/features/events/components/EventDetailModal'
import { useUpcomingEvents } from '@/features/events/hooks/useEvents'
import { Event } from '@/features/events/types/event.types'
import { toDisplayDate } from '@/shared/utils/date.utils'
import { EVENT_TYPES, EVENT_COLORS } from '@/core/config/constants'
import { env } from '@/core/config/env'

export default function HomePage() {
  const { data: events, loading, error } = useUpcomingEvents(10)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

  if (loading) {
    return (
      <Container className="py-16">
        <Loading size="lg" message="Loading upcoming events..." />
      </Container>
    )
  }

  if (error) {
    return (
      <Container className="py-16">
        <div className="text-center text-red-500">Error loading events: {error}</div>
      </Container>
    )
  }

  return (
    <>
      <Container className="py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-foreground mb-4">
              🕉️ {env.NEXT_PUBLIC_APP_NAME}
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Track Sanatana Dharma events, festivals, and lunar phases
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/calendar">
                <Button size="lg">View Calendar</Button>
              </Link>
              <Link href="/events/new">
                <Button variant="outline" size="lg">Add Event</Button>
              </Link>
            </div>
          </div>

          <div className="mt-16">
            <h2 className="text-2xl font-bold text-foreground mb-6">Upcoming Events</h2>

            {events && events.length === 0 && (
              <div className="text-center py-12 bg-muted rounded-lg">
                <p className="text-muted-foreground mb-4">No upcoming events</p>
                <Link href="/events/new">
                  <Button>Create Your First Event</Button>
                </Link>
              </div>
            )}

            <div className="space-y-4">
              {events?.map((event) => {
                const eventType = EVENT_TYPES.find(t => t.value === event.eventType)
                const eventColor = EVENT_COLORS.find(c => c.value === event.color)

                return (
                  <div
                    key={event.id}
                    className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedEvent(event)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">{eventType?.icon}</div>

                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground mb-1">
                          {event.title}
                        </h3>

                        {event.description && (
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                            {event.description}
                          </p>
                        )}

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>{toDisplayDate(event.startDate)}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: eventColor?.hex }}
                            />
                            <span>{eventType?.label}</span>
                          </div>

                          {event.isRecurring && (
                            <div className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                              <span>Recurring</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </Container>

      <EventDetailModal
        event={selectedEvent}
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </>
  )
}
