// Theme system TypeScript types
import { CALENDAR_VIEWS } from '@/config/constants'

// Generate type dynamically from constants for automatic sync
export type CalendarView = (typeof CALENDAR_VIEWS)[number]

export interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  background: string
  surface: string
  surfaceHover: string
  textPrimary: string
  textSecondary: string
  textMuted: string
  border: string
  borderHover: string
  calendar: {
    todayBg: string
    todayBorder: string
    eventBg: string
    lunarBg: string
    festivalBg: string
    weekendBg: string
  }
  categories: {
    ganesha: string
    durga: string
    shiva: string
    devi: string
    general: string
  }
}

export interface ThemeTypography {
  fontFamily: {
    display: string
    body: string
    mono: string
  }
  fontSize: {
    base: string
    scale: number
  }
}

export interface ThemeSpacing {
  scale: 'compact' | 'comfortable' | 'spacious'
  baseUnit: number
}

export interface ThemeBorders {
  radius: 'sharp' | 'rounded' | 'pill'
  width: 'thin' | 'medium' | 'thick'
}

export interface ThemeEffects {
  shadows: boolean
  animations: boolean
  transitions: 'none' | 'fast' | 'smooth'
}

export interface ThemePatterns {
  enabled: boolean
  type: 'mandala' | 'geometric' | 'floral' | 'none'
  opacity: number
  position: 'background' | 'borders' | 'accents'
}

export interface Theme {
  id: string
  name: string
  description: string
  colors: ThemeColors
  typography: ThemeTypography
  spacing: ThemeSpacing
  borders: ThemeBorders
  effects: ThemeEffects
  patterns?: ThemePatterns
}

export interface UserPreference {
  id: number
  currentTheme: string
  defaultView: CalendarView // Dynamic type
  weekStartsOn: number
  visibleTypes: string[] // Native array
  visibleCategories: number[] // Native array
  locationName?: string | null
  locationLat?: number | null
  locationLon?: number | null
  timezone: string
  notificationsEnabled: boolean
  notificationDaysBefore: number
  updatedAt: Date
}
