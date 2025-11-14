/**
 * Filter Sidebar Component
 * Sidebar for filtering calendar events
 */

'use client'

import { useState } from 'react'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { EVENT_TYPES, EventType } from '@/core/config/constants'
import { EventFilters } from '@/features/events/types/event.types'
import { useDebounce } from '@/shared/hooks'

interface FilterSidebarProps {
  filters: EventFilters
  onFiltersChange: (filters: EventFilters) => void
  onClose?: () => void
}

export function FilterSidebar({ filters, onFiltersChange, onClose }: FilterSidebarProps) {
  const [searchQuery, setSearchQuery] = useState(filters.searchQuery || '')
  const debouncedSearch = useDebounce(searchQuery, 300)

  const handleEventTypeToggle = (eventType: EventType) => {
    const currentTypes = filters.eventTypes || []
    const newTypes = currentTypes.includes(eventType)
      ? currentTypes.filter(t => t !== eventType)
      : [...currentTypes, eventType]

    onFiltersChange({
      ...filters,
      eventTypes: newTypes.length > 0 ? newTypes : undefined
    })
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    onFiltersChange({
      ...filters,
      searchQuery: value || undefined
    })
  }

  const handleClearFilters = () => {
    setSearchQuery('')
    onFiltersChange({})
  }

  const activeFiltersCount = [
    filters.eventTypes?.length ?? 0,
    filters.categoryIds?.length ?? 0,
    filters.searchQuery ? 1 : 0,
    filters.isRecurring !== undefined ? 1 : 0
  ].reduce((sum, count) => sum + count, 0)

  return (
    <div className="h-full flex flex-col bg-background border-r border-border">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filters</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden text-muted-foreground hover:text-foreground"
            aria-label="Close filters"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div>
          <Input
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            leftIcon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
          />
        </div>

        <div>
          <h3 className="text-sm font-medium text-foreground mb-3">Event Types</h3>
          <div className="space-y-2">
            {EVENT_TYPES.map((type) => {
              const isSelected = filters.eventTypes?.includes(type.value) || false
              return (
                <label
                  key={type.value}
                  className="flex items-center gap-2 cursor-pointer hover:bg-muted p-2 rounded"
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleEventTypeToggle(type.value)}
                    className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                  />
                  <span className="text-xl">{type.icon}</span>
                  <span className="text-sm text-foreground">{type.label}</span>
                </label>
              )
            })}
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 cursor-pointer hover:bg-muted p-2 rounded">
            <input
              type="checkbox"
              checked={filters.isRecurring === true}
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  isRecurring: e.target.checked ? true : undefined
                })
              }
              className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
            />
            <span className="text-sm text-foreground">Recurring events only</span>
          </label>
        </div>
      </div>

      <div className="p-4 border-t border-border">
        <Button
          variant="outline"
          onClick={handleClearFilters}
          disabled={activeFiltersCount === 0}
          className="w-full"
        >
          Clear Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
        </Button>
      </div>
    </div>
  )
}
