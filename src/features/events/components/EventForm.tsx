/**
 * Event Form Component
 * Form for creating and editing events
 */

'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { Select } from '@/shared/components/ui/Select'
import { EVENT_TYPES, EVENT_COLORS } from '@/core/config/constants'
import { CreateEventInput, UpdateEventInput, Event } from '../types/event.types'
import { toISODate } from '@/shared/utils/date.utils'

interface EventFormProps {
  event?: Event
  onSubmit: (data: CreateEventInput | UpdateEventInput) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function EventForm({ event, onSubmit, onCancel, isLoading = false }: EventFormProps) {
  const [formData, setFormData] = useState<Partial<CreateEventInput>>({
    title: event?.title || '',
    description: event?.description || '',
    eventType: event?.eventType || 'FESTIVAL',
    startDate: event?.startDate ? toISODate(event.startDate) : toISODate(new Date()),
    endDate: event?.endDate ? toISODate(event.endDate) : undefined,
    isAllDay: event?.isAllDay ?? true,
    color: event?.color || 'blue',
    location: event?.location || '',
    reminder: event?.reminder || false,
    reminderMinutes: event?.reminderMinutes || 30
  })

  const handleChange = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const submitData = event
      ? ({ id: event.id, ...formData } as UpdateEventInput)
      : (formData as CreateEventInput)

    await onSubmit(submitData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Title"
        value={formData.title}
        onChange={(e) => handleChange('title', e.target.value)}
        required
        placeholder="Event title"
      />

      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Event description (optional)"
        />
      </div>

      <Select
        label="Event Type"
        value={formData.eventType}
        onChange={(e) => handleChange('eventType', e.target.value)}
        options={EVENT_TYPES}
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Start Date"
          type="date"
          value={formData.startDate as string}
          onChange={(e) => handleChange('startDate', e.target.value)}
          required
        />

        <Input
          label="End Date"
          type="date"
          value={formData.endDate as string}
          onChange={(e) => handleChange('endDate', e.target.value)}
        />
      </div>

      <Select
        label="Color"
        value={formData.color}
        onChange={(e) => handleChange('color', e.target.value)}
        options={EVENT_COLORS}
        required
      />

      <Input
        label="Location"
        value={formData.location}
        onChange={(e) => handleChange('location', e.target.value)}
        placeholder="Event location (optional)"
      />

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isAllDay"
          checked={formData.isAllDay}
          onChange={(e) => handleChange('isAllDay', e.target.checked)}
          className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
        />
        <label htmlFor="isAllDay" className="text-sm text-foreground">
          All day event
        </label>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="reminder"
          checked={formData.reminder}
          onChange={(e) => handleChange('reminder', e.target.checked)}
          className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
        />
        <label htmlFor="reminder" className="text-sm text-foreground">
          Set reminder
        </label>
      </div>

      {formData.reminder && (
        <Input
          label="Reminder (minutes before)"
          type="number"
          value={formData.reminderMinutes}
          onChange={(e) => handleChange('reminderMinutes', parseInt(e.target.value))}
          min={1}
          max={10080}
        />
      )}

      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          isLoading={isLoading}
          disabled={isLoading}
          className="flex-1"
        >
          {event ? 'Update' : 'Create'} Event
        </Button>
      </div>
    </form>
  )
}
