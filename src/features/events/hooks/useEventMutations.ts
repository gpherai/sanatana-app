/**
 * useEventMutations Hook
 * Handles event create, update, delete operations
 */

'use client'

import { useState } from 'react'
import { useToast } from '@/shared/contexts/ToastContext'
import { MutationState } from '@/shared/types'
import { CreateEventInput, UpdateEventInput, Event } from '../types/event.types'

export function useEventMutations() {
  const { showSuccess, showError } = useToast()
  const [createState, setCreateState] = useState<MutationState>({
    loading: false,
    error: null,
    success: false
  })
  const [updateState, setUpdateState] = useState<MutationState>({
    loading: false,
    error: null,
    success: false
  })
  const [deleteState, setDeleteState] = useState<MutationState>({
    loading: false,
    error: null,
    success: false
  })

  const createEvent = async (input: CreateEventInput): Promise<Event | null> => {
    setCreateState({ loading: true, error: null, success: false })

    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input)
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error?.message || 'Failed to create event')
      }

      setCreateState({ loading: false, error: null, success: true })
      showSuccess('Event created successfully')
      return data.data
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create event'
      setCreateState({ loading: false, error: errorMessage, success: false })
      showError(errorMessage)
      return null
    }
  }

  const updateEvent = async (input: UpdateEventInput): Promise<Event | null> => {
    setUpdateState({ loading: true, error: null, success: false })

    try {
      const { id, ...updateData } = input
      const response = await fetch(`/api/events/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error?.message || 'Failed to update event')
      }

      setUpdateState({ loading: false, error: null, success: true })
      showSuccess('Event updated successfully')
      return data.data
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update event'
      setUpdateState({ loading: false, error: errorMessage, success: false })
      showError(errorMessage)
      return null
    }
  }

  const deleteEvent = async (id: number): Promise<boolean> => {
    setDeleteState({ loading: true, error: null, success: false })

    try {
      const response = await fetch(`/api/events/${id}`, {
        method: 'DELETE'
      })

      // 204 No Content means success but no response body
      if (response.status === 204) {
        setDeleteState({ loading: false, error: null, success: true })
        showSuccess('Event deleted successfully')
        return true
      }

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error?.message || 'Failed to delete event')
      }

      setDeleteState({ loading: false, error: null, success: true })
      showSuccess('Event deleted successfully')
      return true
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete event'
      setDeleteState({ loading: false, error: errorMessage, success: false })
      showError(errorMessage)
      return false
    }
  }

  return {
    createEvent,
    updateEvent,
    deleteEvent,
    createState,
    updateState,
    deleteState
  }
}
