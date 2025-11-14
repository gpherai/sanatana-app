'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { FocusTrap } from 'focus-trap-react'
import { X, Calendar, Clock, Tag, Moon, Edit, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { getEventTypeIcon, getEventTypeLabel } from '@/lib/event-utils'
import { useToast } from '@/contexts/ToastContext'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import type { EventType } from '@/types/event'

interface EventDetailModalProps {
  isOpen: boolean
  onClose: () => void
  onDelete?: () => void // Callback to refresh calendar after delete
  event: {
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
  } | null
}

export function EventDetailModal({ isOpen, onClose, onDelete, event }: EventDetailModalProps) {
  const router = useRouter()
  const { showToast } = useToast()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Store reference to element that opened modal for focus return
  const returnFocusRef = useRef<HTMLElement | null>(null)

  // Capture opening element before modal opens
  useEffect(() => {
    if (isOpen) {
      returnFocusRef.current = document.activeElement as HTMLElement
    }
  }, [isOpen])

  // Return focus to opening element when modal closes
  useEffect(() => {
    if (!isOpen && returnFocusRef.current) {
      returnFocusRef.current.focus()
      returnFocusRef.current = null
    }
  }, [isOpen])

  // Handle Escape key explicitly (focus-trap doesn't always trigger onClose)
  useEffect(() => {
    if (!isOpen || !event) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose, event])

  // Conditional return AFTER all hooks
  if (!isOpen || !event) return null

  const tags = event.resource.tags ?? []
  const typeIcon = getEventTypeIcon(event.resource.type)
  const typeLabel = getEventTypeLabel(event.resource.type)

  // Close on backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  // Handle Edit button
  const handleEdit = () => {
    router.push(`/events/${event.resource.eventId}`)
  }

  // Handle Delete button
  const handleDeleteClick = () => {
    setShowDeleteDialog(true)
  }

  const handleDeleteConfirm = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/events/${event.resource.eventId}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (result.success) {
        showToast(`Event "${event.title}" deleted successfully!`, 'success', 3000)
        setShowDeleteDialog(false)
        onClose() // Close modal
        onDelete?.() // Trigger calendar refresh
      } else {
        showToast(result.message || 'Failed to delete event', 'error', 5000)
      }
    } catch (error) {
      console.error('Error deleting event:', error)
      showToast('An error occurred while deleting the event', 'error', 5000)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false)
  }

  return (
    <>
      <FocusTrap
        active={isOpen}
        focusTrapOptions={{
          initialFocus: false, // Don't force focus on mount (let it naturally go to close button)
          clickOutsideDeactivates: true, // Allow backdrop click to close
          returnFocusOnDeactivate: false, // We handle this manually for better control
          allowOutsideClick: true, // Allow clicks outside to propagate
        }}
      >
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={handleBackdropClick}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="surface max-w-2xl w-full rounded-lg border-2 border-border shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between p-6 border-b border-border">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{typeIcon}</span>
                  <h2 id="modal-title" className="text-2xl font-bold text-text-primary">
                    {event.title}
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium border event-category-${event.resource.categoryName.toLowerCase()}`}
                  >
                    {event.resource.categoryName}
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-surface-hover text-text-secondary">
                    {typeLabel}
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-surface-hover transition-colors"
                aria-label="Close modal"
              >
                <X className="w-6 h-6 text-text-secondary" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Date & Time */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-text-muted">Date</p>
                    <p className="text-lg font-semibold text-text-primary">
                      {format(event.start, 'EEEE, MMMM d, yyyy')}
                    </p>
                  </div>
                </div>

                {!event.allDay && (
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-text-muted">Time</p>
                      <p className="text-lg font-semibold text-text-primary">
                        {format(event.start, 'h:mm a')} - {format(event.end, 'h:mm a')}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              {event.resource.description && (
                <div>
                  <h3 className="text-sm font-semibold text-text-muted mb-2">Description</h3>
                  <p className="text-text-secondary leading-relaxed">
                    {event.resource.description}
                  </p>
                </div>
              )}

              {/* Tags */}
              {tags.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Tag className="w-5 h-5 text-primary" />
                    <h3 className="text-sm font-semibold text-text-muted">Tags</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full text-sm bg-surface-hover text-text-secondary border border-border"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Lunar Information - Always visible */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Moon className="w-5 h-5 text-primary" />
                  <h3 className="text-sm font-semibold text-text-muted">Lunar Information</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-text-muted">Tithi</p>
                    <p className="text-text-primary font-medium">{event.resource.tithi || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-muted">Nakshatra</p>
                    <p className="text-text-primary font-medium">
                      {event.resource.nakshatra || '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-text-muted">Paksha</p>
                    <p className="text-text-primary font-medium">{event.resource.paksha || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-muted">Hindu Month</p>
                    <p className="text-text-primary font-medium">{event.resource.maas || '-'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-border flex justify-between gap-3">
              {/* Left side - Action buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleEdit}
                  className="px-6 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit Event
                </button>
                <button
                  onClick={handleDeleteClick}
                  disabled={isDeleting}
                  className="px-6 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>

              {/* Right side - Close button */}
              <button
                onClick={onClose}
                className="px-6 py-2 rounded-lg bg-surface-hover border border-border text-text-primary font-medium hover:bg-surface transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </FocusTrap>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Delete Event"
        message={`Are you sure you want to delete "${event.title}"? This action cannot be undone.`}
        confirmLabel={isDeleting ? 'Deleting...' : 'Delete'}
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </>
  )
}
