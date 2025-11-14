/**
 * Theme Types
 * Type definitions for themes
 */

export interface Theme {
  id: number
  name: string
  colors: ThemeColors
  darkColors?: ThemeColors // Optional dark mode variant
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
  mutedForeground: string
  card: string
  cardForeground: string
  border: string
}

export interface CreateThemeInput {
  name: string
  colors: ThemeColors
  darkColors?: ThemeColors
  isActive?: boolean
}

export interface UpdateThemeInput extends Partial<CreateThemeInput> {
  id: number
}
