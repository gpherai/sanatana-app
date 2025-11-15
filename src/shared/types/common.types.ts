/**
 * Common Types
 * Shared types used across the application
 */

// Location
export interface Location {
  latitude: number
  longitude: number
  timezone: string
  name?: string
}

export interface SavedLocation extends Location {
  id: number
  isDefault: boolean
  createdAt: Date
  updatedAt: Date
}

// Theme
export interface Theme {
  id: number
  name: string
  colors: ThemeColors
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  background: string
  foreground: string
  muted: string
  card: string
  border: string
}

// User Preferences
export interface UserPreferences {
  id: number
  defaultView: 'month' | 'week' | 'day'
  showLunarInfo: boolean
  showHolidays: boolean
  notifications: boolean
  tempLocation: Location | null
  createdAt: Date
  updatedAt: Date
}

// Filter Options
export interface FilterOptions {
  eventTypes?: string[]
  categories?: number[]
  startDate?: string
  endDate?: string
  searchQuery?: string
}

// Select Option
export interface SelectOption<T = string> {
  value: T
  label: string
  icon?: string
  disabled?: boolean
}

// Confirmation Dialog
export interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'warning' | 'info'
  onConfirm: () => void
  onCancel: () => void
}

// Toast Notification
export interface ToastNotification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

// Loading State
export interface LoadingState {
  isLoading: boolean
  message?: string
}

// Empty State
export interface EmptyStateProps {
  icon?: string
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}

// Breadcrumb
export interface Breadcrumb {
  label: string
  href?: string
}

// Tab
export interface Tab {
  id: string
  label: string
  icon?: string
  badge?: number
  disabled?: boolean
}
