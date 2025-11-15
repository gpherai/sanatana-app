/**
 * useActiveTheme Hook
 * Fetches the currently active theme
 */

'use client'

import { useFetch } from '@/shared/hooks'
import { Theme } from '../types/theme.types'

export function useActiveTheme() {
  return useFetch<Theme>('/api/themes/active')
}
