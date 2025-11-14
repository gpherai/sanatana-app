/**
 * Create Event Page
 * Page for creating new events
 */

'use client'

import { useRouter } from 'next/navigation'
import { Container } from '@/shared/components/layout/Container'
import { EventForm } from '@/features/events/components/EventForm'
import { useEventMutations } from '@/features/events/hooks/useEventMutations'
import { CreateEventInput, UpdateEventInput } from '@/features/events/types/event.types'

export default function CreateEventPage() {
  const router = useRouter()
  const { createEvent, createState } = useEventMutations()

  const handleSubmit = async (data: CreateEventInput | UpdateEventInput) => {
    const event = await createEvent(data as CreateEventInput)
    if (event) {
      router.push('/calendar')
    }
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <Container className="py-8" size="md">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8">Create New Event</h1>

        <div className="bg-card border border-border rounded-lg p-6">
          <EventForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={createState.loading}
          />
        </div>
      </div>
    </Container>
  )
}
