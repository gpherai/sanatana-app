'use client'

import { useState, useEffect, FormEvent } from 'react'
import { X, Plus, Calendar, Clock, Tag as TagIcon, Moon } from 'lucide-react'
import { eventFormCreateSchema, eventFormUpdateSchema } from '@/lib/validations'
import { EVENT_TYPES, RECURRENCE_TYPES, NAKSHATRAS, HINDU_MONTHS } from '@/config/constants'
import { ZodError, type ZodIssue } from 'zod'
import type { Event, EventOccurrence, EventType, RecurrenceType } from '@/types/event'

interface EventFormProps {
  mode: 'create' | 'edit'
  initialData?: Event & { occurrences: EventOccurrence[] }
  prefilledData?: Partial<{
    date: string
    name: string
    type: string
  }>
  onSuccess?: (event: Event) => void
  onCancel?: () => void
}

interface Category {
  id: number
  name: string
  description: string | null
  icon: string | null
}

export function EventForm({
  mode,
  initialData,
  prefilledData,
  onSuccess,
  onCancel,
}: EventFormProps) {
  // Get initial form defaults with optional prefilled data
  const getInitialFormData = () => ({
    name: prefilledData?.name || '',
    description: '',
    type: (prefilledData?.type as EventType) || ('FESTIVAL' as const),
    categoryId: undefined as number | undefined,
    date: prefilledData?.date || '',
    startTime: '',
    endTime: '',
    isRecurring: true,
    recurrenceType: 'LUNAR' as const,
    tithi: '',
    nakshatra: '',
    paksha: undefined as 'Shukla' | 'Krishna' | undefined,
    maas: '',
  })

  // Form state - initialize once with getInitialFormData, useEffect will NOT reset in create mode
  const [formData, setFormData] = useState(getInitialFormData())

  // Tags state (fancy chips) - always start empty, useEffect will populate from initialData
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')

  // Categories state
  const [categories, setCategories] = useState<Category[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)

  // UI state
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [generalError, setGeneralError] = useState('')

  // Update form with server response (for edit mode after save)
  const updateFormWithServerData = (event: Event & { occurrences: EventOccurrence[] }) => {
    setFormData({
      name: event.name,
      description: event.description ?? '',
      type: event.type as EventType,
      categoryId: event.categoryId ?? undefined,
      date: event.occurrences?.[0]?.date
        ? new Date(event.occurrences[0].date).toISOString().split('T')[0]
        : '',
      startTime: event.occurrences?.[0]?.startTime ?? '',
      endTime: event.occurrences?.[0]?.endTime ?? '',
      isRecurring: event.isRecurring,
      recurrenceType: event.recurrenceType as RecurrenceType,
      tithi: event.occurrences?.[0]?.tithi ?? '',
      nakshatra: event.occurrences?.[0]?.nakshatra ?? '',
      paksha: (event.occurrences?.[0]?.paksha as 'Shukla' | 'Krishna' | undefined) ?? undefined,
      maas: event.occurrences?.[0]?.maas ?? '',
    })
    setTags(event.tags ?? [])
    setErrors({})
    setGeneralError('')
  }

  // Fetch categories on mount
  useEffect(() => {
    const abortController = new AbortController()

    async function fetchCategories() {
      try {
        const response = await fetch('/api/categories', {
          signal: abortController.signal,
        })
        const result = await response.json()

        if (result.success) {
          setCategories(result.data.categories)
        } else {
          setGeneralError('Failed to load categories')
        }
      } catch (error) {
        // Ignore abort errors (component unmounted)
        if (error instanceof Error && error.name === 'AbortError') {
          return
        }
        setGeneralError('Failed to load categories')
        console.error('Error fetching categories:', error)
      } finally {
        // Only update loading state if not aborted
        if (!abortController.signal.aborted) {
          setCategoriesLoading(false)
        }
      }
    }

    fetchCategories()

    // Cleanup: abort fetch on unmount
    return () => abortController.abort()
  }, [])

  // Update form when initialData changes (for edit mode)
  // Only resets in create mode if prefilledData actually changes
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      updateFormWithServerData(initialData)
    }
    // Note: We don't reset in create mode here because initial state
    // is already set correctly via useState(getInitialFormData())
  }, [initialData, mode])

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target

    let processedValue: string | number | boolean | undefined = value

    // Convert categoryId to number (undefined if empty)
    if (name === 'categoryId') {
      processedValue = value === '' ? undefined : parseInt(value, 10)
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

  // Tag management
  const addTag = () => {
    const trimmedTag = tagInput.trim()
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags((prev) => [...prev, trimmedTag])
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove))
  }

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  // Transform form data for validation
  const transformFormDataForValidation = () => {
    return {
      name: formData.name,
      description: formData.description || undefined, // Empty string → undefined
      type: formData.type,
      categoryId: formData.categoryId, // Already undefined or number from handleChange
      isRecurring: formData.isRecurring,
      recurrenceType: formData.recurrenceType,
      importance: 5, // Default importance (field removed from form)
      tags: tags.length > 0 ? tags : undefined, // Empty array → undefined
      date: formData.date,
      startTime: formData.startTime || undefined, // Empty string → undefined
      endTime: formData.endTime || undefined, // Empty string → undefined
      tithi: formData.tithi || undefined, // Empty string → undefined
      nakshatra: formData.nakshatra || undefined, // Empty string → undefined
      paksha: formData.paksha || undefined, // Empty string → undefined
      maas: formData.maas || undefined, // Empty string → undefined
    }
  }

  // Form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})
    setGeneralError('')

    try {
      // Prepare data for validation
      const dataToValidate = transformFormDataForValidation()

      // Validate with appropriate schema
      const schema = mode === 'create' ? eventFormCreateSchema : eventFormUpdateSchema
      const validatedData = schema.parse(dataToValidate)

      // Make API call
      const url = mode === 'create' ? '/api/events' : `/api/events/${initialData?.id}`

      const method = mode === 'create' ? 'POST' : 'PUT'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validatedData),
      })

      const result = await response.json()

      if (result.success) {
        // For edit mode: update form with server response
        // This ensures form shows the saved data
        if (mode === 'edit') {
          updateFormWithServerData(result.data.event)
        }
        // For create mode: optionally reset form (currently we redirect, but useful for "add another" feature)
        // Note: Commented out because we redirect to calendar, but available for future use
        // else {
        //   resetForm()
        // }

        // Call parent success handler
        onSuccess?.(result.data.event)
      } else {
        setGeneralError(result.message || 'Failed to save event')
      }
    } catch (error) {
      if (error instanceof ZodError) {
        // Map Zod errors to form fields
        const fieldErrors: Record<string, string> = {}
        error.issues.forEach((err: ZodIssue) => {
          const field = err.path[0] as string
          fieldErrors[field] = err.message
        })
        setErrors(fieldErrors)
      } else {
        setGeneralError('An unexpected error occurred')
        console.error('Form submission error:', error)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* General Error */}
      {generalError && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-600">
          {generalError}
        </div>
      )}

      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Basic Information
        </h3>

        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-1">
            Event Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="e.g., Ganesh Chaturthi"
            required
          />
          {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-text-primary mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            placeholder="Event description..."
          />
          {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
        </div>

        {/* Category & Type Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Category */}
          <div>
            <label
              htmlFor="categoryId"
              className="block text-sm font-medium text-text-primary mb-1"
            >
              Category
            </label>
            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId ?? ''}
              onChange={handleChange}
              disabled={categoriesLoading}
              className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select a category (optional)</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && <p className="text-sm text-red-500 mt-1">{errors.categoryId}</p>}
          </div>

          {/* Type */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-text-primary mb-1">
              Event Type <span className="text-red-500">*</span>
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
              required
            >
              {EVENT_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.icon} {type.label}
                </option>
              ))}
            </select>
            {errors.type && <p className="text-sm text-red-500 mt-1">{errors.type}</p>}
          </div>
        </div>
      </div>

      {/* Date & Time */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          Date & Time
        </h3>

        {/* Date */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-text-primary mb-1">
            Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
          {errors.date && <p className="text-sm text-red-500 mt-1">{errors.date}</p>}
        </div>

        {/* Start & End Time Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startTime" className="block text-sm font-medium text-text-primary mb-1">
              Start Time
            </label>
            <input
              type="time"
              id="startTime"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.startTime && <p className="text-sm text-red-500 mt-1">{errors.startTime}</p>}
          </div>

          <div>
            <label htmlFor="endTime" className="block text-sm font-medium text-text-primary mb-1">
              End Time
            </label>
            <input
              type="time"
              id="endTime"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.endTime && <p className="text-sm text-red-500 mt-1">{errors.endTime}</p>}
          </div>
        </div>
      </div>

      {/* Recurrence */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-text-primary">Recurrence</h3>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isRecurring"
            name="isRecurring"
            checked={formData.isRecurring}
            onChange={handleChange}
            className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary"
          />
          <label htmlFor="isRecurring" className="text-sm font-medium text-text-primary">
            This is a recurring event
          </label>
        </div>

        {formData.isRecurring && (
          <div>
            <label
              htmlFor="recurrenceType"
              className="block text-sm font-medium text-text-primary mb-1"
            >
              Recurrence Type
            </label>
            <select
              id="recurrenceType"
              name="recurrenceType"
              value={formData.recurrenceType}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {RECURRENCE_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            {errors.recurrenceType && (
              <p className="text-sm text-red-500 mt-1">{errors.recurrenceType}</p>
            )}
          </div>
        )}
      </div>

      {/* Tags */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
          <TagIcon className="w-5 h-5 text-primary" />
          Tags
        </h3>

        {/* Tag Input with Add Button */}
        <div className="flex gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            placeholder="Add a tag..."
            className="flex-1 px-3 py-2 rounded-lg border border-border bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="button"
            onClick={addTag}
            className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>

        {/* Tag Chips */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <div
                key={index}
                className="px-3 py-1 rounded-full bg-surface-hover border border-border text-text-primary flex items-center gap-2"
              >
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="hover:text-red-500 transition-colors"
                  aria-label={`Remove tag ${tag}`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lunar Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
          <Moon className="w-5 h-5 text-primary" />
          Lunar Information <span className="text-sm font-normal text-text-muted">(Optional)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Tithi */}
          <div>
            <label htmlFor="tithi" className="block text-sm font-medium text-text-primary mb-1">
              Tithi
            </label>
            <select
              id="tithi"
              name="tithi"
              value={formData.tithi}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select Tithi (optional)</option>
              <optgroup label="Shukla Paksha (Waxing)">
                <option value="Pratipada">Pratipada</option>
                <option value="Dwitiya">Dwitiya</option>
                <option value="Tritiya">Tritiya</option>
                <option value="Chaturthi">Chaturthi</option>
                <option value="Panchami">Panchami</option>
                <option value="Shashthi">Shashthi</option>
                <option value="Saptami">Saptami</option>
                <option value="Ashtami">Ashtami</option>
                <option value="Navami">Navami</option>
                <option value="Dashami">Dashami</option>
                <option value="Ekadashi">Ekadashi</option>
                <option value="Dwadashi">Dwadashi</option>
                <option value="Trayodashi">Trayodashi</option>
                <option value="Chaturdashi">Chaturdashi</option>
                <option value="Purnima">Purnima (Full Moon)</option>
              </optgroup>
              <optgroup label="Krishna Paksha (Waning)">
                <option value="Pratipada">Pratipada</option>
                <option value="Dwitiya">Dwitiya</option>
                <option value="Tritiya">Tritiya</option>
                <option value="Chaturthi">Chaturthi</option>
                <option value="Panchami">Panchami</option>
                <option value="Shashthi">Shashthi</option>
                <option value="Saptami">Saptami</option>
                <option value="Ashtami">Ashtami</option>
                <option value="Navami">Navami</option>
                <option value="Dashami">Dashami</option>
                <option value="Ekadashi">Ekadashi</option>
                <option value="Dwadashi">Dwadashi</option>
                <option value="Trayodashi">Trayodashi</option>
                <option value="Chaturdashi">Chaturdashi</option>
                <option value="Amavasya">Amavasya (New Moon)</option>
              </optgroup>
            </select>
            {errors.tithi && <p className="text-sm text-red-500 mt-1">{errors.tithi}</p>}
          </div>

          {/* Nakshatra */}
          <div>
            <label htmlFor="nakshatra" className="block text-sm font-medium text-text-primary mb-1">
              Nakshatra
            </label>
            <select
              id="nakshatra"
              name="nakshatra"
              value={formData.nakshatra}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select Nakshatra (optional)</option>
              {NAKSHATRAS.map((nakshatra) => (
                <option key={nakshatra} value={nakshatra}>
                  {nakshatra}
                </option>
              ))}
            </select>
            {errors.nakshatra && <p className="text-sm text-red-500 mt-1">{errors.nakshatra}</p>}
          </div>

          {/* Paksha */}
          <div>
            <label htmlFor="paksha" className="block text-sm font-medium text-text-primary mb-1">
              Paksha
            </label>
            <select
              id="paksha"
              name="paksha"
              value={formData.paksha ?? ''}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select Paksha (optional)</option>
              <option value="Shukla">Shukla (Waxing)</option>
              <option value="Krishna">Krishna (Waning)</option>
            </select>
            {errors.paksha && <p className="text-sm text-red-500 mt-1">{errors.paksha}</p>}
          </div>

          {/* Maas */}
          <div>
            <label htmlFor="maas" className="block text-sm font-medium text-text-primary mb-1">
              Hindu Month (Maas)
            </label>
            <select
              id="maas"
              name="maas"
              value={formData.maas}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select month (optional)</option>
              {HINDU_MONTHS.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
            {errors.maas && <p className="text-sm text-red-500 mt-1">{errors.maas}</p>}
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-6 py-2 rounded-lg border border-border bg-surface text-text-primary font-medium hover:bg-surface-hover transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading || categoriesLoading}
          className="px-6 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : mode === 'create' ? 'Create Event' : 'Update Event'}
        </button>
      </div>
    </form>
  )
}
