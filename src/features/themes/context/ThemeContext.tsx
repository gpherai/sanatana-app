/**
 * Theme Context
 * Global state management for themes
 */

'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { Theme } from '../types/theme.types'
import { applyThemeColors, storeThemeId, getStoredThemeId } from '../utils/theme-utils'
import { useActiveTheme } from '../hooks/useActiveTheme'

interface ThemeContextValue {
  currentTheme: Theme | null
  isLoading: boolean
  error: string | null
  switchTheme: (themeId: number) => Promise<void>
  isSwitching: boolean
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { data: activeTheme, loading, error } = useActiveTheme()
  const [currentTheme, setCurrentTheme] = useState<Theme | null>(null)
  const [isSwitching, setIsSwitching] = useState(false)

  // Apply theme when active theme is loaded
  useEffect(() => {
    if (activeTheme) {
      setCurrentTheme(activeTheme)
      applyThemeColors(activeTheme.colors)
      storeThemeId(activeTheme.id)
    }
  }, [activeTheme])

  // Switch theme function
  const switchTheme = useCallback(async (themeId: number) => {
    setIsSwitching(true)

    try {
      const response = await fetch(`/api/themes/${themeId}/activate`, {
        method: 'POST'
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error?.message || 'Failed to switch theme')
      }

      const newTheme = result.data as Theme

      // Optimistic update - apply theme immediately
      setCurrentTheme(newTheme)
      applyThemeColors(newTheme.colors)
      storeThemeId(newTheme.id)
    } catch (err) {
      console.error('Failed to switch theme:', err)
      throw err
    } finally {
      setIsSwitching(false)
    }
  }, [])

  const value: ThemeContextValue = {
    currentTheme,
    isLoading: loading,
    error: error || null,
    switchTheme,
    isSwitching
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

/**
 * Hook to use theme context
 */
export function useTheme() {
  const context = useContext(ThemeContext)

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }

  return context
}
