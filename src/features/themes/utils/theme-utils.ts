/**
 * Theme Utilities
 * Functions for applying theme colors to CSS variables
 */

import { ThemeColors } from '../types/theme.types'

/**
 * Validate RGB color string (format: "R G B")
 */
export function isValidRGBColor(color: string): boolean {
  const parts = color.trim().split(/\s+/)
  if (parts.length !== 3) return false

  return parts.every((part) => {
    const num = parseInt(part, 10)
    return !isNaN(num) && num >= 0 && num <= 255
  })
}

/**
 * Validate ThemeColors object
 */
export function validateThemeColors(colors: Partial<ThemeColors>): boolean {
  const requiredKeys = [
    'primary',
    'secondary',
    'accent',
    'background',
    'foreground',
    'muted',
    'mutedForeground',
    'card',
    'cardForeground',
    'border',
    'gradientFrom',
    'gradientVia',
    'gradientTo'
  ] as const

  for (const key of requiredKeys) {
    const value = colors[key]
    if (!value || typeof value !== 'string' || !isValidRGBColor(value)) {
      console.warn(`Invalid color value for ${key}:`, value)
      return false
    }
  }

  return true
}

/**
 * Apply theme colors to CSS variables
 * Updates the :root CSS variables for instant theme switching
 */
export function applyThemeColors(colors: ThemeColors): void {
  if (typeof document === 'undefined') return

  // Validate colors before applying
  if (!validateThemeColors(colors)) {
    console.error('Invalid theme colors detected, skipping application')
    return
  }

  const root = document.documentElement

  // Apply each color as a CSS variable
  root.style.setProperty('--color-primary', colors.primary)
  root.style.setProperty('--color-secondary', colors.secondary)
  root.style.setProperty('--color-accent', colors.accent)
  root.style.setProperty('--color-background', colors.background)
  root.style.setProperty('--color-foreground', colors.foreground)
  root.style.setProperty('--color-muted', colors.muted)
  root.style.setProperty('--color-muted-foreground', colors.mutedForeground)
  root.style.setProperty('--color-card', colors.card)
  root.style.setProperty('--color-card-foreground', colors.cardForeground)
  root.style.setProperty('--color-border', colors.border)

  // Apply gradient colors
  root.style.setProperty('--gradient-from', colors.gradientFrom)
  root.style.setProperty('--gradient-via', colors.gradientVia)
  root.style.setProperty('--gradient-to', colors.gradientTo)
}

/**
 * Store theme ID in localStorage
 */
export function storeThemeId(themeId: number): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem('theme-id', themeId.toString())
  } catch (error) {
    // Handle quota exceeded, private browsing, etc.
    console.warn('Failed to store theme ID in localStorage:', error)
  }
}

/**
 * Get stored theme ID from localStorage
 */
export function getStoredThemeId(): number | null {
  if (typeof window === 'undefined') return null

  try {
    const stored = localStorage.getItem('theme-id')
    if (!stored) return null

    const parsed = parseInt(stored, 10)
    return !isNaN(parsed) ? parsed : null
  } catch (error) {
    console.warn('Failed to get theme ID from localStorage:', error)
    return null
  }
}

/**
 * Remove stored theme ID from localStorage
 */
export function removeStoredThemeId(): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.removeItem('theme-id')
  } catch (error) {
    console.warn('Failed to remove theme ID from localStorage:', error)
  }
}

/**
 * Store dark mode preference in localStorage
 */
export function storeDarkMode(isDark: boolean): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem('dark-mode', isDark.toString())
  } catch (error) {
    console.warn('Failed to store dark mode preference in localStorage:', error)
  }
}

/**
 * Get stored dark mode preference from localStorage
 */
export function getStoredDarkMode(): boolean | null {
  if (typeof window === 'undefined') return null

  try {
    const stored = localStorage.getItem('dark-mode')
    return stored !== null ? stored === 'true' : null
  } catch (error) {
    console.warn('Failed to get dark mode preference from localStorage:', error)
    return null
  }
}
