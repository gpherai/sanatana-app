// Quick verification script - check if astronomy data is from SunCalc
import { PrismaClient } from '@prisma/client'
import { calculateMoonPhase, calculateSunTimes } from '../src/lib/moon-calculator'

const prisma = new PrismaClient()

async function verify() {
  console.log('🔍 Verifying daily astronomy data source...\n')

  // Get first location (we need location for sun/moon times)
  const location = await prisma.savedLocation.findFirst()

  if (!location) {
    console.error('❌ No saved location found!')
    await prisma.$disconnect()
    return
  }

  console.log(`📍 Using location: ${location.name} (${location.lat}°N, ${location.lon}°E)\n`)

  // Check a few random dates in 2025
  const testDates = [
    '2025-01-15',
    '2025-06-20',
    '2025-10-11', // Today!
    '2025-12-25',
  ]

  for (const dateStr of testDates) {
    // Get from database
    const dbData = await prisma.dailyAstronomy.findFirst({
      where: {
        date: new Date(dateStr + 'T12:00:00Z'),
        locationId: location.id,
      },
    })

    // Calculate with SunCalc
    const moonPhase = calculateMoonPhase(new Date(dateStr + 'T12:00:00Z'))
    const localDate = new Date(dateStr)
    const sunTimes = calculateSunTimes(localDate, location.lat, location.lon)

    console.log(`📅 ${dateStr}:`)
    console.log(
      `   DB Moon:     ${dbData?.percentageVisible}% ${dbData?.isWaxing ? 'waxing' : 'waning'} ${dbData?.phase || 'normal'}`
    )
    console.log(
      `   SunCalc:     ${moonPhase.percentageVisible}% ${moonPhase.isWaxing ? 'waxing' : 'waning'} ${moonPhase.phase || 'normal'}`
    )
    console.log(
      `   Match:       ${dbData?.percentageVisible === moonPhase.percentageVisible ? '✅' : '❌'}`
    )
    console.log(`   DB Sun:      ${dbData?.sunrise} - ${dbData?.sunset}`)
    console.log(`   Calculated:  ${sunTimes.sunrise} - ${sunTimes.sunset}\n`)
  }

  // Count total records
  const total = await prisma.dailyAstronomy.count()
  console.log(`\n📊 Total astronomy records: ${total}`)

  // Check date range
  const oldest = await prisma.dailyAstronomy.findFirst({
    orderBy: { date: 'asc' },
  })
  const newest = await prisma.dailyAstronomy.findFirst({
    orderBy: { date: 'desc' },
  })

  console.log(
    `📅 Date range: ${oldest?.date.toISOString().split('T')[0]} to ${newest?.date.toISOString().split('T')[0]}`
  )

  await prisma.$disconnect()
}

verify().catch(console.error)
