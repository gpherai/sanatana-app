// TypeScript declarations for suncalc
// Since @types/suncalc doesn't exist, we define our own types

declare module 'suncalc' {
  export interface MoonIllumination {
    fraction: number // Illuminated fraction of the moon (0-1)
    phase: number // Moon phase value (0-1, where 0=new, 0.5=full)
    angle: number // Midpoint angle in radians
  }

  export interface MoonPosition {
    azimuth: number // Moon azimuth in radians
    altitude: number // Moon altitude above the horizon in radians
    distance: number // Distance to moon in kilometers
    parallacticAngle: number // Parallactic angle in radians
  }

  export interface MoonTimes {
    rise: Date | null // Moonrise time
    set: Date | null // Moonset time
    alwaysUp?: boolean // True if moon never sets
    alwaysDown?: boolean // True if moon never rises
  }

  export interface SunPosition {
    azimuth: number // Sun azimuth in radians
    altitude: number // Sun altitude above the horizon in radians
  }

  export interface SunTimes {
    sunrise: Date
    sunriseEnd: Date
    goldenHourEnd: Date
    solarNoon: Date
    goldenHour: Date
    sunsetStart: Date
    sunset: Date
    dusk: Date
    nauticalDusk: Date
    night: Date
    nadir: Date
    nightEnd: Date
    nauticalDawn: Date
    dawn: Date
  }

  /**
   * Calculate moon illumination for a given date
   */
  export function getMoonIllumination(date: Date): MoonIllumination

  /**
   * Calculate moon position for a given date and location
   */
  export function getMoonPosition(date: Date, latitude: number, longitude: number): MoonPosition

  /**
   * Calculate moon rise and set times
   */
  export function getMoonTimes(date: Date, latitude: number, longitude: number): MoonTimes

  /**
   * Calculate sun position for a given date and location
   */
  export function getSunPosition(date: Date, latitude: number, longitude: number): SunPosition

  /**
   * Calculate sun times (sunrise, sunset, etc.)
   */
  export function getTimes(date: Date, latitude: number, longitude: number): SunTimes

  /**
   * Add a custom time to sun times calculation
   */
  export function addTime(angleInDegrees: number, riseName: string, setName: string): void
}
