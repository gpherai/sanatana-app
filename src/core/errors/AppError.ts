/**
 * Custom Application Error Class
 * Provides structured error handling with codes and HTTP status
 */

import { ErrorCode, ErrorCodeType, ErrorMessages } from './error-codes'

export class AppError extends Error {
  public readonly code: ErrorCodeType
  public readonly statusCode: number
  public readonly details?: unknown
  public readonly timestamp: Date

  constructor(
    message: string,
    code: ErrorCodeType,
    statusCode: number,
    details?: unknown
  ) {
    super(message)
    this.name = 'AppError'
    this.code = code
    this.statusCode = statusCode
    this.details = details
    this.timestamp = new Date()

    // Maintains proper stack trace for where error was thrown
    Error.captureStackTrace(this, this.constructor)
  }

  // Factory methods for common errors
  static badRequest(message?: string, details?: unknown): AppError {
    return new AppError(
      message ?? ErrorMessages.INVALID_INPUT,
      ErrorCode.INVALID_INPUT,
      400,
      details
    )
  }

  static validation(message?: string, details?: unknown): AppError {
    return new AppError(
      message ?? ErrorMessages.VALIDATION_ERROR,
      ErrorCode.VALIDATION_ERROR,
      400,
      details
    )
  }

  static unauthorized(message?: string): AppError {
    return new AppError(
      message ?? ErrorMessages.UNAUTHORIZED,
      ErrorCode.UNAUTHORIZED,
      401
    )
  }

  static forbidden(message?: string): AppError {
    return new AppError(
      message ?? ErrorMessages.FORBIDDEN,
      ErrorCode.FORBIDDEN,
      403
    )
  }

  static notFound(resource: string): AppError {
    return new AppError(
      `${resource} not found`,
      ErrorCode.NOT_FOUND,
      404
    )
  }

  static conflict(message: string, details?: unknown): AppError {
    return new AppError(
      message,
      ErrorCode.ALREADY_EXISTS,
      409,
      details
    )
  }

  static unprocessable(message: string, details?: unknown): AppError {
    return new AppError(
      message,
      ErrorCode.BUSINESS_LOGIC_ERROR,
      422,
      details
    )
  }

  static internal(message?: string, details?: unknown): AppError {
    return new AppError(
      message ?? ErrorMessages.INTERNAL_SERVER_ERROR,
      ErrorCode.INTERNAL_SERVER_ERROR,
      500,
      details
    )
  }

  static externalService(service: string, details?: unknown): AppError {
    return new AppError(
      `${service} service error`,
      ErrorCode.EXTERNAL_SERVICE_ERROR,
      502,
      details
    )
  }

  // Serialization for API responses
  toJSON() {
    const error: Record<string, any> = {
      code: this.code,
      message: this.message,
      timestamp: this.timestamp.toISOString()
    }

    if (this.details) {
      error.details = this.details
    }

    return {
      success: false,
      error
    }
  }
}
