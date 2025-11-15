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
import { env } from '@/core/config/env.client'

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
      <div className="relative overflow-hidden">
        {/* Hero Section with gradient background */}
        <div className="relative bg-gradient-primary py-20 lg:py-32">
          <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5"></div>

          <Container className="relative">
            <div className="max-w-4xl mx-auto text-center animate-fade-in">
              <div className="inline-block mb-6 text-7xl animate-scale-in">
                🕉️
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-white drop-shadow-lg">
                {env.NEXT_PUBLIC_APP_NAME}
              </h1>

              <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto">
                Track Sanatana Dharma events, festivals, and lunar phases with elegance
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/calendar">
                  <Button size="lg" className="min-w-[200px]">
                    View Calendar
                  </Button>
                </Link>
                <Link href="/events/new">
                  <Button variant="outline" size="lg" className="min-w-[200px]">
                    Add Event
                  </Button>
                </Link>
              </div>
            </div>
          </Container>
        </div>

        {/* Upcoming Events Section */}
        <Container className="py-16 lg:py-24">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
                  Upcoming Events
                </h2>
                <p className="text-muted-foreground">
                  Your spiritual journey awaits
                </p>
              </div>
            </div>

            {events && events.length === 0 && (
              <div className="text-center py-20 bg-gradient-to-br from-muted/30 to-muted/10 rounded-3xl border-2 border-dashed border-border animate-fade-in">
                <div className="text-6xl mb-6">📅</div>
                <h3 className="text-2xl font-semibold text-foreground mb-3">
                  No upcoming events
                </h3>
                <p className="text-muted-foreground mb-6">
                  Start your spiritual calendar journey
                </p>
                <Link href="/events/new">
                  <Button size="lg">Create Your First Event</Button>
                </Link>
              </div>
            )}

            <div className="grid gap-6">
              {events?.map((event, index) => {
                const eventType = EVENT_TYPES.find(t => t.value === event.eventType)
                const eventColor = EVENT_COLORS.find(c => c.value === event.color)

                return (
                  <div
                    key={event.id}
                    className="group bg-card border border-border/50 rounded-2xl p-6 shadow-soft hover:shadow-elegant cursor-pointer animate-fade-in hover-lift"
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => setSelectedEvent(event)}
                  >
                    <div className="flex items-start gap-6">
                      <div className="flex-shrink-0">
                        <div className="text-5xl transform group-hover:scale-110 transition-transform duration-300">
                          {eventType?.icon}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                            {event.title}
                          </h3>
                          <div
                            className="flex-shrink-0 w-4 h-4 rounded-full ring-2 ring-white shadow-sm"
                            style={{ backgroundColor: eventColor?.hex }}
                          />
                        </div>

                        {event.description && (
                          <p className="text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                            {event.description}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-lg">
                            <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="font-medium text-foreground">
                              {toDisplayDate(event.startDate)}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-lg">
                            <span className="text-foreground/70">{eventType?.label}</span>
                          </div>

                          {event.isRecurring && (
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-lg">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                              <span className="font-medium">Recurring</span>
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
        </Container>
      </div>

      <EventDetailModal
        event={selectedEvent}
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </>
  )
}
