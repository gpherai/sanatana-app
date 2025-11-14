import { NextResponse } from 'next/server'
import { ZodError, type ZodIssue } from 'zod'
import { Prisma } from '@prisma/client'

/**
 * API Error Types - Used for categorizing errors
 */
export type ApiErrorType =
  | 'VALIDATION_ERROR'
  | 'NOT_FOUND'
  | 'DATABASE_ERROR'
  | 'INVALID_INPUT'
  | 'UNAUTHORIZED'
  | 'INTERNAL_ERROR'

/**
 * User-friendly error messages mapped to error types
 */
const USER_FRIENDLY_MESSAGES: Record<ApiErrorType, string> = {
  VALIDATION_ERROR:
    'The information you provided is not valid. Please check your input and try again.',
  NOT_FOUND: 'The item you are looking for could not be found.',
  DATABASE_ERROR: 'We are having trouble accessing the database. Please try again in a moment.',
  INVALID_INPUT: 'The information you provided is not in the correct format.',
  UNAUTHORIZED: 'You do not have permission to perform this action.',
  INTERNAL_ERROR: 'Something went wrong on our end. Please try again later.',
}

/**
 * HTTP Status codes for different error types
 */
const ERROR_STATUS_CODES: Record<ApiErrorType, number> = {
  VALIDATION_ERROR: 400,
  NOT_FOUND: 404,
  DATABASE_ERROR: 500,
  INVALID_INPUT: 400,
  UNAUTHORIZED: 403,
  INTERNAL_ERROR: 500,
}

/**
 * Create a standardized API error response
 */
export function createApiError(
  type: ApiErrorType,
  message: string,
  details?: unknown,
  customStatus?: number
) {
  const status = customStatus ?? ERROR_STATUS_CODES[type]

  return NextResponse.json(
    {
      success: false,
      error: type,
      message, // Technical message for developers
      userMessage: USER_FRIENDLY_MESSAGES[type], // User-friendly message
      details, // Optional additional details (e.g., validation errors)
    },
    { status }
  )
}

/**
 * Handle Zod validation errors
 */
export function handleZodError(error: ZodError) {
  // Format Zod errors for better readability
  const formattedErrors = error.issues.map((err: ZodIssue) => ({
    field: err.path.join('.'),
    message: err.message,
    code: err.code,
  }))

  return createApiError(
    'VALIDATION_ERROR',
    'Validation failed for the provided data',
    formattedErrors
  )
}

/**
 * Handle Prisma database errors
 */
export function handlePrismaError(error: unknown) {
  // Prisma Client Known Request Error
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        // Unique constraint violation
        return createApiError(
          'DATABASE_ERROR',
          `A record with this ${error.meta?.target} already exists`,
          { code: error.code, target: error.meta?.target }
        )

      case 'P2025':
        // Record not found
        return createApiError('NOT_FOUND', 'The requested record was not found in the database', {
          code: error.code,
        })

      case 'P2003':
        // Foreign key constraint violation
        return createApiError(
          'DATABASE_ERROR',
          'This operation conflicts with existing data relationships',
          { code: error.code }
        )

      default:
        return createApiError('DATABASE_ERROR', `Database error: ${error.message}`, {
          code: error.code,
        })
    }
  }

  // Prisma Client Validation Error
  if (error instanceof Prisma.PrismaClientValidationError) {
    return createApiError('INVALID_INPUT', 'The data provided does not match the expected format', {
      message: error.message,
    })
  }

  // Generic Prisma error
  return createApiError(
    'DATABASE_ERROR',
    'An unexpected database error occurred',
    error instanceof Error ? { message: error.message } : undefined
  )
}

/**
 * Handle generic errors (catch-all)
 */
export function handleGenericError(error: unknown, context?: string) {
  console.error(`Error${context ? ` in ${context}` : ''}:`, error)

  // If it's a known error type, use appropriate handler
  if (error instanceof ZodError) {
    return handleZodError(error)
  }

  if (
    error instanceof Prisma.PrismaClientKnownRequestError ||
    error instanceof Prisma.PrismaClientValidationError
  ) {
    return handlePrismaError(error)
  }

  // Generic error
  const message = error instanceof Error ? error.message : 'An unexpected error occurred'

  return createApiError(
    'INTERNAL_ERROR',
    message,
    error instanceof Error ? { stack: error.stack } : undefined
  )
}

/**
 * Quick helper for "Not Found" errors
 */
export function notFoundError(resourceName: string, identifier?: string | number) {
  const message = identifier
    ? `${resourceName} with ID ${identifier} was not found`
    : `${resourceName} not found`

  return createApiError('NOT_FOUND', message)
}

/**
 * Quick helper for "Invalid Input" errors
 */
export function invalidInputError(fieldName: string, reason?: string) {
  const message = reason ? `Invalid ${fieldName}: ${reason}` : `Invalid ${fieldName}`

  return createApiError('INVALID_INPUT', message)
}
