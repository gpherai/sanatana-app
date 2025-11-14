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
  const { currentTheme, switchTheme, isSwitching } = useTheme()
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
            Current Theme: {currentTheme.name}
          </div>
          <div className="grid grid-cols-5 gap-2">
            {Object.entries(currentTheme.colors).map(([key, value]) => (
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
