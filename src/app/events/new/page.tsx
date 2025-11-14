'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { PlusCircle } from 'lucide-react'
import { EventForm } from '@/components/events/EventForm'
import { useToast } from '@/contexts/ToastContext'
import type { Event } from '@/types/event'

export default function NewEventPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { showToast } = useToast()

  // Get pre-filled date from query parameter (if any)
  const prefilledDate = searchParams.get('date') || undefined

  const handleSuccess = (event: Event) => {
    // Show success toast
    showToast(`Event "${event.name}" created successfully!`, 'success', 3000)

    // Small delay before redirect to ensure toast is visible
    setTimeout(() => {
      router.push('/calendar')
    }, 100)
  }

  const handleCancel = () => {
    // Go back to previous page
    router.back()
  }

  return (
    <main className="flex-1 container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <PlusCircle className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-text-primary">Create New Event</h1>
          </div>
          <p className="text-text-secondary">Add a new event to your calendar</p>
        </div>

        {/* Event Form */}
        <div className="surface p-6 rounded-lg border border-border">
          <EventForm
            mode="create"
            prefilledData={prefilledDate ? { date: prefilledDate } : undefined}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </main>
  )
}
