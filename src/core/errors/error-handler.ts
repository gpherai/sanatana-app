/**
 * Global Error Handler
 * Handles all types of errors and converts them to HTTP responses
 */

import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library'
import { AppError } from './AppError'
import { ErrorCode } from './error-codes'
import { isDevelopment } from '@/core/config/env'

export function handleApiError(error: unknown): NextResponse {
  console.error('API Error:', error)

  // Handle AppError instances
  if (error instanceof AppError) {
    return NextResponse.json(error.toJSON(), {
      status: error.statusCode
    })
  }

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: ErrorCode.VALIDATION_ERROR,
          message: 'Validation failed',
          details: error.flatten().fieldErrors,
          timestamp: new Date().toISOString()
        }
      },
      { status: 400 }
    )
  }

  // Handle Prisma errors
  if (error instanceof PrismaClientKnownRequestError) {
    return handlePrismaError(error)
  }

  if (error instanceof PrismaClientValidationError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: ErrorCode.VALIDATION_ERROR,
          message: 'Database validation failed',
          ...(isDevelopment() && { details: error.message }),
          timestamp: new Date().toISOString()
        }
      },
      { status: 400 }
    )
  }

  // Handle standard Error instances
  if (error instanceof Error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: ErrorCode.INTERNAL_SERVER_ERROR,
          message: isDevelopment() ? error.message : 'Internal server error',
          ...(isDevelopment() && { stack: error.stack }),
          timestamp: new Date().toISOString()
        }
      },
      { status: 500 }
    )
  }

  // Handle unknown errors
  return NextResponse.json(
    {
      success: false,
      error: {
        code: ErrorCode.UNKNOWN_ERROR,
        message: 'An unknown error occurred',
        ...(isDevelopment() && { details: String(error) }),
        timestamp: new Date().toISOString()
      }
    },
    { status: 500 }
  )
}

function handlePrismaError(error: PrismaClientKnownRequestError): NextResponse {
  switch (error.code) {
    case 'P2002': // Unique constraint violation
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ErrorCode.ALREADY_EXISTS,
            message: 'Resource already exists',
            details: error.meta,
            timestamp: new Date().toISOString()
          }
        },
        { status: 409 }
      )

    case 'P2025': // Record not found
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ErrorCode.NOT_FOUND,
            message: 'Resource not found',
            timestamp: new Date().toISOString()
          }
        },
        { status: 404 }
      )

    case 'P2003': // Foreign key constraint failed
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ErrorCode.VALIDATION_ERROR,
            message: 'Invalid reference',
            details: error.meta,
            timestamp: new Date().toISOString()
          }
        },
        { status: 400 }
      )

    case 'P2014': // Invalid ID
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ErrorCode.INVALID_INPUT,
            message: 'Invalid ID provided',
            timestamp: new Date().toISOString()
          }
        },
        { status: 400 }
      )

    default:
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ErrorCode.DATABASE_ERROR,
            message: 'Database operation failed',
            ...(isDevelopment() && { details: error.message }),
            timestamp: new Date().toISOString()
          }
        },
        { status: 500 }
      )
  }
}

// Error logger helper
export function logError(error: unknown, context?: string): void {
  const timestamp = new Date().toISOString()
  const prefix = context ? `[${context}]` : '[Error]'

  if (error instanceof AppError) {
    console.error(`${prefix} ${timestamp}:`, {
      code: error.code,
      message: error.message,
      statusCode: error.statusCode,
      details: error.details
    })
  } else if (error instanceof Error) {
    console.error(`${prefix} ${timestamp}:`, {
      name: error.name,
      message: error.message,
      stack: error.stack
    })
  } else {
    console.error(`${prefix} ${timestamp}:`, error)
  }
}
