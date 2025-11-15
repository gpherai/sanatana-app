/**
 * Server-Only Environment Variables
 *
 * WARNING: DO NOT IMPORT THIS FILE IN CLIENT COMPONENTS
 *
 * This file contains server-only environment variables including DATABASE_URL.
 * For client components, use @/core/config/env.client instead.
 *
 * Use this file only in:
 * - API routes (app/api/...)
 * - Server components (without 'use client')
 * - Server utilities (prisma, logger in server context, etc.)
 */

import { z } from 'zod'

const serverEnvSchema = z.object({
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXT_PUBLIC_APP_NAME: z.string().default('Dharma Calendar'),
  NEXT_PUBLIC_APP_VERSION: z.string().default('0.3.0'),
  PANCHANG_API_KEY: z.string().optional(),
  PANCHANG_API_URL: z.string().url().optional(),
})

export type ServerEnv = z.infer<typeof serverEnvSchema>
export type Env = ServerEnv  // Alias for backward compatibility

function validateServerEnv(): ServerEnv {
  const parsed = serverEnvSchema.safeParse(process.env)

  if (!parsed.success) {
    console.error('❌ Invalid server environment variables:')
    console.error(JSON.stringify(parsed.error.flatten().fieldErrors, null, 2))
    throw new Error('Server environment validation failed')
  }

  return parsed.data
}

export const serverEnv = validateServerEnv()
export const env = serverEnv  // Alias for backward compatibility

export const isDevelopment = () => serverEnv.NODE_ENV === 'development'
export const isProduction = () => serverEnv.NODE_ENV === 'production'
export const isTest = () => serverEnv.NODE_ENV === 'test'
