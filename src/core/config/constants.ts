/**
 * Application Constants
 * All constant values used throughout the application
 */

// Event Types
export const EVENT_TYPES = [
  { value: 'FESTIVAL', label: 'Festival', icon: '🎉' },
  { value: 'PUJA', label: 'Puja', icon: '🙏' },
  { value: 'VRAT', label: 'Vrat (Fast)', icon: '🌙' },
  { value: 'DEITY', label: 'Deity Day', icon: '🕉️' },
  { value: 'AUSPICIOUS', label: 'Auspicious Day', icon: '✨' },
  { value: 'OBSERVANCE', label: 'Observance', icon: '📿' },
  { value: 'OTHER', label: 'Other', icon: '📅' },
] as const

export type EventType = typeof EVENT_TYPES[number]['value']

// Event Colors
export const EVENT_COLORS = [
  { value: 'red', label: 'Red', hex: '#ef4444' },
  { value: 'orange', label: 'Orange', hex: '#f97316' },
  { value: 'amber', label: 'Amber', hex: '#f59e0b' },
  { value: 'yellow', label: 'Yellow', hex: '#eab308' },
  { value: 'lime', label: 'Lime', hex: '#84cc16' },
  { value: 'green', label: 'Green', hex: '#22c55e' },
  { value: 'emerald', label: 'Emerald', hex: '#10b981' },
  { value: 'teal', label: 'Teal', hex: '#14b8a6' },
  { value: 'cyan', label: 'Cyan', hex: '#06b6d4' },
  { value: 'sky', label: 'Sky', hex: '#0ea5e9' },
  { value: 'blue', label: 'Blue', hex: '#3b82f6' },
  { value: 'indigo', label: 'Indigo', hex: '#6366f1' },
  { value: 'violet', label: 'Violet', hex: '#8b5cf6' },
  { value: 'purple', label: 'Purple', hex: '#a855f7' },
  { value: 'fuchsia', label: 'Fuchsia', hex: '#d946ef' },
  { value: 'pink', label: 'Pink', hex: '#ec4899' },
  { value: 'rose', label: 'Rose', hex: '#f43f5e' },
] as const

export type EventColor = typeof EVENT_COLORS[number]['value']

// Lunar Tithis (Days)
export const TITHIS = [
  'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
  'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
  'Ekadashi', 'Dvadashi', 'Trayodashi', 'Chaturdashi', 'Purnima/Amavasya'
] as const

export type Tithi = typeof TITHIS[number]

// Nakshatras (Lunar Mansions)
export const NAKSHATRAS = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni',
  'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha',
  'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha', 'Uttara Ashadha',
  'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada',
  'Uttara Bhadrapada', 'Revati'
] as const

export type Nakshatra = typeof NAKSHATRAS[number]

// Hindu Months
export const HINDU_MONTHS = [
  'Chaitra', 'Vaisakha', 'Jyeshtha', 'Ashadha',
  'Shravana', 'Bhadrapada', 'Ashwin', 'Kartika',
  'Margashirsha', 'Pausha', 'Magha', 'Phalguna'
] as const

export type HinduMonth = typeof HINDU_MONTHS[number]

// Lunar Phases
export const LUNAR_PHASES = [
  { value: 'NEW_MOON', label: 'New Moon', icon: '🌑' },
  { value: 'WAXING_CRESCENT', label: 'Waxing Crescent', icon: '🌒' },
  { value: 'FIRST_QUARTER', label: 'First Quarter', icon: '🌓' },
  { value: 'WAXING_GIBBOUS', label: 'Waxing Gibbous', icon: '🌔' },
  { value: 'FULL_MOON', label: 'Full Moon', icon: '🌕' },
  { value: 'WANING_GIBBOUS', label: 'Waning Gibbous', icon: '🌖' },
  { value: 'LAST_QUARTER', label: 'Last Quarter', icon: '🌗' },
  { value: 'WANING_CRESCENT', label: 'Waning Crescent', icon: '🌘' },
] as const

export type LunarPhase = typeof LUNAR_PHASES[number]['value']

// Pakshas (Lunar Fortnights)
export const PAKSHAS = ['Shukla Paksha', 'Krishna Paksha'] as const
export type Paksha = typeof PAKSHAS[number]

// Default Location (Varanasi, India)
export const DEFAULT_LOCATION = {
  latitude: 25.3176,
  longitude: 82.9739,
  timezone: 'Asia/Kolkata',
  name: 'Varanasi, India'
} as const

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  ISO: 'yyyy-MM-dd',
  FULL: 'EEEE, MMMM dd, yyyy',
  TIME: 'HH:mm',
  DATETIME: 'MMM dd, yyyy HH:mm'
} as const

// Timezones
export const TIMEZONES = [
  'Asia/Kolkata',
  'America/New_York',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Amsterdam',
  'Australia/Sydney',
  'Asia/Tokyo',
  'Asia/Dubai'
] as const

export type Timezone = typeof TIMEZONES[number]

// Pagination
export const DEFAULT_PAGE_SIZE = 20
export const MAX_PAGE_SIZE = 100

// API Configuration
export const API_TIMEOUT = 30000 // 30 seconds
export const DEBOUNCE_DELAY = 300 // milliseconds

// Local Storage Keys
export const STORAGE_KEYS = {
  THEME: 'dharma-calendar-theme',
  LOCATION: 'dharma-calendar-location',
  PREFERENCES: 'dharma-calendar-preferences',
  FILTERS: 'dharma-calendar-filters'
} as const

// Theme Names
export const THEME_NAMES = [
  'Light', 'Dark', 'Saffron', 'Lotus', 'Peacock'
] as const

export type ThemeName = typeof THEME_NAMES[number]
