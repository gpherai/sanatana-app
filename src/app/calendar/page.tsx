/**
 * Calendar Page
 * Full calendar view with filtering
 */

'use client'

import { useState } from 'react'
import { CalendarView } from '@/features/calendar/components/CalendarView'
import { FilterSidebar } from '@/features/calendar/components/FilterSidebar'
import { EventDetailModal } from '@/features/events/components/EventDetailModal'
import { useEvents } from '@/features/events/hooks/useEvents'
import { useEventMutations } from '@/features/events/hooks/useEventMutations'
import { Event, EventFilters } from '@/features/events/types/event.types'
import { Loading } from '@/shared/components/ui/Loading'
import { Button } from '@/shared/components/ui/Button'

export default function CalendarPage() {
  const [filters, setFilters] = useState<EventFilters>({})
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  const { data: events, loading, error, refetch } = useEvents({ filters })
  const { deleteEvent, deleteState } = useEventMutations()

  const handleDeleteEvent = async (id: number) => {
    const success = await deleteEvent(id)
    if (success) {
      refetch()
      setSelectedEvent(null)
    }
  }

  if (loading) {
    return <Loading size="lg" fullScreen message="Loading calendar..." />
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error loading calendar: {error}</p>
          <Button onClick={() => refetch()}>Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="h-[calc(100vh-4rem)] flex">
        {/* Mobile filter toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden fixed bottom-4 right-4 z-40 bg-primary text-white p-4 rounded-full shadow-lg"
          aria-label="Toggle filters"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
        </button>

        {/* Filter Sidebar */}
        <div className={`
          ${showFilters ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
          fixed md:relative
          inset-y-0 left-0
          w-80
          transition-transform
          z-30
          md:z-0
        `}>
          <FilterSidebar
            filters={filters}
            onFiltersChange={setFilters}
            onClose={() => setShowFilters(false)}
          />
        </div>

        {/* Backdrop for mobile */}
        {showFilters && (
          <div
            className="md:hidden fixed inset-0 bg-black/50 z-20"
            onClick={() => setShowFilters(false)}
          />
        )}

        {/* Calendar View */}
        <div className="flex-1 overflow-hidden">
          <CalendarView
            events={events || []}
            onEventClick={setSelectedEvent}
          />
        </div>
      </div>

      <EventDetailModal
        event={selectedEvent}
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onDelete={handleDeleteEvent}
        isDeleting={deleteState.loading}
      />
    </>
  )
}
