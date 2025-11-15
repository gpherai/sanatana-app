/**
 * Formatting Utilities
 * Various formatting helpers
 */

/**
 * Capitalizes the first letter of a string
 */
export function capitalize(str: string): string {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * Capitalizes the first letter of each word
 */
export function capitalizeWords(str: string): string {
  if (!str) return ''
  return str
    .split(' ')
    .map(word => capitalize(word))
    .join(' ')
}

/**
 * Truncates a string to a specified length
 */
export function truncate(str: string, length: number, suffix: string = '...'): string {
  if (!str || str.length <= length) return str
  return str.slice(0, length) + suffix
}

/**
 * Formats a number with commas
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num)
}

/**
 * Formats a percentage
 */
export function formatPercentage(value: number, decimals: number = 0): string {
  return `${value.toFixed(decimals)}%`
}

/**
 * Converts a string to kebab-case
 */
export function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
}

/**
 * Converts a string to camelCase
 */
export function toCamelCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ''))
    .replace(/^[A-Z]/, char => char.toLowerCase())
}

/**
 * Converts a string to PascalCase
 */
export function toPascalCase(str: string): string {
  const camel = toCamelCase(str)
  return camel.charAt(0).toUpperCase() + camel.slice(1)
}

/**
 * Pluralizes a word based on count
 */
export function pluralize(word: string, count: number, suffix: string = 's'): string {
  return count === 1 ? word : word + suffix
}

/**
 * Formats a count with word (e.g., "5 events")
 */
export function formatCount(count: number, word: string, suffix: string = 's'): string {
  return `${count} ${pluralize(word, count, suffix)}`
}

/**
 * Removes HTML tags from a string
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '')
}

/**
 * Escapes HTML special characters
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }
  return text.replace(/[&<>"']/g, char => map[char] ?? char)
}

/**
 * Formats coordinates to display format
 */
export function formatCoordinates(lat: number, lng: number, decimals: number = 4): string {
  const latDir = lat >= 0 ? 'N' : 'S'
  const lngDir = lng >= 0 ? 'E' : 'W'
  return `${Math.abs(lat).toFixed(decimals)}°${latDir}, ${Math.abs(lng).toFixed(decimals)}°${lngDir}`
}

/**
 * Generates initials from a name
 */
export function getInitials(name: string, maxLength: number = 2): string {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, maxLength)
    .join('')
}

/**
 * Formats a file size in bytes to human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}
