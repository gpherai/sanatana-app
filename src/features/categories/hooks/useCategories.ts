/**
 * useCategories Hook
 * Fetches and manages categories data
 */

'use client'

import { useFetch } from '@/shared/hooks'
import { Category } from '../types/category.types'

export function useCategories() {
  return useFetch<Category[]>('/api/categories')
}

export function useCategory(id: number | null) {
  const url = id ? `/api/categories/${id}` : null
  return useFetch<Category>(url, { enabled: !!id })
}
