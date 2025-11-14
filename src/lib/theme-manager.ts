// Theme management utilities - Tailwind v4 Convention (data-attribute based)
import type { Theme } from '@/types/theme'
import { DEFAULT_THEME } from '@/config/constants'

/**
 * Load theme from JSON file
 */
export async function loadTheme(themeId: string): Promise<Theme | null> {
  try {
    const response = await fetch(`/themes/${themeId}.json`)
    if (!response.ok) {
      throw new Error(`Theme ${themeId} not found`)
    }
    return await response.json()
  } catch (error) {
    console.error('Error loading theme:', error)
    return null
  }
}

/**
 * Apply theme using data-attribute (Tailwind v4 convention)
 * Theme colors are defined in CSS via [data-theme] selectors
 */
export function applyTheme(themeId: string): void {
  const root = document.documentElement
  root.setAttribute('data-theme', themeId)
}

/**
 * Get current theme from localStorage or default
 */
export function getCurrentThemeId(): string {
  if (typeof window === 'undefined') return DEFAULT_THEME
  return localStorage.getItem('currentTheme') ?? DEFAULT_THEME
}

/**
 * Save current theme to localStorage
 */
export function saveCurrentThemeId(themeId: string): void {
  localStorage.setItem('currentTheme', themeId)
}

/**
 * Toggle dark mode
 */
export function toggleDarkMode(): boolean {
  const root = document.documentElement
  const isDark = root.classList.contains('dark')

  if (isDark) {
    root.classList.remove('dark')
    localStorage.setItem('darkMode', 'false')
    return false
  } else {
    root.classList.add('dark')
    localStorage.setItem('darkMode', 'true')
    return true
  }
}

/**
 * Set dark mode explicitly
 */
export function setDarkMode(dark: boolean): void {
  const root = document.documentElement

  if (dark) {
    root.classList.add('dark')
    localStorage.setItem('darkMode', 'true')
  } else {
    root.classList.remove('dark')
    localStorage.setItem('darkMode', 'false')
  }
}

/**
 * Check if dark mode is enabled
 */
export function isDarkMode(): boolean {
  if (typeof window === 'undefined') return false
  const darkModeSetting = localStorage.getItem('darkMode')
  return (
    darkModeSetting === 'true' ||
    (darkModeSetting === null && window.matchMedia('(prefers-color-scheme: dark)').matches)
  )
}

/**
 * Initialize theme and dark mode on page load
 */
export function initializeTheme(): void {
  // Apply saved theme
  const themeId = getCurrentThemeId()
  applyTheme(themeId)

  // Apply dark mode if enabled
  if (isDarkMode()) {
    document.documentElement.classList.add('dark')
  }
}
