/**
 * useCategoryMutations Hook
 * Handles category create, update, delete operations
 */

'use client'

import { useState } from 'react'
import { useToast } from '@/shared/contexts/ToastContext'
import { MutationState } from '@/shared/types'
import { CreateCategoryInput, UpdateCategoryInput, Category } from '../types/category.types'

export function useCategoryMutations() {
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

  const createCategory = async (input: CreateCategoryInput): Promise<Category | null> => {
    setCreateState({ loading: true, error: null, success: false })

    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input)
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error?.message || 'Failed to create category')
      }

      setCreateState({ loading: false, error: null, success: true })
      showSuccess('Category created successfully')
      return data.data
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create category'
      setCreateState({ loading: false, error: errorMessage, success: false })
      showError(errorMessage)
      return null
    }
  }

  const updateCategory = async (input: UpdateCategoryInput): Promise<Category | null> => {
    setUpdateState({ loading: true, error: null, success: false })

    try {
      const { id, ...updateData } = input
      const response = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error?.message || 'Failed to update category')
      }

      setUpdateState({ loading: false, error: null, success: true })
      showSuccess('Category updated successfully')
      return data.data
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update category'
      setUpdateState({ loading: false, error: errorMessage, success: false })
      showError(errorMessage)
      return null
    }
  }

  const deleteCategory = async (id: number, deleteEvents: boolean = false): Promise<boolean> => {
    setDeleteState({ loading: true, error: null, success: false })

    try {
      const url = `/api/categories/${id}${deleteEvents ? '?deleteEvents=true' : ''}`
      const response = await fetch(url, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error?.message || 'Failed to delete category')
      }

      setDeleteState({ loading: false, error: null, success: true })
      showSuccess('Category deleted successfully')
      return true
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete category'
      setDeleteState({ loading: false, error: errorMessage, success: false })
      showError(errorMessage)
      return false
    }
  }

  return {
    createCategory,
    updateCategory,
    deleteCategory,
    createState,
    updateState,
    deleteState
  }
}
