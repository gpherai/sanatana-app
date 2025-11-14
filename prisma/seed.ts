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

  // Seed Themes
  const themes = await Promise.all([
    prisma.theme.create({
      data: {
        name: 'Sanatana Orange',
        colors: {
          primary: '234 88 12', // Warm orange
          secondary: '147 51 234', // Deep purple
          accent: '236 72 153', // Pink
          background: '254 252 248', // Warm off-white
          foreground: '28 25 23',
          muted: '250 245 235',
          mutedForeground: '120 113 108',
          card: '255 255 255',
          cardForeground: '28 25 23',
          border: '231 229 228',
        },
        isActive: true,
      },
    }),
    prisma.theme.create({
      data: {
        name: 'Sacred Purple',
        colors: {
          primary: '124 58 237', // Vibrant purple
          secondary: '236 72 153', // Pink
          accent: '249 115 22', // Orange
          background: '250 245 255', // Soft purple tint
          foreground: '31 25 43',
          muted: '243 232 255',
          mutedForeground: '107 88 138',
          card: '255 255 255',
          cardForeground: '31 25 43',
          border: '233 213 255',
        },
        isActive: false,
      },
    }),
    prisma.theme.create({
      data: {
        name: 'Lotus Pink',
        colors: {
          primary: '236 72 153', // Soft pink
          secondary: '168 85 247', // Purple
          accent: '251 146 60', // Peach
          background: '255 247 251', // Very soft pink
          foreground: '37 23 31',
          muted: '252 231 243',
          mutedForeground: '131 88 115',
          card: '255 255 255',
          cardForeground: '37 23 31',
          border: '251 207 232',
        },
        isActive: false,
      },
    }),
    prisma.theme.create({
      data: {
        name: 'Forest Green',
        colors: {
          primary: '34 197 94', // Fresh green
          secondary: '59 130 246', // Blue
          accent: '251 191 36', // Gold
          background: '247 254 249', // Soft green tint
          foreground: '20 33 25',
          muted: '236 253 243',
          mutedForeground: '74 115 88',
          card: '255 255 255',
          cardForeground: '20 33 25',
          border: '187 247 208',
        },
        isActive: false,
      },
    }),
    prisma.theme.create({
      data: {
        name: 'Ocean Blue',
        colors: {
          primary: '59 130 246', // Sky blue
          secondary: '139 92 246', // Purple
          accent: '14 165 233', // Cyan
          background: '240 249 255', // Soft blue
          foreground: '23 31 43',
          muted: '224 242 254',
          mutedForeground: '71 100 131',
          card: '255 255 255',
          cardForeground: '23 31 43',
          border: '186 230 253',
        },
        isActive: false,
      },
    }),
    prisma.theme.create({
      data: {
        name: 'Sunset Gold',
        colors: {
          primary: '251 191 36', // Vibrant gold
          secondary: '249 115 22', // Orange
          accent: '239 68 68', // Red
          background: '255 251 235', // Warm cream
          foreground: '41 34 20',
          muted: '254 243 199',
          mutedForeground: '133 110 68',
          card: '255 255 255',
          cardForeground: '41 34 20',
          border: '253 224 71',
        },
        isActive: false,
      },
    }),
  ])

  console.log(`✓ Created ${themes.length} themes`)

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
