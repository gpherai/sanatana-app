/**
 * useThemes Hook
 * Fetches all available themes
 */

'use client'

import { useFetch } from '@/shared/hooks'
import { Theme } from '../types/theme.types'

export function useThemes() {
  return useFetch<Theme[]>('/api/themes')
}
