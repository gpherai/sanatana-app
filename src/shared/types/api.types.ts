/**
 * API Types
 * Shared types for API requests and responses
 */

// API Response Types
export interface ApiSuccessResponse<T = unknown> {
  success: true
  data: T
  meta?: PaginationMeta
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

// Pagination
export interface PaginationMeta {
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

export interface PaginationParams {
  page?: number
  pageSize?: number
}

// Sorting
export type SortOrder = 'asc' | 'desc'

export interface SortParams {
  sortBy?: string
  sortOrder?: SortOrder
}

// Search
export interface SearchParams {
  query?: string
}

// Date Range
export interface DateRangeParams {
  startDate?: string
  endDate?: string
}

// Combined Query Params
export interface QueryParams extends PaginationParams, SortParams, SearchParams, DateRangeParams {
  [key: string]: unknown
}

// API Request Options
export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  headers?: HeadersInit
  body?: unknown
  cache?: RequestCache
  next?: {
    revalidate?: number
    tags?: string[]
  }
}

// Fetch State
export interface FetchState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

// Mutation State
export interface MutationState {
  loading: boolean
  error: string | null
  success: boolean
}
