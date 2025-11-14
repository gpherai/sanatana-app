'use client'

import { useState, useEffect } from 'react'
import { Search, X, ChevronLeft, ChevronRight, Filter } from 'lucide-react'
import { EVENT_TYPES, RECURRENCE_TYPES } from '@/config/constants'

// Filter state interface
export interface FilterState {
  search: string
  categoryIds: number[]
  types: string[]
  recurrenceTypes: string[]
  hasLunarInfo: boolean
  hasTithi: boolean
  hasNakshatra: boolean
}

interface Category {
  id: number
  name: string
  icon: string | null
}

interface FilterSidebarProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  isOpen: boolean
  onToggle: () => void
}

export function FilterSidebar({ filters, onFiltersChange, isOpen, onToggle }: FilterSidebarProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [searchInput, setSearchInput] = useState(filters.search)

  // Fetch categories on mount
  useEffect(() => {
    const abortController = new AbortController()

    async function loadCategories() {
      try {
        const response = await fetch('/api/categories', {
          signal: abortController.signal,
        })
        const data = await response.json()

        if (data.success) {
          setCategories(data.data.categories)
        }
      } catch (error) {
        // Ignore abort errors
        if (error instanceof Error && error.name === 'AbortError') return
        console.error('Failed to load categories:', error)
      } finally {
        if (!abortController.signal.aborted) {
          setCategoriesLoading(false)
        }
      }
    }

    loadCategories()

    return () => abortController.abort()
  }, [])

  // Debounced search (300ms delay)
  // We intentionally omit 'filters' and 'onFiltersChange' from dependencies
  // to prevent re-triggering the debounce timer on every filter change
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) {
        onFiltersChange({ ...filters, search: searchInput })
      }
    }, 300)

    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput])

  // Toggle category
  const toggleCategory = (categoryId: number) => {
    const newCategoryIds = filters.categoryIds.includes(categoryId)
      ? filters.categoryIds.filter((id) => id !== categoryId)
      : [...filters.categoryIds, categoryId]

    onFiltersChange({ ...filters, categoryIds: newCategoryIds })
  }

  // Toggle event type
  const toggleEventType = (type: string) => {
    const newTypes = filters.types.includes(type)
      ? filters.types.filter((t) => t !== type)
      : [...filters.types, type]

    onFiltersChange({ ...filters, types: newTypes })
  }

  // Toggle recurrence type
  const toggleRecurrenceType = (type: string) => {
    const newRecurrenceTypes = filters.recurrenceTypes.includes(type)
      ? filters.recurrenceTypes.filter((t) => t !== type)
      : [...filters.recurrenceTypes, type]

    onFiltersChange({ ...filters, recurrenceTypes: newRecurrenceTypes })
  }

  // Count active filters
  const activeFilterCount =
    filters.categoryIds.length +
    filters.types.length +
    filters.recurrenceTypes.length +
    (filters.hasLunarInfo ? 1 : 0) +
    (filters.hasTithi ? 1 : 0) +
    (filters.hasNakshatra ? 1 : 0) +
    (filters.search ? 1 : 0)

  // Clear all filters
  const handleClearAll = () => {
    setSearchInput('')
    onFiltersChange({
      search: '',
      categoryIds: [],
      types: [],
      recurrenceTypes: [],
      hasLunarInfo: false,
      hasTithi: false,
      hasNakshatra: false,
    })
  }

  return (
    <>
      {/* Toggle Button (when closed) */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="fixed left-0 top-32 z-20 p-3 rounded-r-lg bg-primary text-white shadow-lg hover:bg-primary/90 transition-colors"
          title="Show filters"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-16 bottom-0 z-10 w-80 bg-surface border-r border-border
          transition-transform duration-300 ease-in-out overflow-y-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="p-4 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-text-primary">Filters</h2>
            </div>
            <button
              onClick={onToggle}
              className="p-1 rounded hover:bg-surface-hover transition-colors"
              title="Hide filters"
            >
              <ChevronLeft className="w-5 h-5 text-text-secondary" />
            </button>
          </div>

          {/* Active Filters Badge - Only reserves space when visible */}
          {activeFilterCount > 0 && (
            <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg border border-primary/20">
              <span className="text-sm font-medium text-text-primary">
                {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} active
              </span>
              <button
                onClick={handleClearAll}
                className="text-xs px-2 py-1 rounded bg-primary text-white hover:bg-primary/90 transition-colors"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Search Box */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary flex items-center gap-2">
              <Search className="w-4 h-4" />
              Search Events
            </label>
            <div className="relative">
              <input
                type="search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by name, description, tags..."
                className="w-full px-3 py-2 pr-8 rounded-lg border border-border bg-surface text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {searchInput && (
                <button
                  onClick={() => setSearchInput('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-surface-hover transition-colors"
                >
                  <X className="w-4 h-4 text-text-muted" />
                </button>
              )}
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-text-primary">Categories</h3>
            {categoriesLoading ? (
              <div className="space-y-1">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-8 bg-surface-hover animate-pulse rounded" />
                ))}
              </div>
            ) : (
              <div className="space-y-1">
                {categories.map((category) => (
                  <label
                    key={category.id}
                    className="flex items-center gap-2 py-1 px-2 rounded hover:bg-surface-hover cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={filters.categoryIds.includes(category.id)}
                      onChange={() => toggleCategory(category.id)}
                      className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary"
                    />
                    <span className="text-lg">{category.icon}</span>
                    <span className="text-sm text-text-primary">{category.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Event Types */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-text-primary">Event Types</h3>
            <div className="space-y-1">
              {EVENT_TYPES.map((type) => (
                <label
                  key={type.value}
                  className="flex items-center gap-2 py-1 px-2 rounded hover:bg-surface-hover cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={filters.types.includes(type.value)}
                    onChange={() => toggleEventType(type.value)}
                    className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary"
                  />
                  <span className="text-lg">{type.icon}</span>
                  <span className="text-sm text-text-primary">{type.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Recurrence Types */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-text-primary">Recurrence</h3>
            <div className="space-y-1">
              {RECURRENCE_TYPES.map((type) => (
                <label
                  key={type.value}
                  className="flex items-center gap-2 py-1 px-2 rounded hover:bg-surface-hover cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={filters.recurrenceTypes.includes(type.value)}
                    onChange={() => toggleRecurrenceType(type.value)}
                    className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary"
                  />
                  <span className="text-sm text-text-primary">{type.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Lunar Information */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-text-primary">Lunar Information</h3>
            <div className="space-y-1">
              <label className="flex items-center gap-2 py-1 px-2 rounded hover:bg-surface-hover cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={filters.hasLunarInfo}
                  onChange={(e) => onFiltersChange({ ...filters, hasLunarInfo: e.target.checked })}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary"
                />
                <span className="text-sm text-text-primary">Has Lunar Info</span>
              </label>

              <label className="flex items-center gap-2 py-1 px-2 rounded hover:bg-surface-hover cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={filters.hasTithi}
                  onChange={(e) => onFiltersChange({ ...filters, hasTithi: e.target.checked })}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary"
                />
                <span className="text-sm text-text-primary">Has Tithi</span>
              </label>

              <label className="flex items-center gap-2 py-1 px-2 rounded hover:bg-surface-hover cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={filters.hasNakshatra}
                  onChange={(e) => onFiltersChange({ ...filters, hasNakshatra: e.target.checked })}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary"
                />
                <span className="text-sm text-text-primary">Has Nakshatra</span>
              </label>
            </div>
          </div>

          {/* Reset Button */}
          <button
            onClick={handleClearAll}
            className="w-full px-4 py-2 rounded-lg border border-border bg-surface text-text-primary font-medium hover:bg-surface-hover transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      </aside>

      {/* Overlay (mobile) */}
      {isOpen && <div onClick={onToggle} className="fixed inset-0 bg-black/50 z-5 md:hidden" />}
    </>
  )
}
