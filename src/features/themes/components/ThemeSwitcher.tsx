/**
 * Theme Switcher Component
 * Dropdown to select and switch between themes with beautiful styling
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import { useTheme } from '../context/ThemeContext'
import { useThemes } from '../hooks/useThemes'

export function ThemeSwitcher() {
  const { currentTheme, isDark, switchTheme, toggleDarkMode, isSwitching } = useTheme()
  const { data: themes, loading: loadingThemes } = useThemes()
  const [error, setError] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [isOpen])

  const handleThemeChange = async (themeId: number) => {
    setError(null)
    setIsOpen(false)

    try {
      await switchTheme(themeId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to switch theme')
    }
  }

  if (loadingThemes) {
    return (
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-foreground">Theme</h3>
        <div className="text-sm text-muted-foreground">Loading themes...</div>
      </div>
    )
  }

  if (!themes || themes.length === 0) {
    return (
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-foreground">Theme</h3>
        <div className="text-sm text-muted-foreground">No themes available</div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-xl font-bold text-foreground mb-2">Appearance</h3>
        <p className="text-sm text-muted-foreground">
          Choose a color theme for your calendar
        </p>
      </div>

      {/* Custom Styled Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <label className="block text-sm font-medium text-foreground mb-2.5">
          Color Theme
        </label>
        <div className="relative">
          {/* Dropdown Button */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            disabled={isSwitching}
            className="w-full px-5 py-3.5 text-lg font-medium text-foreground bg-card border-2 border-border rounded-xl transition-all cursor-pointer text-left
              hover:border-primary/60 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
              disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between"
          >
            <span>{currentTheme?.name || 'Select a theme'}</span>
            <svg
              className={`h-6 w-6 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute z-50 w-full mt-2 bg-card border-2 border-border rounded-xl shadow-elegant overflow-hidden animate-scale-in">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => handleThemeChange(theme.id)}
                  disabled={isSwitching}
                  className={`w-full px-5 py-3.5 text-lg font-medium text-left transition-colors
                    ${currentTheme?.id === theme.id
                      ? 'bg-primary text-white'
                      : 'text-foreground hover:bg-muted'
                    }
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                >
                  {theme.name}
                  {currentTheme?.id === theme.id && (
                    <span className="ml-2">✓</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Dark Mode Toggle */}
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
        className="flex items-center justify-between p-4 border-2 border-border rounded-xl bg-card cursor-pointer hover:border-primary/60 hover:shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        aria-label={`Toggle dark mode. Currently ${isDark ? 'dark' : 'light'} mode`}
      >
        <div className="flex items-center gap-4">
          <span className="text-3xl" role="img" aria-label={isDark ? 'Moon' : 'Sun'}>
            {isDark ? '🌙' : '☀️'}
          </span>
          <div>
            <div className="text-base font-bold text-foreground">
              {isDark ? 'Dark Mode' : 'Light Mode'}
            </div>
            <div className="text-sm text-muted-foreground">
              {isDark ? 'Easier on your eyes' : 'Bright and vibrant'}
            </div>
          </div>
        </div>
        <div
          className={`relative inline-flex h-7 w-13 items-center rounded-full transition-colors ${
            isDark ? 'bg-primary' : 'bg-border'
          }`}
          aria-hidden="true"
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform ${
              isDark ? 'translate-x-7' : 'translate-x-1'
            }`}
          />
        </div>
      </div>

      {isSwitching && (
        <div className="text-sm text-primary animate-pulse font-semibold">
          Switching theme...
        </div>
      )}

      {error && (
        <div className="text-sm text-red-600 font-medium bg-red-50 dark:bg-red-950/30 border-2 border-red-200 dark:border-red-800 rounded-xl p-4">
          {error}
        </div>
      )}

      {/* Color Preview */}
      {currentTheme && (
        <div className="mt-2 p-5 border-2 border-border rounded-xl bg-card/50">
          <div className="text-sm font-bold text-foreground mb-4">
            Preview: {currentTheme.name} {isDark ? '(Dark)' : '(Light)'}
          </div>
          <div className="grid grid-cols-5 gap-3">
            {Object.entries(isDark && currentTheme.darkColors ? currentTheme.darkColors : currentTheme.colors).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <div
                  className="h-14 rounded-lg border-2 border-border shadow-sm hover:scale-105 transition-transform cursor-pointer"
                  style={{ backgroundColor: `rgb(${value})` }}
                  title={`${key}: rgb(${value})`}
                />
                <div className="text-xs text-muted-foreground text-center truncate font-semibold">
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
