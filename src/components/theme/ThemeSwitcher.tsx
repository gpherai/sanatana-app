'use client'

import { useState, useEffect } from 'react'
import { Check } from 'lucide-react'
import type { Theme } from '@/types/theme'
import { applyTheme, getCurrentThemeId, saveCurrentThemeId } from '@/lib/theme-manager'

interface ThemeSwitcherProps {
  className?: string
}

export function ThemeSwitcher({ className = '' }: ThemeSwitcherProps) {
  const [themes, setThemes] = useState<Theme[]>([])
  const [currentThemeId, setCurrentThemeId] = useState<string>('spiritual-minimal')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load themes on mount
  useEffect(() => {
    const abortController = new AbortController()
    loadThemes(abortController.signal)

    // Cleanup: abort fetch on unmount
    return () => abortController.abort()
  }, [])

  const loadThemes = async (signal: AbortSignal) => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/themes', {
        signal,
      })
      const data = await response.json()

      if (data.success) {
        setThemes(data.data.themes)
        const savedTheme = getCurrentThemeId()
        setCurrentThemeId(savedTheme)

        // Apply saved theme (data-attribute only)
        applyTheme(savedTheme)
      } else {
        throw new Error(data.message ?? 'Failed to load themes')
      }
    } catch (error) {
      // Ignore abort errors (component unmounted or new fetch started)
      if (error instanceof Error && error.name === 'AbortError') {
        return
      }
      console.error('Failed to load themes:', error)
      setError('Failed to load themes. Please try again.')
    } finally {
      // Only update loading state if not aborted
      if (!signal.aborted) {
        setLoading(false)
      }
    }
  }

  // Handle theme selection
  const handleThemeSelect = (themeId: string) => {
    setCurrentThemeId(themeId)
    applyTheme(themeId)
    saveCurrentThemeId(themeId)

    // TODO: Save to database via API (Phase 2)
    // await fetch('/api/preferences', {
    //   method: 'POST',
    //   body: JSON.stringify({ currentTheme: themeId })
    // })
  }

  if (loading) {
    return (
      <div className={`${className}`}>
        <p className="text-sm text-text-muted">Loading themes...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`${className} space-y-4`}>
        <div className="surface p-6 rounded-lg border-2 border-red-500 bg-red-50 dark:bg-red-950">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-700 dark:text-red-300 mb-2">
                Error Loading Themes
              </h3>
              <p className="text-sm text-red-600 dark:text-red-400 mb-4">{error}</p>
              <button
                onClick={() => {
                  // Retry by resetting error state
                  // This triggers the component to re-render, and useEffect will run again
                  setError(null)
                  setLoading(true)
                  // Create a new AbortController for retry
                  const retryController = new AbortController()
                  loadThemes(retryController.signal)
                }}
                className="px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-2">Choose Theme</h3>
        <p className="text-sm text-text-muted mb-4">
          Select a color theme for your calendar. Each theme has its own light and dark mode.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => handleThemeSelect(theme.id)}
            className={`
              relative p-4 rounded-lg border-2 transition-all
              hover:shadow-lg hover:scale-105
              ${
                currentThemeId === theme.id
                  ? 'border-primary shadow-md'
                  : 'border-border hover:border-border-hover'
              }
            `}
          >
            {/* Selected indicator */}
            {currentThemeId === theme.id && (
              <div className="absolute top-2 right-2 bg-primary rounded-full p-1">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}

            {/* Theme preview */}
            <div className="space-y-3">
              {/* Theme name */}
              <div>
                <h4 className="font-semibold text-text-primary">{theme.name}</h4>
                <p className="text-xs text-text-muted mt-1">{theme.description}</p>
              </div>

              {/* Color preview */}
              <div className="flex gap-2">
                <div
                  className="w-8 h-8 rounded border border-border"
                  style={{ backgroundColor: theme.colors.primary }}
                  title="Primary"
                />
                <div
                  className="w-8 h-8 rounded border border-border"
                  style={{ backgroundColor: theme.colors.secondary }}
                  title="Secondary"
                />
                <div
                  className="w-8 h-8 rounded border border-border"
                  style={{ backgroundColor: theme.colors.accent }}
                  title="Accent"
                />
              </div>

              {/* Theme features */}
              <div className="text-xs text-text-muted space-y-1">
                {theme.effects?.shadows && <div>✓ Shadows enabled</div>}
                {theme.effects?.animations && <div>✓ Smooth animations</div>}
                {theme.patterns?.enabled && <div>✓ Decorative patterns</div>}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Current theme info */}
      <div className="mt-6 p-4 surface rounded-lg border border-border">
        <p className="text-sm text-text-secondary">
          <span className="font-semibold">Current theme:</span>{' '}
          {themes.find((t) => t.id === currentThemeId)?.name ?? 'Unknown'}
        </p>
        <p className="text-xs text-text-muted mt-1">
          Theme changes apply instantly. Use the 🌙/☀️ button in the header to toggle dark mode.
        </p>
      </div>
    </div>
  )
}
