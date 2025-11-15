/**
 * Prisma Client Singleton
 * Prevents connection pool exhaustion in development
 */

import { PrismaClient } from '@prisma/client'
import { isDevelopment } from '@/core/config/env'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: isDevelopment()
      ? ['query', 'error', 'warn']
      : ['error'],
  })

if (isDevelopment()) {
  globalForPrisma.prisma = prisma
}

// Graceful shutdown
if (typeof window === 'undefined') {
  process.on('beforeExit', async () => {
    await prisma.$disconnect()
  })
}
