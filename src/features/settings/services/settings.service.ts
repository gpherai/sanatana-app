/**
 * Settings Service
 * Business logic for user preferences and saved locations
 */

import { prisma } from '@/core/database/prisma'
import { AppError } from '@/core/errors/AppError'
import { UpdatePreferencesInput, CreateLocationInput, UpdateLocationInput } from '../types/settings.types'

export class SettingsService {
  // Preferences
  async getPreferences() {
    let prefs = await prisma.userPreferences.findFirst()

    // Create default preferences if none exist
    if (!prefs) {
      prefs = await prisma.userPreferences.create({
        data: {
          defaultView: 'month',
          showLunarInfo: true,
          showHolidays: true,
          notifications: false,
          tempLocation: null
        }
      })
    }

    return prefs
  }

  async updatePreferences(input: UpdatePreferencesInput) {
    const existing = await this.getPreferences()

    return await prisma.userPreferences.update({
      where: { id: existing.id },
      data: input
    })
  }

  async setTempLocation(location: { latitude: number; longitude: number; timezone: string; name: string } | null) {
    const existing = await this.getPreferences()

    return await prisma.userPreferences.update({
      where: { id: existing.id },
      data: { tempLocation: location }
    })
  }

  // Saved Locations
  async getSavedLocations() {
    return await prisma.savedLocation.findMany({
      orderBy: [
        { isDefault: 'desc' },
        { name: 'asc' }
      ]
    })
  }

  async getDefaultLocation() {
    return await prisma.savedLocation.findFirst({
      where: { isDefault: true }
    })
  }

  async getSavedLocationById(id: number) {
    const location = await prisma.savedLocation.findUnique({
      where: { id }
    })

    if (!location) {
      throw AppError.notFound('Saved location')
    }

    return location
  }

  async createSavedLocation(input: CreateLocationInput) {
    // Validate coordinates
    if (input.latitude < -90 || input.latitude > 90) {
      throw AppError.validation('Invalid latitude')
    }
    if (input.longitude < -180 || input.longitude > 180) {
      throw AppError.validation('Invalid longitude')
    }

    // If setting as default, unset other defaults
    if (input.isDefault) {
      await prisma.savedLocation.updateMany({
        where: { isDefault: true },
        data: { isDefault: false }
      })
    }

    return await prisma.savedLocation.create({
      data: {
        latitude: input.latitude,
        longitude: input.longitude,
        timezone: input.timezone,
        name: input.name,
        isDefault: input.isDefault ?? false
      }
    })
  }

  async updateSavedLocation(input: UpdateLocationInput) {
    const { id, ...updateData } = input

    const existing = await prisma.savedLocation.findUnique({
      where: { id }
    })

    if (!existing) {
      throw AppError.notFound('Saved location')
    }

    // Validate coordinates if provided
    if (updateData.latitude !== undefined && (updateData.latitude < -90 || updateData.latitude > 90)) {
      throw AppError.validation('Invalid latitude')
    }
    if (updateData.longitude !== undefined && (updateData.longitude < -180 || updateData.longitude > 180)) {
      throw AppError.validation('Invalid longitude')
    }

    // If setting as default, unset other defaults
    if (updateData.isDefault === true) {
      await prisma.savedLocation.updateMany({
        where: {
          isDefault: true,
          id: { not: id }
        },
        data: { isDefault: false }
      })
    }

    return await prisma.savedLocation.update({
      where: { id },
      data: updateData
    })
  }

  async deleteSavedLocation(id: number) {
    const location = await prisma.savedLocation.findUnique({
      where: { id }
    })

    if (!location) {
      throw AppError.notFound('Saved location')
    }

    return await prisma.savedLocation.delete({
      where: { id }
    })
  }
}

export const settingsService = new SettingsService()
