/**
 * API Response Helpers
 * Standardized API response formats
 */

import { NextResponse } from 'next/server'

export interface ApiSuccessResponse<T = unknown> {
  success: true
  data: T
  meta?: {
    total?: number
    page?: number
    pageSize?: number
    hasMore?: boolean
  }
  timestamp: string
}

export interface ApiErrorResponse {
  success: false
  error: {
    code: string
    message: string
    details?: unknown
    timestamp: string
  }
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse

/**
 * Creates a successful API response
 */
export function success<T>(
  data: T,
  meta?: ApiSuccessResponse<T>['meta'],
  status: number = 200
): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      ...(meta && { meta }),
      timestamp: new Date().toISOString()
    },
    { status }
  )
}

/**
 * Creates a created (201) response
 */
export function created<T>(data: T): NextResponse<ApiSuccessResponse<T>> {
  return success(data, undefined, 201)
}

/**
 * Creates a no content (204) response
 */
export function noContent(): NextResponse {
  return new NextResponse(null, { status: 204 })
}

/**
 * Creates a paginated response
 */
export function paginated<T>(
  data: T[],
  total: number,
  page: number,
  pageSize: number
): NextResponse<ApiSuccessResponse<T[]>> {
  const hasMore = page * pageSize < total

  return success(data, {
    total,
    page,
    pageSize,
    hasMore
  })
}
