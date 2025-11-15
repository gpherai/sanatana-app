/**
 * useFetch Hook
 * Generic data fetching hook with loading and error states
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { FetchState, ApiResponse } from '@/shared/types'

interface UseFetchOptions {
  enabled?: boolean
  onSuccess?: (data: unknown) => void
  onError?: (error: string) => void
}

export function useFetch<T>(
  url: string | null,
  options: UseFetchOptions = {}
): FetchState<T> & { refetch: () => void } {
  const { enabled = true, onSuccess, onError } = options

  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: false,
    error: null
  })

  const fetchData = useCallback(async () => {
    if (!url || !enabled) return

    setState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      const response = await fetch(url)
      const json: ApiResponse<T> = await response.json()

      if (!response.ok || !json.success) {
        throw new Error(json.success ? 'Request failed' : json.error.message)
      }

      setState({ data: json.data, loading: false, error: null })
      onSuccess?.(json.data)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred'
      setState({ data: null, loading: false, error: errorMessage })
      onError?.(errorMessage)
    }
  }, [url, enabled, onSuccess, onError])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    ...state,
    refetch: fetchData
  }
}
