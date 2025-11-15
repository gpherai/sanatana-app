/**
 * Event Detail Modal
 * Displays detailed event information
 */

'use client'

import { useState } from 'react'
import { Modal } from '@/shared/components/ui/Modal'
import { Button } from '@/shared/components/ui/Button'
import { ConfirmDialog } from '@/shared/components/ui/ConfirmDialog'
import { Event } from '../types/event.types'
import { toFullDate, formatTime } from '@/shared/utils/date.utils'
import { EVENT_TYPES, EVENT_COLORS } from '@/core/config/constants'

interface EventDetailModalProps {
  event: Event | null
  isOpen: boolean
  onClose: () => void
  onEdit?: (event: Event) => void
  onDelete?: (id: number) => void
  isDeleting?: boolean
}

export function EventDetailModal({
  event,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  isDeleting = false
}: EventDetailModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  if (!event) return null

  const eventType = EVENT_TYPES.find(t => t.value === event.eventType)
  const eventColor = EVENT_COLORS.find(c => c.value === event.color)

  const handleDelete = () => {
    if (onDelete) {
      onDelete(event.id)
      setShowDeleteConfirm(false)
      onClose()
    }
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={event.title}
        size="lg"
      >
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{eventType?.icon}</span>
            <div>
              <p className="text-sm text-muted-foreground">Event Type</p>
              <p className="font-medium">{eventType?.label}</p>
            </div>
          </div>

          {event.description && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Description</p>
              <p className="text-foreground whitespace-pre-wrap">{event.description}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Start Date</p>
              <p className="font-medium">{toFullDate(event.startDate)}</p>
              {!event.isAllDay && (
                <p className="text-sm text-muted-foreground">{formatTime(event.startDate)}</p>
              )}
            </div>

            {event.endDate && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">End Date</p>
                <p className="font-medium">{toFullDate(event.endDate)}</p>
                {!event.isAllDay && (
                  <p className="text-sm text-muted-foreground">{formatTime(event.endDate)}</p>
                )}
              </div>
            )}
          </div>

          {event.location && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Location</p>
              <p className="font-medium">{event.location}</p>
            </div>
          )}

          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: eventColor?.hex }}
            />
            <p className="text-sm text-foreground">{eventColor?.label}</p>
          </div>

          {event.reminder && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span>Reminder set for {event.reminderMinutes} minutes before</span>
            </div>
          )}

          {event.isRecurring && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Recurring event</span>
            </div>
          )}

          {(onEdit || onDelete) && (
            <div className="flex gap-3 pt-4 border-t">
              {onEdit && (
                <Button
                  variant="outline"
                  onClick={() => {
                    onEdit(event)
                    onClose()
                  }}
                  className="flex-1"
                >
                  Edit Event
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="danger"
                  onClick={() => setShowDeleteConfirm(true)}
                  isLoading={isDeleting}
                  disabled={isDeleting}
                  className="flex-1"
                >
                  Delete Event
                </Button>
              )}
            </div>
          )}
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Event"
        message="Are you sure you want to delete this event? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </>
  )
}
