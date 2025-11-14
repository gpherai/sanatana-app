// Database seed script
import {
  PrismaClient,
  EventType,
  RecurrenceType,
  EventSource,
  LunarType,
  Paksha,
  CalendarView,
} from '@prisma/client'
import { EVENT_CATEGORIES } from '../src/config/categories'
import { generateDailyAstronomyForYear, type DailyAstronomyData } from '../src/lib/moon-calculator'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Use transaction for atomic operations
  await prisma.$transaction(async (tx) => {
    // 🗑️ CLEANUP: Verwijder alle bestaande data
    console.log('🗑️  Cleaning up existing data...')
    await tx.eventOccurrence.deleteMany({})
    await tx.event.deleteMany({})
    await tx.lunarEvent.deleteMany({})
    await tx.dailyAstronomy.deleteMany({})
    await tx.savedLocation.deleteMany({})
    console.log('✅ Existing data cleared')

    // Seed Event Categories
    console.log('📦 Seeding event categories...')
    for (const category of EVENT_CATEGORIES) {
      await tx.eventCategory.upsert({
        where: { name: category.name },
        update: {},
        create: {
          name: category.name,
          description: category.description,
          icon: category.icon,
        },
      })
    }
    console.log('✅ Event categories seeded')

    // 🏠 Seed Saved Locations
    console.log('\n🏠 Seeding saved locations...')

    const location1 = await tx.savedLocation.create({
      data: {
        name: 'Mijn Huis',
        lat: 52.0704978,
        lon: 4.3006999,
        isPrimary: true,
      },
    })

    const location2 = await tx.savedLocation.create({
      data: {
        name: 'Moeder',
        lat: 52.065576,
        lon: 4.299874,
        isPrimary: false,
      },
    })

    console.log('✅ Saved locations created')

    // ⚙️ Seed User Preferences (default)
    console.log('\n⚙️ Seeding user preferences...')
    await tx.userPreference.upsert({
      where: { id: 1 },
      update: {},
      create: {
        currentTheme: 'spiritual-minimal',
        defaultView: CalendarView.month,
        weekStartsOn: 0,
        visibleTypes: [
          EventType.FESTIVAL,
          EventType.PUJA,
          EventType.SPECIAL_DAY,
          EventType.EKADASHI,
        ],
        visibleCategories: [],
        timezone: 'Europe/Amsterdam',
        notificationsEnabled: false,
        notificationDaysBefore: 1,
        activeLocationId: location1.id, // Default to "Mijn Huis"
      },
    })
    console.log('✅ User preferences seeded')

    // 🌙 Seed Daily Astronomy Data for Both Locations
    // For each location: Rest of 2025 + Full 2026 + Full 2027
    const locations = [location1, location2]

    for (const location of locations) {
      console.log(
        `\n🌙 Generating astronomy data for "${location.name}" (${location.lat}°N, ${location.lon}°E)...`
      )

      // Calculate remaining days in 2025 (from today onwards)
      const today = new Date()
      const currentYear = today.getFullYear()
      const startYear = currentYear === 2025 ? currentYear : 2025

      const allAstronomyData: DailyAstronomyData[] = []

      // Generate for 2025 (rest of year)
      if (startYear === 2025) {
        console.log(`   Generating 2025 (from ${today.toISOString().split('T')[0]})...`)
        const astronomy2025 = generateDailyAstronomyForYear(2025, location.lat, location.lon)
        // Filter from today onwards
        const filtered2025 = astronomy2025.filter((day) => day.date >= today)
        console.log(`   Generated ${filtered2025.length} entries for rest of 2025`)
        allAstronomyData.push(...filtered2025)
      }

      // Generate for 2026 (full year)
      console.log('   Generating 2026 (full year)...')
      const astronomy2026 = generateDailyAstronomyForYear(2026, location.lat, location.lon)
      console.log(`   Generated ${astronomy2026.length} entries for 2026`)
      allAstronomyData.push(...astronomy2026)

      // Generate for 2027 (full year)
      console.log('   Generating 2027 (full year)...')
      const astronomy2027 = generateDailyAstronomyForYear(2027, location.lat, location.lon)
      console.log(`   Generated ${astronomy2027.length} entries for 2027`)
      allAstronomyData.push(...astronomy2027)

      // Insert all entries for this location
      console.log(`   Inserting ${allAstronomyData.length} entries into database...`)
      await tx.dailyAstronomy.createMany({
        data: allAstronomyData.map((data) => ({
          date: data.date,
          locationId: location.id,
          percentageVisible: data.percentageVisible,
          isWaxing: data.isWaxing,
          phase: data.phase,
          sunrise: data.sunrise,
          sunset: data.sunset,
          moonrise: data.moonrise,
          moonset: data.moonset,
        })),
      })
      console.log(`   ✅ Astronomy data seeded for "${location.name}"`)
    }

    console.log('\n✅ All astronomy data seeded for both locations')

    // Seed enkele voorbeeld events
    console.log('\n📅 Seeding voorbeeld events...')

    // Haal alle categorieën op voor makkelijke referentie
    const categories = await tx.eventCategory.findMany()
    const categoryMap = Object.fromEntries(categories.map((cat) => [cat.name, cat]))

    // === SEPTEMBER 2025 EVENTS (Navaratri - al geweest maar voor volledigheid) ===

    // Navaratri Dag 1-9 (22 september - 30 september 2025)
    const durgaCategory = categoryMap['Durga']
    if (durgaCategory) {
      for (let day = 1; day <= 9; day++) {
        const navaratriDay = await tx.event.create({
          data: {
            name: `Navaratri Dag ${day}`,
            description: `Dag ${day} van het negen-nachten festival ter ere van Godin Durga`,
            type: EventType.FESTIVAL,
            categoryId: durgaCategory.id,
            isRecurring: true,
            recurrenceType: RecurrenceType.LUNAR,
            source: EventSource.MANUAL,
            importance: 8,
            tags: ['festival', 'durga', 'navaratri'],
          },
        })
        await tx.eventOccurrence.create({
          data: {
            eventId: navaratriDay.id,
            date: new Date(Date.UTC(2025, 8, 21 + day)), // 22 sept = day 1, dus 21 + 1
            paksha: Paksha.Shukla,
            maas: 'Ashwin',
          },
        })
      }
    }

    // === OKTOBER 2025 EVENTS (na 4 oktober) ===

    // Dussehra (Vijayadashami) - 2 oktober 2025
    if (durgaCategory) {
      const dussehra = await tx.event.create({
        data: {
          name: 'Dussehra (Vijayadashami)',
          description: "Overwinning van goed over kwaad - viert Heer Rama's overwinning op Ravana",
          type: EventType.FESTIVAL,
          categoryId: durgaCategory.id,
          isRecurring: true,
          recurrenceType: RecurrenceType.LUNAR,
          source: EventSource.MANUAL,
          importance: 10,
          tags: ['festival', 'durga', 'rama', 'belangrijk'],
        },
      })
      await tx.eventOccurrence.create({
        data: {
          eventId: dussehra.id,
          date: new Date(Date.UTC(2025, 9, 2)), // 2 oktober
          tithi: 'Dashami',
          paksha: Paksha.Shukla,
          maas: 'Ashwin',
        },
      })
    }

    // Sharad Purnima (6 oktober 2025)
    const deviCategory = categoryMap['Devi']
    if (deviCategory) {
      const sharadPurnima = await tx.event.create({
        data: {
          name: 'Sharad Purnima',
          description: 'Oogstfestival op de volle maan nacht van de herfst',
          type: EventType.FESTIVAL,
          categoryId: deviCategory.id,
          isRecurring: true,
          recurrenceType: RecurrenceType.LUNAR,
          source: EventSource.MANUAL,
          importance: 7,
          tags: ['festival', 'volle maan', 'oogst'],
        },
      })
      await tx.eventOccurrence.create({
        data: {
          eventId: sharadPurnima.id,
          date: new Date(Date.UTC(2025, 9, 6)), // 6 oktober
          tithi: 'Purnima',
          paksha: Paksha.Shukla,
          maas: 'Ashwin',
        },
      })
    }

    // Karva Chauth (9 oktober 2025)
    if (deviCategory) {
      const karvaChauth = await tx.event.create({
        data: {
          name: 'Karva Chauth',
          description:
            'Festival waarbij getrouwde vrouwen vasten voor het welzijn van hun echtgenoten',
          type: EventType.VRATAM,
          categoryId: deviCategory.id,
          isRecurring: true,
          recurrenceType: RecurrenceType.LUNAR,
          source: EventSource.MANUAL,
          importance: 6,
          tags: ['vratam', 'vasten', 'huwelijk'],
        },
      })
      await tx.eventOccurrence.create({
        data: {
          eventId: karvaChauth.id,
          date: new Date(Date.UTC(2025, 9, 9)), // 9 oktober
          tithi: 'Chaturthi',
          paksha: Paksha.Krishna,
          maas: 'Kartik',
        },
      })
    }

    // Diwali (20 oktober 2025)
    const krishnaCategory = categoryMap['Krishna']
    if (krishnaCategory) {
      const diwali = await tx.event.create({
        data: {
          name: 'Diwali (Deepavali)',
          description: 'Festival van Lichten - viert de terugkeer van Heer Rama naar Ayodhya',
          type: EventType.FESTIVAL,
          categoryId: krishnaCategory.id,
          isRecurring: true,
          recurrenceType: RecurrenceType.LUNAR,
          source: EventSource.MANUAL,
          importance: 10,
          tags: ['festival', 'diwali', 'belangrijk', 'lichten'],
        },
      })
      await tx.eventOccurrence.create({
        data: {
          eventId: diwali.id,
          date: new Date(Date.UTC(2025, 9, 20)), // 20 oktober
          tithi: 'Amavasya',
          paksha: Paksha.Krishna,
          maas: 'Kartik',
        },
      })
    }

    // Govardhan Puja (21 oktober 2025)
    if (krishnaCategory) {
      const govardhanPuja = await tx.event.create({
        data: {
          name: 'Govardhan Puja (Annakut)',
          description: 'Viert Heer Krishna die de Govardhan berg optilt',
          type: EventType.PUJA,
          categoryId: krishnaCategory.id,
          isRecurring: true,
          recurrenceType: RecurrenceType.LUNAR,
          source: EventSource.MANUAL,
          importance: 8,
          tags: ['puja', 'krishna', 'diwali'],
        },
      })
      await tx.eventOccurrence.create({
        data: {
          eventId: govardhanPuja.id,
          date: new Date(Date.UTC(2025, 9, 21)), // 21 oktober
          tithi: 'Pratipada',
          paksha: Paksha.Shukla,
          maas: 'Kartik',
        },
      })
    }

    // Bhai Dooj (22 oktober 2025)
    const generalCategory = categoryMap['General']
    if (generalCategory) {
      const bhaiDooj = await tx.event.create({
        data: {
          name: 'Bhai Dooj (Bhau Beej)',
          description: 'Viert de band tussen broers en zussen',
          type: EventType.FESTIVAL,
          categoryId: generalCategory.id,
          isRecurring: true,
          recurrenceType: RecurrenceType.LUNAR,
          source: EventSource.MANUAL,
          importance: 6,
          tags: ['festival', 'familie', 'broers en zussen'],
        },
      })
      await tx.eventOccurrence.create({
        data: {
          eventId: bhaiDooj.id,
          date: new Date(Date.UTC(2025, 9, 22)), // 22 oktober
          tithi: 'Dwitiya',
          paksha: Paksha.Shukla,
          maas: 'Kartik',
        },
      })
    }

    // === NOVEMBER 2025 EVENTS ===

    // Chhath Puja (30 oktober - 2 november 2025, dag 4 = hoogtepunt)
    if (deviCategory) {
      const chhathPuja = await tx.event.create({
        data: {
          name: 'Chhath Puja',
          description: 'Vier dagen durend festival ter ere van de Zonnegod Surya',
          type: EventType.PUJA,
          categoryId: deviCategory.id,
          isRecurring: true,
          recurrenceType: RecurrenceType.LUNAR,
          source: EventSource.MANUAL,
          importance: 8,
          tags: ['puja', 'surya', 'zonneaanbidding'],
        },
      })
      await tx.eventOccurrence.create({
        data: {
          eventId: chhathPuja.id,
          date: new Date(Date.UTC(2025, 10, 2)), // 2 november (hoogtepunt)
          paksha: Paksha.Shukla,
          maas: 'Kartik',
        },
      })
    }

    // Tulsi Vivah (13 november 2025)
    if (krishnaCategory) {
      const tulsiVivah = await tx.event.create({
        data: {
          name: 'Tulsi Vivah',
          description: 'Ceremoniële huwelijk van de Tulsi plant met Heer Vishnu',
          type: EventType.SPECIAL_DAY,
          categoryId: krishnaCategory.id,
          isRecurring: true,
          recurrenceType: RecurrenceType.LUNAR,
          source: EventSource.MANUAL,
          importance: 6,
          tags: ['special day', 'vishnu', 'tulsi'],
        },
      })
      await tx.eventOccurrence.create({
        data: {
          eventId: tulsiVivah.id,
          date: new Date(Date.UTC(2025, 10, 13)), // 13 november
          tithi: 'Ekadashi',
          paksha: Paksha.Shukla,
          maas: 'Kartik',
        },
      })
    }

    // === DECEMBER 2025 EVENTS ===

    // Vivah Panchami (6 december 2025)
    const ramaCategory = categoryMap['Rama']
    if (ramaCategory) {
      const vivahPanchami = await tx.event.create({
        data: {
          name: 'Vivah Panchami',
          description: 'Viert het huwelijk van Heer Rama en Devi Sita',
          type: EventType.SPECIAL_DAY,
          categoryId: ramaCategory.id,
          isRecurring: true,
          recurrenceType: RecurrenceType.LUNAR,
          source: EventSource.MANUAL,
          importance: 7,
          tags: ['special day', 'rama', 'sita', 'huwelijk'],
        },
      })
      await tx.eventOccurrence.create({
        data: {
          eventId: vivahPanchami.id,
          date: new Date(Date.UTC(2025, 11, 6)), // 6 december
          tithi: 'Panchami',
          paksha: Paksha.Shukla,
          maas: 'Margashirsha',
        },
      })
    }

    // Gita Jayanti (11 december 2025)
    if (krishnaCategory) {
      const gitaJayanti = await tx.event.create({
        data: {
          name: 'Gita Jayanti',
          description: 'Viering van de dag waarop Heer Krishna de Bhagavad Gita aan Arjuna sprak',
          type: EventType.SPECIAL_DAY,
          categoryId: krishnaCategory.id,
          isRecurring: true,
          recurrenceType: RecurrenceType.LUNAR,
          source: EventSource.MANUAL,
          importance: 9,
          tags: ['special day', 'krishna', 'bhagavad gita'],
        },
      })
      await tx.eventOccurrence.create({
        data: {
          eventId: gitaJayanti.id,
          date: new Date(Date.UTC(2025, 11, 11)), // 11 december
          tithi: 'Ekadashi',
          paksha: Paksha.Shukla,
          maas: 'Margashirsha',
        },
      })
    }

    // Seed lunar events voor 2025 (na 4 oktober)
    console.log('🌙 Seeding lunar events...')

    const lunarEvents2025 = [
      // Oktober 2025
      { year: 2025, month: 9, day: 6, type: LunarType.PURNIMA, tithi: 'Purnima' }, // Sharad Purnima
      { year: 2025, month: 9, day: 21, type: LunarType.AMAVASYA, tithi: 'Amavasya' }, // Diwali
      // November 2025
      { year: 2025, month: 10, day: 5, type: LunarType.PURNIMA, tithi: 'Purnima' },
      { year: 2025, month: 10, day: 20, type: LunarType.AMAVASYA, tithi: 'Amavasya' },
      // December 2025
      { year: 2025, month: 11, day: 4, type: LunarType.PURNIMA, tithi: 'Purnima' },
      { year: 2025, month: 11, day: 20, type: LunarType.AMAVASYA, tithi: 'Amavasya' },
    ]

    for (const lunarEvent of lunarEvents2025) {
      await tx.lunarEvent.create({
        data: {
          date: new Date(Date.UTC(lunarEvent.year, lunarEvent.month, lunarEvent.day)),
          type: lunarEvent.type,
          tithi: lunarEvent.tithi,
        },
      })
    }
    console.log('✅ Lunar events seeded')
  })

  console.log('🎉 Database seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
