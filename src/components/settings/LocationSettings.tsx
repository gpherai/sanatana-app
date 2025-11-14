'use client'

import { useState, useEffect, useCallback } from 'react'
import { MapPin, Home, Navigation, Trash2, X, Plus, Loader2 } from 'lucide-react'
import { NL_CITIES } from '@/config/constants'
import { useToast } from '@/contexts/ToastContext'

interface SavedLocation {
  id: number
  name: string
  lat: number
  lon: number
  isPrimary: boolean
  _count?: {
    dailyAstronomy: number
  }
}

interface UserPreferences {
  activeLocationId: number | null
  tempLocationName: string | null
  tempLocationLat: number | null
  tempLocationLon: number | null
}

export function LocationSettings() {
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>([])
  const [preferences, setPreferences] = useState<UserPreferences | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  // Form states
  const [newLocationName, setNewLocationName] = useState('')
  const [newLocationLat, setNewLocationLat] = useState('')
  const [newLocationLon, setNewLocationLon] = useState('')
  const [selectedCity, setSelectedCity] = useState('')

  const { showToast } = useToast()

  // Load saved locations and preferences
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true)
      const [locationsRes, prefsRes] = await Promise.all([
        fetch('/api/saved-locations'),
        fetch('/api/preferences'),
      ])

      const locationsData = await locationsRes.json()
      const prefsData = await prefsRes.json()

      if (locationsData.success) {
        setSavedLocations(locationsData.data.locations)
      }

      if (prefsData.success) {
        setPreferences(prefsData.data.preferences)
      }
    } catch {
      showToast('Failed to load locations', 'error')
    } finally {
      setIsLoading(false)
    }
  }, [showToast])

  useEffect(() => {
    loadData()
  }, [loadData])

  // GPS: Use current location
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser', 'error')
      return
    }

    showToast('Requesting location permission...', 'info', 3000)

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const res = await fetch('/api/preferences/temp-location', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: 'GPS Location',
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            }),
          })

          const data = await res.json()

          if (data.success) {
            showToast('Using your current location!', 'success')
            await loadData()
            // Reload page to update calendar
            window.location.reload()
          }
        } catch {
          showToast('Failed to set temporary location', 'error')
        }
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          showToast('Location permission denied', 'error')
        } else {
          showToast('Failed to get location', 'error')
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    )
  }

  // City dropdown: Set temporary location
  const handleCitySelect = async () => {
    if (!selectedCity) return

    const city = NL_CITIES.find((c) => c.name === selectedCity)
    if (!city) return

    try {
      const res = await fetch('/api/preferences/temp-location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: city.name,
          lat: city.lat,
          lon: city.lon,
        }),
      })

      const data = await res.json()

      if (data.success) {
        showToast(`Using ${city.name} location!`, 'success')
        await loadData()
        setSelectedCity('')
        // Reload page to update calendar
        window.location.reload()
      }
    } catch {
      showToast('Failed to set city location', 'error')
    }
  }

  // Clear temporary location
  const handleClearTempLocation = async () => {
    try {
      const res = await fetch('/api/preferences/temp-location', {
        method: 'DELETE',
      })

      const data = await res.json()

      if (data.success) {
        showToast('Temporary location cleared', 'success')
        await loadData()
        // Reload page to update calendar
        window.location.reload()
      }
    } catch {
      showToast('Failed to clear temporary location', 'error')
    }
  }

  // Set active location (saved)
  const handleSetActive = async (id: number) => {
    try {
      const res = await fetch(`/api/saved-locations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ setActive: true }),
      })

      const data = await res.json()

      if (data.success) {
        showToast(data.message, 'success')
        await loadData()
        // Reload page to update calendar
        window.location.reload()
      }
    } catch {
      showToast('Failed to set active location', 'error')
    }
  }

  // Delete saved location
  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete "${name}"? This will remove all astronomy data for this location.`)) {
      return
    }

    try {
      const res = await fetch(`/api/saved-locations/${id}`, {
        method: 'DELETE',
      })

      const data = await res.json()

      if (data.success) {
        showToast(data.message, 'success')
        await loadData()
      } else {
        showToast(data.message, 'error')
      }
    } catch {
      showToast('Failed to delete location', 'error')
    }
  }

  // Add new saved location
  const handleAddLocation = async () => {
    if (!newLocationName || !newLocationLat || !newLocationLon) {
      showToast('Please fill in all fields', 'error')
      return
    }

    try {
      setIsGenerating(true)
      showToast('Generating astronomy data... (~10 seconds)', 'info', 15000)

      const res = await fetch('/api/saved-locations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newLocationName,
          lat: parseFloat(newLocationLat),
          lon: parseFloat(newLocationLon),
          isPrimary: false,
        }),
      })

      const data = await res.json()

      if (data.success) {
        showToast(data.message, 'success')
        setNewLocationName('')
        setNewLocationLat('')
        setNewLocationLon('')
        setIsAdding(false)
        await loadData()
      } else {
        showToast(data.message, 'error')
      }
    } catch {
      showToast('Failed to add location', 'error')
    } finally {
      setIsGenerating(false)
    }
  }

  // Get active location
  const activeLocation = preferences?.tempLocationLat
    ? null // Temp location active
    : savedLocations.find((loc) => loc.id === preferences?.activeLocationId)

  if (isLoading) {
    return (
      <section className="surface p-6 rounded-lg border border-border">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        </div>
      </section>
    )
  }

  return (
    <section className="surface p-6 rounded-lg border border-border">
      <div className="flex items-center gap-3 mb-6">
        <MapPin className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-semibold text-text-primary">Location Settings</h2>
      </div>

      <div className="space-y-6">
        {/* Saved Locations */}
        <div>
          <h3 className="text-sm font-semibold text-text-primary mb-3">Saved Locations</h3>

          <div className="space-y-2">
            {savedLocations.map((location) => (
              <div
                key={location.id}
                className={`p-4 rounded-lg border transition-colors ${
                  location.id === preferences?.activeLocationId && !preferences.tempLocationLat
                    ? 'border-primary bg-primary/5'
                    : 'border-border surface-hover'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Home className="w-4 h-4 text-text-secondary" />
                      <span className="font-medium text-text-primary">{location.name}</span>
                      {location.id === preferences?.activeLocationId &&
                        !preferences.tempLocationLat && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-primary text-white">
                            ACTIVE
                          </span>
                        )}
                    </div>
                    <div className="mt-1 text-sm text-text-secondary">
                      {location.lat.toFixed(6)}°N, {location.lon.toFixed(6)}°E
                    </div>
                    {location._count && (
                      <div className="mt-1 text-xs text-text-muted">
                        {location._count.dailyAstronomy} astronomy entries
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {location.id !== preferences?.activeLocationId && (
                      <button
                        onClick={() => handleSetActive(location.id)}
                        className="px-3 py-1 text-sm rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
                        title="Set as active location"
                      >
                        Use
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(location.id, location.name)}
                      className="p-2 rounded-lg surface-hover border border-border text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      title="Delete location"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add New Location */}
          {!isAdding ? (
            <button
              onClick={() => setIsAdding(true)}
              className="mt-3 w-full p-3 rounded-lg border-2 border-dashed border-border surface-hover text-text-secondary hover:text-primary hover:border-primary transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add New Saved Location
            </button>
          ) : (
            <div className="mt-3 p-4 rounded-lg border border-border space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-text-primary">New Location</h4>
                <button
                  onClick={() => {
                    setIsAdding(false)
                    setNewLocationName('')
                    setNewLocationLat('')
                    setNewLocationLon('')
                  }}
                  className="text-text-muted hover:text-text-primary"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Name (e.g., Oma's Huis)"
                  value={newLocationName}
                  onChange={(e) => setNewLocationName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border surface text-text-primary"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    step="0.000001"
                    placeholder="Latitude"
                    value={newLocationLat}
                    onChange={(e) => setNewLocationLat(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-border surface text-text-primary"
                  />
                  <input
                    type="number"
                    step="0.000001"
                    placeholder="Longitude"
                    value={newLocationLon}
                    onChange={(e) => setNewLocationLon(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-border surface text-text-primary"
                  />
                </div>
              </div>

              <button
                onClick={handleAddLocation}
                disabled={isGenerating}
                className="w-full px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating Data...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Add Location (~10 sec)
                  </>
                )}
              </button>

              <p className="text-xs text-text-muted">
                Will generate ~800 astronomy entries for 2025-2027
              </p>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Temporary Location */}
        <div>
          <h3 className="text-sm font-semibold text-text-primary mb-3">
            Temporary Location (For Travel)
          </h3>

          {preferences?.tempLocationLat ? (
            // Active temporary location
            <div className="p-4 rounded-lg border border-primary bg-primary/5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-primary" />
                    <span className="font-medium text-text-primary">
                      {preferences.tempLocationName || 'GPS Location'}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary text-white">
                      ACTIVE
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-text-secondary">
                    {preferences.tempLocationLat.toFixed(6)}°N,{' '}
                    {preferences.tempLocationLon?.toFixed(6) ?? '0.000000'}°E
                  </div>
                  <div className="mt-1 text-xs text-text-muted">
                    Calculated on-the-fly (no database entries)
                  </div>
                </div>

                <button
                  onClick={handleClearTempLocation}
                  className="px-3 py-1 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
          ) : (
            // Set temporary location
            <div className="space-y-3">
              <button
                onClick={handleUseCurrentLocation}
                className="w-full px-4 py-3 rounded-lg border border-border surface-hover text-text-primary hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
              >
                <Navigation className="w-5 h-5" />
                Use My Current Location (GPS)
              </button>

              <div className="text-center text-sm text-text-muted">OR</div>

              <div className="flex gap-2">
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border border-border surface text-text-primary"
                >
                  <option value="">Select a city...</option>
                  {NL_CITIES.map((city) => (
                    <option key={city.name} value={city.name}>
                      {city.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleCitySelect}
                  disabled={!selectedCity}
                  className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Use
                </button>
              </div>

              <p className="text-xs text-text-muted">
                Temporary locations are calculated in real-time and don&apos;t require database
                entries. Clear the temporary location to return to your saved location.
              </p>
            </div>
          )}
        </div>

        {/* Current Active Location Display */}
        <div className="p-3 rounded-lg bg-surface-hover border border-border">
          <div className="text-sm font-medium text-text-secondary mb-1">Currently Using:</div>
          <div className="text-lg font-semibold text-primary">
            {preferences?.tempLocationLat
              ? `${preferences.tempLocationName || 'GPS Location'} (Temporary)`
              : activeLocation?.name || 'No location set'}
          </div>
        </div>
      </div>
    </section>
  )
}
