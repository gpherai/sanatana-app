'use client'

import { useState, useEffect, FormEvent } from 'react'
import { Calendar, Bell, Save } from 'lucide-react'
import { CALENDAR_VIEWS, WEEK_START_OPTIONS, TIMEZONES } from '@/config/constants'
import type { UserPreference } from '@/types/theme'
import { useToast } from '@/contexts/ToastContext'

interface PreferencesFormProps {
  onSuccess?: (preferences: UserPreference) => void
}

export function PreferencesForm({ onSuccess }: PreferencesFormProps) {
  const { showToast } = useToast()
  // Form state - initialized with defaults
  const [formData, setFormData] = useState({
    defaultView: 'month' as const,
    weekStartsOn: 0,
    timezone: 'Europe/Amsterdam',
    notificationsEnabled: false,
    notificationDaysBefore: 1,
  })

  // UI state
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [generalError, setGeneralError] = useState('')

  // Fetch existing preferences on mount
  useEffect(() => {
    const abortController = new AbortController()

    async function fetchPreferences() {
      try {
        const response = await fetch('/api/preferences', {
          signal: abortController.signal,
        })
        const result = await response.json()

        if (result.success) {
          const prefs = result.data.preferences
          setFormData({
            defaultView: prefs.defaultView,
            weekStartsOn: prefs.weekStartsOn,
            timezone: prefs.timezone,
            notificationsEnabled: prefs.notificationsEnabled,
            notificationDaysBefore: prefs.notificationDaysBefore,
          })
        } else {
          setGeneralError('Failed to load preferences')
        }
      } catch (error) {
        // Ignore abort errors
        if (error instanceof Error && error.name === 'AbortError') return
        setGeneralError('Failed to load preferences')
        console.error('Error fetching preferences:', error)
      } finally {
        if (!abortController.signal.aborted) {
          setInitialLoading(false)
        }
      }
    }

    fetchPreferences()

    return () => abortController.abort()
  }, [])

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target

    let processedValue: string | number | boolean | undefined = value

    // Convert numeric fields
    if (name === 'weekStartsOn' || name === 'notificationDaysBefore') {
      processedValue = parseInt(value, 10)
    }
    // Handle checkbox
    else if (type === 'checkbox') {
      processedValue = (e.target as HTMLInputElement).checked
    }

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }))

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  // Form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})
    setGeneralError('')

    try {
      // Prepare data for API
      const dataToSave = {
        defaultView: formData.defaultView,
        weekStartsOn: formData.weekStartsOn,
        timezone: formData.timezone,
        notificationsEnabled: formData.notificationsEnabled,
        notificationDaysBefore: formData.notificationDaysBefore,
      }

      const response = await fetch('/api/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSave),
      })

      const result = await response.json()

      if (result.success) {
        showToast('Preferences saved successfully!', 'success', 3000)

        // Call parent success handler
        onSuccess?.(result.data.preferences)
      } else {
        setGeneralError(result.message || 'Failed to save preferences')
      }
    } catch (error) {
      setGeneralError('An unexpected error occurred')
      console.error('Form submission error:', error)
    } finally {
      setLoading(false)
    }
  }

  // Loading skeleton
  if (initialLoading) {
    return (
      <div className="space-y-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="surface p-6 rounded-lg border border-border">
            <div className="h-6 bg-surface-hover rounded w-1/3 mb-4 animate-pulse" />
            <div className="space-y-3">
              <div className="h-10 bg-surface-hover rounded animate-pulse" />
              <div className="h-10 bg-surface-hover rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* General Error */}
      {generalError && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-600">
          {generalError}
        </div>
      )}

      {/* Calendar Preferences */}
      <section className="surface p-6 rounded-lg border border-border">
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold text-text-primary">Calendar Preferences</h2>
        </div>

        <div className="space-y-4">
          {/* Default View */}
          <div>
            <label
              htmlFor="defaultView"
              className="block text-sm font-medium text-text-primary mb-1"
            >
              Default View
            </label>
            <select
              id="defaultView"
              name="defaultView"
              value={formData.defaultView}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {CALENDAR_VIEWS.map((view) => (
                <option key={view} value={view}>
                  {view.charAt(0).toUpperCase() + view.slice(1)}
                </option>
              ))}
            </select>
            {errors.defaultView && (
              <p className="text-sm text-red-500 mt-1">{errors.defaultView}</p>
            )}
          </div>

          {/* Week Starts On */}
          <div>
            <label
              htmlFor="weekStartsOn"
              className="block text-sm font-medium text-text-primary mb-1"
            >
              Week Starts On
            </label>
            <select
              id="weekStartsOn"
              name="weekStartsOn"
              value={formData.weekStartsOn}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {WEEK_START_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.weekStartsOn && (
              <p className="text-sm text-red-500 mt-1">{errors.weekStartsOn}</p>
            )}
          </div>

          {/* Timezone */}
          <div>
            <label htmlFor="timezone" className="block text-sm font-medium text-text-primary mb-1">
              Timezone
            </label>
            <select
              id="timezone"
              name="timezone"
              value={formData.timezone}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {TIMEZONES.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </select>
            {errors.timezone && <p className="text-sm text-red-500 mt-1">{errors.timezone}</p>}
          </div>
        </div>
      </section>

      {/* Notification Settings */}
      <section className="surface p-6 rounded-lg border border-border">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold text-text-primary">Notification Settings</h2>
        </div>

        <div className="space-y-4">
          {/* Enable Notifications */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="notificationsEnabled"
              name="notificationsEnabled"
              checked={formData.notificationsEnabled}
              onChange={handleChange}
              className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary"
            />
            <label htmlFor="notificationsEnabled" className="text-sm font-medium text-text-primary">
              Enable event notifications
            </label>
          </div>

          {/* Days Before */}
          {formData.notificationsEnabled && (
            <div>
              <label
                htmlFor="notificationDaysBefore"
                className="block text-sm font-medium text-text-primary mb-1"
              >
                Remind me (days before)
              </label>
              <input
                type="number"
                id="notificationDaysBefore"
                name="notificationDaysBefore"
                value={formData.notificationDaysBefore}
                onChange={handleChange}
                min="0"
                max="30"
                className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.notificationDaysBefore && (
                <p className="text-sm text-red-500 mt-1">{errors.notificationDaysBefore}</p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Save className="w-5 h-5" />
          {loading ? 'Saving...' : 'Save Preferences'}
        </button>
      </div>
    </form>
  )
}
