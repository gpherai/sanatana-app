/**
 * Theme Utilities
 * Functions for applying theme colors to CSS variables
 */

import { ThemeColors } from '../types/theme.types'

/**
 * Apply theme colors to CSS variables
 * Updates the :root CSS variables for instant theme switching
 */
export function applyThemeColors(colors: ThemeColors): void {
  if (typeof document === 'undefined') return

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
}

/**
 * Store theme ID in localStorage
 */
export function storeThemeId(themeId: number): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('theme-id', themeId.toString())
}

/**
 * Get stored theme ID from localStorage
 */
export function getStoredThemeId(): number | null {
  if (typeof window === 'undefined') return null
  const stored = localStorage.getItem('theme-id')
  return stored ? parseInt(stored, 10) : null
}

/**
 * Remove stored theme ID from localStorage
 */
export function removeStoredThemeId(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem('theme-id')
}
