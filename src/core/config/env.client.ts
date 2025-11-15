/**
 * Client-Safe Environment Variables
 * Only NEXT_PUBLIC_* variables can be safely used in client components
 */

import { z } from 'zod'

const clientEnvSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().default('Dharma Calendar'),
  NEXT_PUBLIC_APP_VERSION: z.string().default('0.3.0'),
})

export type ClientEnv = z.infer<typeof clientEnvSchema>

function validateClientEnv(): ClientEnv {
  const parsed = clientEnvSchema.safeParse(process.env)

  if (!parsed.success) {
    console.error('❌ Invalid client environment variables:')
    console.error(JSON.stringify(parsed.error.flatten().fieldErrors, null, 2))
    throw new Error('Client environment validation failed')
  }

  return parsed.data
}

export const env = validateClientEnv()

// Client-safe environment checks
// Note: process.env.NODE_ENV is safe to use in client code as it's replaced at build time
export const isDevelopment = () => process.env.NODE_ENV === 'development'
export const isProduction = () => process.env.NODE_ENV === 'production'
export const isTest = () => process.env.NODE_ENV === 'test'
