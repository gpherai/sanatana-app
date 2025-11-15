/**
 * Error Codes
 * Centralized error code definitions
 */

export const ErrorCode = {
  // Validation Errors (400)
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',
  INVALID_DATE: 'INVALID_DATE',
  INVALID_COORDINATES: 'INVALID_COORDINATES',

  // Authentication & Authorization (401, 403)
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  INVALID_TOKEN: 'INVALID_TOKEN',

  // Not Found Errors (404)
  NOT_FOUND: 'NOT_FOUND',
  EVENT_NOT_FOUND: 'EVENT_NOT_FOUND',
  CATEGORY_NOT_FOUND: 'CATEGORY_NOT_FOUND',
  LOCATION_NOT_FOUND: 'LOCATION_NOT_FOUND',
  THEME_NOT_FOUND: 'THEME_NOT_FOUND',

  // Conflict Errors (409)
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  DUPLICATE_EVENT: 'DUPLICATE_EVENT',
  DUPLICATE_CATEGORY: 'DUPLICATE_CATEGORY',

  // Business Logic Errors (422)
  BUSINESS_LOGIC_ERROR: 'BUSINESS_LOGIC_ERROR',
  INVALID_DATE_RANGE: 'INVALID_DATE_RANGE',
  PAST_DATE_NOT_ALLOWED: 'PAST_DATE_NOT_ALLOWED',

  // External Service Errors (502, 503)
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
  PANCHANG_API_ERROR: 'PANCHANG_API_ERROR',
  ASTRONOMY_CALCULATION_ERROR: 'ASTRONOMY_CALCULATION_ERROR',

  // Database Errors (500)
  DATABASE_ERROR: 'DATABASE_ERROR',
  CONNECTION_ERROR: 'CONNECTION_ERROR',
  TRANSACTION_FAILED: 'TRANSACTION_FAILED',

  // Internal Server Errors (500)
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const

export type ErrorCodeType = typeof ErrorCode[keyof typeof ErrorCode]

export const ErrorMessages: Record<ErrorCodeType, string> = {
  VALIDATION_ERROR: 'Validation failed',
  INVALID_INPUT: 'Invalid input provided',
  MISSING_REQUIRED_FIELD: 'Required field is missing',
  INVALID_DATE: 'Invalid date format',
  INVALID_COORDINATES: 'Invalid latitude or longitude',

  UNAUTHORIZED: 'Authentication required',
  FORBIDDEN: 'Access denied',
  INVALID_TOKEN: 'Invalid or expired token',

  NOT_FOUND: 'Resource not found',
  EVENT_NOT_FOUND: 'Event not found',
  CATEGORY_NOT_FOUND: 'Category not found',
  LOCATION_NOT_FOUND: 'Location not found',
  THEME_NOT_FOUND: 'Theme not found',

  ALREADY_EXISTS: 'Resource already exists',
  DUPLICATE_EVENT: 'Event already exists for this date',
  DUPLICATE_CATEGORY: 'Category with this name already exists',

  BUSINESS_LOGIC_ERROR: 'Business logic validation failed',
  INVALID_DATE_RANGE: 'End date must be after start date',
  PAST_DATE_NOT_ALLOWED: 'Past dates are not allowed',

  EXTERNAL_SERVICE_ERROR: 'External service unavailable',
  PANCHANG_API_ERROR: 'Panchang API request failed',
  ASTRONOMY_CALCULATION_ERROR: 'Astronomy calculation failed',

  DATABASE_ERROR: 'Database operation failed',
  CONNECTION_ERROR: 'Database connection failed',
  TRANSACTION_FAILED: 'Database transaction failed',

  INTERNAL_SERVER_ERROR: 'Internal server error',
  UNKNOWN_ERROR: 'An unknown error occurred',
}
