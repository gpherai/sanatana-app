/**
 * Environment Variable Validation
 * Type-safe environment variables using Zod
 */

import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXT_PUBLIC_APP_NAME: z.string().default('Dharma Calendar'),
  NEXT_PUBLIC_APP_VERSION: z.string().default('0.3.0'),
  PANCHANG_API_KEY: z.string().optional(),
  PANCHANG_API_URL: z.string().url().optional(),
})

export type Env = z.infer<typeof envSchema>

function validateEnv(): Env {
  const parsed = envSchema.safeParse(process.env)

  if (!parsed.success) {
    console.error('❌ Invalid environment variables:')
    console.error(JSON.stringify(parsed.error.flatten().fieldErrors, null, 2))
    throw new Error('Environment validation failed')
  }

  return parsed.data
}

export const env = validateEnv()

export const isDevelopment = () => env.NODE_ENV === 'development'
export const isProduction = () => env.NODE_ENV === 'production'
export const isTest = () => env.NODE_ENV === 'test'
