/**
 * Theme Service
 * Business logic for themes
 */

import { prisma } from '@/core/database/prisma'
import { AppError } from '@/core/errors/AppError'
import { CreateThemeInput, UpdateThemeInput } from '../types/theme.types'

export class ThemeService {
  async getThemes() {
    return await prisma.theme.findMany({
      orderBy: { name: 'asc' }
    })
  }

  async getActiveTheme() {
    return await prisma.theme.findFirst({
      where: { isActive: true }
    })
  }

  async getThemeById(id: number) {
    const theme = await prisma.theme.findUnique({
      where: { id }
    })

    if (!theme) {
      throw AppError.notFound('Theme')
    }

    return theme
  }

  async createTheme(input: CreateThemeInput) {
    // If creating as active, deactivate all other themes
    if (input.isActive) {
      await prisma.theme.updateMany({
        where: { isActive: true },
        data: { isActive: false }
      })
    }

    return await prisma.theme.create({
      data: {
        name: input.name,
        colors: input.colors,
        isActive: input.isActive ?? false
      }
    })
  }

  async updateTheme(input: UpdateThemeInput) {
    const { id, ...updateData } = input

    const existingTheme = await prisma.theme.findUnique({
      where: { id }
    })

    if (!existingTheme) {
      throw AppError.notFound('Theme')
    }

    // If setting as active, deactivate all other themes
    if (updateData.isActive === true) {
      await prisma.theme.updateMany({
        where: {
          isActive: true,
          id: { not: id }
        },
        data: { isActive: false }
      })
    }

    return await prisma.theme.update({
      where: { id },
      data: updateData
    })
  }

  async deleteTheme(id: number) {
    const theme = await prisma.theme.findUnique({
      where: { id }
    })

    if (!theme) {
      throw AppError.notFound('Theme')
    }

    if (theme.isActive) {
      throw AppError.unprocessable('Cannot delete active theme. Activate another theme first.')
    }

    return await prisma.theme.delete({
      where: { id }
    })
  }

  async activateTheme(id: number) {
    const theme = await prisma.theme.findUnique({
      where: { id }
    })

    if (!theme) {
      throw AppError.notFound('Theme')
    }

    // Deactivate all themes
    await prisma.theme.updateMany({
      where: { isActive: true },
      data: { isActive: false }
    })

    // Activate the selected theme
    return await prisma.theme.update({
      where: { id },
      data: { isActive: true }
    })
  }
}

export const themeService = new ThemeService()
