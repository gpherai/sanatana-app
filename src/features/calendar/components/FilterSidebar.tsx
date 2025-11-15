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
import { useCategories } from '@/features/categories/hooks/useCategories'

interface FilterSidebarProps {
  filters: EventFilters
  onFiltersChange: (filters: EventFilters) => void
  onClose?: () => void
}

export function FilterSidebar({ filters, onFiltersChange, onClose }: FilterSidebarProps) {
  const [searchQuery, setSearchQuery] = useState(filters.searchQuery || '')
  const { data: categories, loading: categoriesLoading } = useCategories()

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

  const handleCategoryToggle = (categoryId: number) => {
    const currentCategories = filters.categoryIds || []
    const newCategories = currentCategories.includes(categoryId)
      ? currentCategories.filter(id => id !== categoryId)
      : [...currentCategories, categoryId]

    onFiltersChange({
      ...filters,
      categoryIds: newCategories.length > 0 ? newCategories : undefined
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
          <h3 className="text-sm font-medium text-foreground mb-3">Categories</h3>
          {categoriesLoading ? (
            <div className="text-sm text-muted-foreground p-2">Loading categories...</div>
          ) : categories && categories.length > 0 ? (
            <div className="space-y-2">
              {categories.map((category) => {
                const isSelected = filters.categoryIds?.includes(category.id) || false
                return (
                  <label
                    key={category.id}
                    className="flex items-center gap-2 cursor-pointer hover:bg-muted p-2 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleCategoryToggle(category.id)}
                      className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                    />
                    <span className="text-xl">{category.icon}</span>
                    <span className="text-sm text-foreground">{category.name}</span>
                  </label>
                )
              })}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground p-2">No categories available</div>
          )}
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
