/**
 * Theme Context
 * Global state management for themes
 */

'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { Theme } from '../types/theme.types'
import { applyThemeColors, storeThemeId, storeDarkMode, getStoredDarkMode } from '../utils/theme-utils'
import { useActiveTheme } from '../hooks/useActiveTheme'

interface ThemeContextValue {
  currentTheme: Theme | null
  isDark: boolean
  isLoading: boolean
  error: string | null
  switchTheme: (themeId: number) => Promise<void>
  toggleDarkMode: () => void
  isSwitching: boolean
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { data: activeTheme, loading, error } = useActiveTheme()
  const [currentTheme, setCurrentTheme] = useState<Theme | null>(null)
  const [isDark, setIsDark] = useState(false)
  const [isSwitching, setIsSwitching] = useState(false)

  // Load dark mode preference on mount
  useEffect(() => {
    const storedDarkMode = getStoredDarkMode()
    if (storedDarkMode !== null) {
      setIsDark(storedDarkMode)
    }
  }, [])

  // Apply theme when active theme is loaded or dark mode changes
  useEffect(() => {
    if (activeTheme) {
      setCurrentTheme(activeTheme)
      const colors = isDark && activeTheme.darkColors ? activeTheme.darkColors : activeTheme.colors
      applyThemeColors(colors)
      storeThemeId(activeTheme.id)
    }
  }, [activeTheme, isDark])

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
      const colors = isDark && newTheme.darkColors ? newTheme.darkColors : newTheme.colors
      applyThemeColors(colors)
      storeThemeId(newTheme.id)
    } catch (err) {
      console.error('Failed to switch theme:', err)
      throw err
    } finally {
      setIsSwitching(false)
    }
  }, [isDark])

  // Toggle dark mode function
  const toggleDarkMode = useCallback(() => {
    setIsDark((prev) => {
      const newDark = !prev
      storeDarkMode(newDark)

      // Apply theme colors immediately with new mode
      if (currentTheme) {
        const colors = newDark && currentTheme.darkColors
          ? currentTheme.darkColors
          : currentTheme.colors
        applyThemeColors(colors)
      }

      return newDark
    })
  }, [currentTheme])

  const value: ThemeContextValue = {
    currentTheme,
    isDark,
    isLoading: loading,
    error: error || null,
    switchTheme,
    toggleDarkMode,
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
