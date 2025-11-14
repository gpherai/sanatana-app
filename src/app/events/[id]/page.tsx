'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Edit, AlertCircle } from 'lucide-react'
import { EventForm } from '@/components/events/EventForm'
import { useToast } from '@/contexts/ToastContext'
import type { Event, EventOccurrence } from '@/types/event'

export default function EditEventPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const { showToast } = useToast()
  const eventId = params.id

  const [event, setEvent] = useState<(Event & { occurrences: EventOccurrence[] }) | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch event data on mount
  useEffect(() => {
    const abortController = new AbortController()

    async function fetchEvent() {
      try {
        const response = await fetch(`/api/events/${eventId}`, {
          signal: abortController.signal,
        })

        const result = await response.json()

        if (result.success) {
          setEvent(result.data.event)
          setError(null)
        } else {
          setError(result.message || 'Failed to load event')
        }
      } catch (err) {
        // Ignore abort errors (component unmounted)
        if (err instanceof Error && err.name === 'AbortError') {
          return
        }
        setError('Failed to load event')
        console.error('Error fetching event:', err)
      } finally {
        // Only update loading state if not aborted
        if (!abortController.signal.aborted) {
          setLoading(false)
        }
      }
    }

    fetchEvent()

    // Cleanup: abort fetch on unmount
    return () => abortController.abort()
  }, [eventId])

  const handleSuccess = (updatedEvent: Event) => {
    // Show success toast
    showToast(`Event "${updatedEvent.name}" updated successfully!`, 'success', 3000)

    // Small delay before redirect to ensure toast is visible
    setTimeout(() => {
      router.push('/calendar')
    }, 100)
  }

  const handleCancel = () => {
    // Go back to previous page
    router.back()
  }

  // Loading state
  if (loading) {
    return (
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Edit className="w-8 h-8 text-primary animate-pulse" />
              <h1 className="text-3xl font-bold text-text-primary">Loading Event...</h1>
            </div>
          </div>
          <div className="surface p-6 rounded-lg border border-border">
            <div className="animate-pulse space-y-4">
              <div className="h-10 bg-surface-hover rounded"></div>
              <div className="h-24 bg-surface-hover rounded"></div>
              <div className="h-10 bg-surface-hover rounded"></div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  // Error state
  if (error || !event) {
    return (
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-8 h-8 text-red-500" />
              <h1 className="text-3xl font-bold text-text-primary">Error Loading Event</h1>
            </div>
          </div>
          <div className="surface p-6 rounded-lg border border-red-500/30 bg-red-500/10">
            <p className="text-text-primary mb-4">{error || 'Event not found'}</p>
            <div className="flex gap-3">
              <button
                onClick={() => router.push('/calendar')}
                className="px-6 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors"
              >
                Go to Calendar
              </button>
              <button
                onClick={() => router.back()}
                className="px-6 py-2 rounded-lg border border-border bg-surface text-text-primary font-medium hover:bg-surface-hover transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </main>
    )
  }

  // Success state - render form
  return (
    <main className="flex-1 container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Edit className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-text-primary">Edit Event</h1>
          </div>
          <p className="text-text-secondary">Update event details for &apos;{event.name}&apos;</p>
        </div>

        {/* Event Form */}
        <div className="surface p-6 rounded-lg border border-border">
          <EventForm
            mode="edit"
            initialData={event}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </main>
  )
}
