// Application constants

export const APP_NAME = 'Dharma Calendar'
export const APP_VERSION = '0.1.0'

// Calendar settings
export const DEFAULT_VIEW = 'month'
export const CALENDAR_VIEWS = ['month', 'week', 'day', 'agenda'] as const
export const WEEK_START_OPTIONS = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
] as const

// Event types
export const EVENT_TYPES = [
  { value: 'FESTIVAL', label: 'Festival', icon: '🎉' },
  { value: 'PUJA', label: 'Puja', icon: '🙏' },
  { value: 'SPECIAL_DAY', label: 'Special Day', icon: '⭐' },
  { value: 'EKADASHI', label: 'Ekadashi', icon: '🌙' },
  { value: 'SANKRANTI', label: 'Sankranti', icon: '☀️' },
  { value: 'VRATAM', label: 'Vratam', icon: '🔔' },
  { value: 'OTHER', label: 'Other', icon: '📅' },
] as const

// Recurrence types
export const RECURRENCE_TYPES = [
  { value: 'LUNAR', label: 'Lunar (Tithi-based)' },
  { value: 'SOLAR', label: 'Solar' },
  { value: 'FIXED', label: 'Fixed Date' },
  { value: 'ANNUAL', label: 'Annual (Yearly)' },
] as const

// Event sources
export const EVENT_SOURCES = [
  { value: 'MANUAL', label: 'Manual Entry' },
  { value: 'PANCHANG_API', label: 'Panchang API' },
  { value: 'IMPORTED', label: 'Imported' },
] as const

// Lunar event types
export const LUNAR_TYPES = [
  { value: 'PURNIMA', label: 'Purnima (Full Moon)', icon: '🌕' },
  { value: 'AMAVASYA', label: 'Amavasya (New Moon)', icon: '🌑' },
  { value: 'EKADASHI', label: 'Ekadashi', icon: '🌙' },
] as const

// Tithis (1-30)
export const TITHIS = [
  // Shukla Paksha (Waxing)
  'Pratipada',
  'Dwitiya',
  'Tritiya',
  'Chaturthi',
  'Panchami',
  'Shashthi',
  'Saptami',
  'Ashtami',
  'Navami',
  'Dashami',
  'Ekadashi',
  'Dwadashi',
  'Trayodashi',
  'Chaturdashi',
  'Purnima',
  // Krishna Paksha (Waning)
  'Pratipada',
  'Dwitiya',
  'Tritiya',
  'Chaturthi',
  'Panchami',
  'Shashthi',
  'Saptami',
  'Ashtami',
  'Navami',
  'Dashami',
  'Ekadashi',
  'Dwadashi',
  'Trayodashi',
  'Chaturdashi',
  'Amavasya',
] as const

// Nakshatras (27)
export const NAKSHATRAS = [
  'Ashwini',
  'Bharani',
  'Krittika',
  'Rohini',
  'Mrigashira',
  'Ardra',
  'Punarvasu',
  'Pushya',
  'Ashlesha',
  'Magha',
  'Purva Phalguni',
  'Uttara Phalguni',
  'Hasta',
  'Chitra',
  'Swati',
  'Vishakha',
  'Anuradha',
  'Jyeshtha',
  'Mula',
  'Purva Ashadha',
  'Uttara Ashadha',
  'Shravana',
  'Dhanishta',
  'Shatabhisha',
  'Purva Bhadrapada',
  'Uttara Bhadrapada',
  'Revati',
] as const

// Hindu months
export const HINDU_MONTHS = [
  'Chaitra',
  'Vaisakha',
  'Jyeshtha',
  'Ashadha',
  'Shravana',
  'Bhadrapada',
  'Ashwin',
  'Kartik',
  'Margashirsha',
  'Pausha',
  'Magha',
  'Phalguna',
] as const

// Importance levels
export const IMPORTANCE_LEVELS = [
  { value: 1, label: 'Very Low' },
  { value: 3, label: 'Low' },
  { value: 5, label: 'Medium' },
  { value: 7, label: 'High' },
  { value: 10, label: 'Very High' },
] as const

