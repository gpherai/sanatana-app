/**
 * Seed Script for Dharma Calendar v0.3
 * Seeds database with sample data for current schema
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Clear existing data
  await prisma.event.deleteMany()
  await prisma.category.deleteMany()
  await prisma.userPreferences.deleteMany()
  await prisma.savedLocation.deleteMany()
  await prisma.theme.deleteMany()

  console.log('✓ Cleared existing data')

  // Seed Categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Major Festivals',
        description: 'Important Hindu festivals and celebrations',
        color: 'orange',
        icon: '🎊',
        defaultEventType: 'FESTIVAL',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Pujas & Rituals',
        description: 'Daily pujas and ritual observances',
        color: 'purple',
        icon: '🙏',
        defaultEventType: 'PUJA',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Vrats & Fasting',
        description: 'Fasting days and vrat observances',
        color: 'blue',
        icon: '🌙',
        defaultEventType: 'VRAT',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Deity Celebrations',
        description: 'Days dedicated to specific deities',
        color: 'pink',
        icon: '✨',
        defaultEventType: 'DEITY',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Auspicious Days',
        description: 'Muhurat and auspicious timings',
        color: 'green',
        icon: '🌟',
        defaultEventType: 'AUSPICIOUS',
      },
    }),
  ])

  console.log(`✓ Created ${categories.length} categories`)

  // Seed Sample Events
  const today = new Date()
  const events = await Promise.all([
    prisma.event.create({
      data: {
        title: 'Diwali',
        description: 'Festival of Lights - The victory of light over darkness',
        eventType: 'FESTIVAL',
        startDate: new Date(today.getFullYear(), 10, 12), // Nov 12
        isAllDay: true,
        color: 'orange',
        categoryId: categories[0].id,
        isRecurring: true,
        recurrenceRule: 'FREQ=YEARLY',
        lunarDate: {
          tithi: 'Amavasya',
          paksha: 'Krishna',
          nakshatra: 'Swati',
          hinduMonth: 'Kartik',
        },
      },
    }),
    prisma.event.create({
      data: {
        title: 'Ekadashi',
        description: 'Sacred fasting day occurring twice per lunar month',
        eventType: 'VRAT',
        startDate: new Date(today.getFullYear(), today.getMonth(), 23),
        isAllDay: true,
        color: 'blue',
        categoryId: categories[2].id,
        isRecurring: true,
        reminder: true,
        reminderMinutes: 1440, // 1 day before
      },
    }),
    prisma.event.create({
      data: {
        title: 'Ganesh Chaturthi',
        description: 'Birthday celebration of Lord Ganesha',
        eventType: 'DEITY',
        startDate: new Date(today.getFullYear(), 8, 7), // Sep 7
        isAllDay: true,
        color: 'pink',
        categoryId: categories[3].id,
        isRecurring: true,
        recurrenceRule: 'FREQ=YEARLY',
      },
    }),
    prisma.event.create({
      data: {
        title: 'Maha Shivaratri',
        description: 'Great night of Lord Shiva - fasting and prayers',
        eventType: 'DEITY',
        startDate: new Date(today.getFullYear() + 1, 2, 8), // Mar 8
        isAllDay: true,
        color: 'purple',
        categoryId: categories[3].id,
        isRecurring: true,
        recurrenceRule: 'FREQ=YEARLY',
        lunarDate: {
          tithi: 'Chaturdashi',
          paksha: 'Krishna',
          nakshatra: 'Purva Phalguni',
          hinduMonth: 'Phalguna',
        },
      },
    }),
    prisma.event.create({
      data: {
        title: 'Holi',
        description: 'Festival of Colors - celebration of spring',
        eventType: 'FESTIVAL',
        startDate: new Date(today.getFullYear() + 1, 2, 25), // Mar 25
        isAllDay: true,
        color: 'orange',
        categoryId: categories[0].id,
        isRecurring: true,
        recurrenceRule: 'FREQ=YEARLY',
      },
    }),
  ])

  console.log(`✓ Created ${events.length} sample events`)

  // Seed Default User Preferences
  await prisma.userPreferences.create({
    data: {
      defaultView: 'month',
      showLunarInfo: true,
      showHolidays: true,
      notifications: false,
      tempLocation: {
        name: 'New Delhi, India',
        latitude: 28.6139,
        longitude: 77.209,
        timezone: 'Asia/Kolkata',
      },
    },
  })

  console.log('✓ Created default user preferences')

  // Seed Saved Locations
  const locations = await Promise.all([
    prisma.savedLocation.create({
      data: {
        name: 'Varanasi, India',
        latitude: 25.3176,
        longitude: 82.9739,
        timezone: 'Asia/Kolkata',
        isDefault: true,
      },
    }),
    prisma.savedLocation.create({
      data: {
        name: 'New Delhi, India',
        latitude: 28.6139,
        longitude: 77.209,
        timezone: 'Asia/Kolkata',
        isDefault: false,
      },
    }),
    prisma.savedLocation.create({
      data: {
        name: 'Mumbai, India',
        latitude: 19.076,
        longitude: 72.8777,
        timezone: 'Asia/Kolkata',
        isDefault: false,
      },
    }),
  ])

  console.log(`✓ Created ${locations.length} saved locations`)

  // Seed Default Theme
  await prisma.theme.create({
    data: {
      name: 'Sanatana Orange',
      colors: {
        primary: '234 88 12',
        secondary: '147 51 234',
        accent: '236 72 153',
        background: '254 252 248',
        foreground: '28 25 23',
        muted: '250 245 235',
        mutedForeground: '120 113 108',
        card: '255 255 255',
        border: '231 229 228',
      },
      isActive: true,
    },
  })

  console.log('✓ Created default theme')

  console.log('✅ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
