/**
 * Theme Switcher Component
 * Dropdown to select and switch between themes
 */

'use client'

import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import { useThemes } from '../hooks/useThemes'
import { Button } from '@/shared/components/ui/Button'
import { Select } from '@/shared/components/ui/Select'

export function ThemeSwitcher() {
  const { currentTheme, isDark, switchTheme, toggleDarkMode, isSwitching } = useTheme()
  const { data: themes, loading: loadingThemes } = useThemes()
  const [error, setError] = useState<string | null>(null)

  const handleThemeChange = async (themeId: string) => {
    if (!themeId) return

    setError(null)

    try {
      await switchTheme(parseInt(themeId, 10))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to switch theme')
    }
  }

  if (loadingThemes) {
    return (
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">Theme</h3>
        <div className="text-sm text-muted-foreground">Loading themes...</div>
      </div>
    )
  }

  if (!themes || themes.length === 0) {
    return (
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">Theme</h3>
        <div className="text-sm text-muted-foreground">No themes available</div>
      </div>
    )
  }

  const themeOptions = themes.map((theme) => ({
    value: theme.id.toString(),
    label: theme.name
  }))

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-medium text-foreground mb-2">Appearance</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Choose a color theme for your calendar
        </p>
      </div>

      <Select
        label="Theme"
        value={currentTheme?.id.toString() || ''}
        onChange={(e) => handleThemeChange(e.target.value)}
        options={themeOptions}
        disabled={isSwitching}
      />

      <div
        role="button"
        tabIndex={0}
        onClick={toggleDarkMode}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            toggleDarkMode()
          }
        }}
        className="flex items-center justify-between p-4 border border-border rounded-lg bg-card cursor-pointer hover:bg-muted/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        aria-label={`Toggle dark mode. Currently ${isDark ? 'dark' : 'light'} mode`}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl" role="img" aria-label={isDark ? 'Moon' : 'Sun'}>
            {isDark ? '🌙' : '☀️'}
          </span>
          <div>
            <div className="text-sm font-medium text-foreground">
              {isDark ? 'Dark Mode' : 'Light Mode'}
            </div>
            <div className="text-xs text-muted-foreground">
              {isDark ? 'Easier on your eyes' : 'Bright and vibrant'}
            </div>
          </div>
        </div>
        <div
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            isDark ? 'bg-primary' : 'bg-muted'
          }`}
          aria-hidden="true"
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              isDark ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </div>
      </div>

      {isSwitching && (
        <div className="text-sm text-muted-foreground animate-pulse">
          Switching theme...
        </div>
      )}

      {error && (
        <div className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg p-3">
          {error}
        </div>
      )}

      {currentTheme && (
        <div className="mt-6 p-4 border border-border rounded-lg bg-card">
          <div className="text-sm font-medium text-foreground mb-3">
            Current Colors: {currentTheme.name} {isDark ? '(Dark)' : '(Light)'}
          </div>
          <div className="grid grid-cols-5 gap-2">
            {Object.entries(isDark && currentTheme.darkColors ? currentTheme.darkColors : currentTheme.colors).map(([key, value]) => (
              <div key={key} className="space-y-1">
                <div
                  className="h-10 rounded border border-border shadow-sm"
                  style={{ backgroundColor: `rgb(${value})` }}
                  title={key}
                />
                <div className="text-xs text-muted-foreground text-center truncate">
                  {key}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