// Date/Time formats
export const DATE_FORMAT = 'dd-MM-yyyy'
export const TIME_FORMAT = 'HH:mm'
export const DATETIME_FORMAT = 'dd-MM-yyyy HH:mm'

// Theme IDs
export const DEFAULT_THEME = 'spiritual-minimal'
// Note: Available themes loaded dynamically from /public/themes/*.json via API

// Pagination
export const EVENTS_PER_PAGE = 50
export const LUNAR_EVENTS_PER_PAGE = 100

// API Cache duration (milliseconds)
export const CACHE_DURATION = {
  PANCHANG: 30 * 24 * 60 * 60 * 1000, // 30 days
  LUNAR: 7 * 24 * 60 * 60 * 1000, // 7 days
  THEMES: 24 * 60 * 60 * 1000, // 1 day
} as const

// External API (for later)
export const PANCHANG_API_BASE_URL = process.env.PANCHANG_API_URL || ''
export const PANCHANG_API_KEY = process.env.PANCHANG_API_KEY || ''
export const PANCHANG_API_RATE_LIMIT = 5000 // requests per month

// Timezones (Europe focus)
export const TIMEZONES = [
  { value: 'Europe/Amsterdam', label: 'Amsterdam (CET/CEST)' },
  { value: 'Europe/London', label: 'London (GMT/BST)' },
  { value: 'Europe/Paris', label: 'Paris (CET/CEST)' },
  { value: 'Europe/Berlin', label: 'Berlin (CET/CEST)' },
  { value: 'Europe/Rome', label: 'Rome (CET/CEST)' },
  { value: 'Europe/Madrid', label: 'Madrid (CET/CEST)' },
  { value: 'Europe/Brussels', label: 'Brussels (CET/CEST)' },
  { value: 'Europe/Vienna', label: 'Vienna (CET/CEST)' },
  { value: 'Europe/Warsaw', label: 'Warsaw (CET/CEST)' },
  { value: 'Europe/Athens', label: 'Athens (EET/EEST)' },
  { value: 'Europe/Istanbul', label: 'Istanbul (TRT)' },
  { value: 'Europe/Moscow', label: 'Moscow (MSK)' },
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
] as const

// Nederlandse steden voor temporary location dropdown
export const NL_CITIES = [
  { name: 'Amsterdam', lat: 52.37, lon: 4.89 },
  { name: 'Rotterdam', lat: 51.92, lon: 4.48 },
  { name: 'Den Haag', lat: 52.08, lon: 4.31 },
  { name: 'Utrecht', lat: 52.09, lon: 5.12 },
  { name: 'Eindhoven', lat: 51.44, lon: 5.48 },
  { name: 'Groningen', lat: 53.22, lon: 6.57 },
  { name: 'Tilburg', lat: 51.56, lon: 5.09 },
  { name: 'Almere', lat: 52.37, lon: 5.22 },
  { name: 'Breda', lat: 51.59, lon: 4.78 },
  { name: 'Nijmegen', lat: 51.84, lon: 5.85 },
  { name: 'Enschede', lat: 52.22, lon: 6.89 },
  { name: 'Haarlem', lat: 52.38, lon: 4.64 },
  { name: 'Arnhem', lat: 51.98, lon: 5.91 },
  { name: 'Zaanstad', lat: 52.45, lon: 4.82 },
  { name: 'Amersfoort', lat: 52.16, lon: 5.39 },
  { name: 'Apeldoorn', lat: 52.21, lon: 5.97 },
  { name: 'Maastricht', lat: 50.85, lon: 5.69 },
  { name: 'Leiden', lat: 52.16, lon: 4.49 },
  { name: 's-Hertogenbosch', lat: 51.69, lon: 5.31 },
  { name: 'Zwolle', lat: 52.51, lon: 6.09 },
] as const
