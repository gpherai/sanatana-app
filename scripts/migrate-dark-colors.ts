/**
 * Manual Migration Script - Add darkColors column to Theme table
 * Workaround for Prisma CDN issues preventing normal migrations
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('🔄 Adding darkColors column to Theme table...')

    // Add the darkColors column as JSONB (PostgreSQL JSON type)
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "Theme"
      ADD COLUMN IF NOT EXISTS "darkColors" JSONB;
    `)

    console.log('✅ Successfully added darkColors column!')
    console.log('📋 You can now run: npm run db:seed')
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
