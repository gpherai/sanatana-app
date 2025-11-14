'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Moon, Sun, Palette } from 'lucide-react'
import { toggleDarkMode, isDarkMode } from '@/lib/theme-manager'

export function Header() {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Initialize on mount
  useEffect(() => {
    setMounted(true)
    setIsDark(isDarkMode())
  }, [])

  // Toggle dark mode (works with any theme)
  const handleToggleDarkMode = () => {
    const newDarkState = toggleDarkMode()
    setIsDark(newDarkState)
  }

  // Prevent flash of wrong theme - render placeholder to avoid layout shift
  if (!mounted) {
    return (
      <header className="border-b border-border bg-surface">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Placeholder during SSR - prevents layout shift */}
            <div className="flex items-center gap-3">
              <span className="text-3xl">🕉️</span>
              <div>
                <div className="h-6 w-32 bg-surface-hover rounded" />
                <div className="h-3 w-24 bg-surface-hover rounded mt-1" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-surface-hover rounded-lg" />
              <div className="h-10 w-10 bg-surface-hover rounded-lg" />
            </div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="border-b border-border bg-surface">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo & Title */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <span className="text-3xl">🕉️</span>
            <div>
              <h1 className="text-xl font-bold text-primary">Dharma Calendar</h1>
              <p className="text-xs text-text-muted">Spiritual Companion</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/calendar"
              className="text-text-primary hover:text-primary transition-colors"
            >
              Calendar
            </Link>
            <Link href="/events" className="text-text-primary hover:text-primary transition-colors">
              Events
            </Link>
            <Link
              href="/settings"
              className="text-text-primary hover:text-primary transition-colors"
            >
              Settings
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={handleToggleDarkMode}
              className="p-2 rounded-lg surface-hover border border-border transition-colors"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle dark mode"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-primary" />
              ) : (
                <Moon className="w-5 h-5 text-primary" />
              )}
            </button>

            {/* Theme Switcher */}
            <Link
              href="/settings"
              className="p-2 rounded-lg surface-hover border border-border transition-colors"
              title="Change Theme"
            >
              <Palette className="w-5 h-5 text-text-secondary" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
