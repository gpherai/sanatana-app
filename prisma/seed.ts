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
          gradientFrom: '251 146 60', // Light orange
          gradientVia: '249 115 22', // Medium orange
          gradientTo: '234 88 12', // Deep orange
        },
        darkColors: {
          primary: '251 146 60', // Brighter orange for better visibility
          secondary: '168 85 247', // Lighter purple
          accent: '244 114 182', // Lighter pink
          background: '23 23 23', // Deep dark
          foreground: '250 250 250',
          muted: '40 40 40', // Slightly lighter
          mutedForeground: '180 180 180', // Lighter for WCAG AA compliance
          card: '32 32 32', // Slightly lighter card
          cardForeground: '250 250 250',
          border: '70 70 70', // More visible border
          gradientFrom: '234 88 12', // Deep orange
          gradientVia: '194 65 12', // Darker orange
          gradientTo: '154 52 18', // Very dark orange
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
          gradientFrom: '167 139 250', // Light purple
          gradientVia: '139 92 246', // Medium purple
          gradientTo: '124 58 237', // Deep purple
        },
        darkColors: {
          primary: '167 139 250', // Brighter purple for better visibility
          secondary: '244 114 182', // Lighter pink
          accent: '251 146 60', // Lighter orange
          background: '20 15 30', // Deep purple-tinted dark
          foreground: '245 240 255',
          muted: '40 30 55', // Slightly lighter for better differentiation
          mutedForeground: '190 180 210', // Much lighter for WCAG AA compliance (4.5:1+)
          card: '30 22 45', // Lighter card for better depth
          cardForeground: '245 240 255',
          border: '70 55 100', // More visible border
          gradientFrom: '124 58 237', // Deep purple
          gradientVia: '99 46 189', // Darker purple
          gradientTo: '76 29 149', // Very dark purple
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
          gradientFrom: '244 114 182', // Light pink
          gradientVia: '236 72 153', // Medium pink
          gradientTo: '219 39 119', // Deep pink
        },
        darkColors: {
          primary: '244 114 182', // Brighter pink
          secondary: '192 132 252', // Lighter purple
          accent: '253 186 116', // Lighter peach
          background: '30 15 25', // Deep pink-tinted dark
          foreground: '255 240 250',
          muted: '50 30 42', // Lighter muted
          mutedForeground: '200 165 185', // Much lighter for WCAG AA compliance
          card: '42 25 35', // Lighter card
          cardForeground: '255 240 250',
          border: '85 55 72', // More visible border
          gradientFrom: '219 39 119', // Deep pink
          gradientVia: '190 24 93', // Darker pink
          gradientTo: '157 23 77', // Very dark pink
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
          gradientFrom: '74 222 128', // Light green
          gradientVia: '34 197 94', // Medium green
          gradientTo: '22 163 74', // Deep green
        },
        darkColors: {
          primary: '74 222 128', // Brighter green
          secondary: '96 165 250', // Lighter blue
          accent: '252 211 77', // Lighter gold
          background: '15 25 18', // Deep green-tinted dark
          foreground: '240 255 244',
          muted: '30 48 35', // Lighter muted
          mutedForeground: '170 200 180', // Much lighter for WCAG AA compliance
          card: '25 40 28', // Lighter card
          cardForeground: '240 255 244',
          border: '55 85 62', // More visible border
          gradientFrom: '22 163 74', // Deep green
          gradientVia: '21 128 61', // Darker green
          gradientTo: '20 83 45', // Very dark green
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
          gradientFrom: '96 165 250', // Light blue
          gradientVia: '59 130 246', // Medium blue
          gradientTo: '37 99 235', // Deep blue
        },
        darkColors: {
          primary: '96 165 250', // Brighter blue
          secondary: '167 139 250', // Lighter purple
          accent: '34 211 238', // Lighter cyan
          background: '15 20 30', // Deep blue-tinted dark
          foreground: '240 248 255',
          muted: '30 42 58', // Lighter muted
          mutedForeground: '170 185 210', // Much lighter for WCAG AA compliance
          card: '24 35 50', // Lighter card
          cardForeground: '240 248 255',
          border: '55 75 100', // More visible border
          gradientFrom: '37 99 235', // Deep blue
          gradientVia: '29 78 216', // Darker blue
          gradientTo: '30 58 138', // Very dark blue
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
          gradientFrom: '252 211 77', // Light gold
          gradientVia: '251 191 36', // Medium gold
          gradientTo: '245 158 11', // Deep gold
        },
        darkColors: {
          primary: '252 211 77', // Brighter gold
          secondary: '251 146 60', // Lighter orange
          accent: '248 113 113', // Lighter red
          background: '30 25 15', // Deep warm dark
          foreground: '255 250 235',
          muted: '50 42 25', // Lighter muted
          mutedForeground: '200 180 140', // Much lighter for WCAG AA compliance
          card: '42 35 20', // Lighter card
          cardForeground: '255 250 235',
          border: '80 70 42', // More visible border
          gradientFrom: '245 158 11', // Deep gold
          gradientVia: '202 138 4', // Darker gold
          gradientTo: '161 98 7', // Very dark gold
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
