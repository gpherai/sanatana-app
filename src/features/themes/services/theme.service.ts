/**
 * Theme Service
 * Business logic for themes
 */

import { Prisma } from '@prisma/client'
import { prisma } from '@/core/database/prisma'
import { AppError } from '@/core/errors/AppError'
import { CreateThemeInput, UpdateThemeInput } from '../types/theme.types'

export class ThemeService {
  async getThemes() {
    try {
      return await prisma.theme.findMany({
        orderBy: { name: 'asc' }
      })
    } catch {
      throw AppError.internal('Failed to fetch themes')
    }
  }

  async getActiveTheme() {
    try {
      return await prisma.theme.findFirst({
        where: { isActive: true }
      })
    } catch {
      throw AppError.internal('Failed to fetch active theme')
    }
  }

  async getThemeById(id: number) {
    try {
      const theme = await prisma.theme.findUnique({
        where: { id }
      })

      if (!theme) {
        throw AppError.notFound('Theme')
      }

      return theme
    } catch (error) {
      if (error instanceof AppError) throw error
      throw AppError.internal('Failed to fetch theme')
    }
  }

  async createTheme(input: CreateThemeInput) {
    try {
      // Use transaction to ensure atomicity
      return await prisma.$transaction(async (tx) => {
        // If creating as active, deactivate all other themes
        if (input.isActive) {
          await tx.theme.updateMany({
            where: { isActive: true },
            data: { isActive: false }
          })
        }

        return await tx.theme.create({
          data: {
            name: input.name,
            colors: input.colors as Prisma.InputJsonObject,
            darkColors: input.darkColors as Prisma.InputJsonObject | undefined,
            isActive: input.isActive ?? false
          }
        })
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw AppError.conflict('A theme with this name already exists')
        }
      }
      throw AppError.internal('Failed to create theme')
    }
  }

  async updateTheme(input: UpdateThemeInput) {
    const { id, ...updateData } = input

    try {
      // Use transaction to ensure atomicity
      return await prisma.$transaction(async (tx) => {
        const existingTheme = await tx.theme.findUnique({
          where: { id }
        })

        if (!existingTheme) {
          throw AppError.notFound('Theme')
        }

        // If setting as active, deactivate all other themes
        if (updateData.isActive === true) {
          await tx.theme.updateMany({
            where: {
              isActive: true,
              id: { not: id }
            },
            data: { isActive: false }
          })
        }

        // Build update payload with proper types
        const updatePayload: Prisma.ThemeUpdateInput = {
          ...(updateData.name && { name: updateData.name }),
          ...(updateData.colors && { colors: updateData.colors as Prisma.InputJsonObject }),
          ...(updateData.darkColors !== undefined && {
            darkColors: updateData.darkColors as Prisma.InputJsonObject | null
          }),
          ...(updateData.isActive !== undefined && { isActive: updateData.isActive })
        }

        return await tx.theme.update({
          where: { id },
          data: updatePayload
        })
      })
    } catch (error) {
      if (error instanceof AppError) throw error
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw AppError.conflict('A theme with this name already exists')
        }
      }
      throw AppError.internal('Failed to update theme')
    }
  }

  async deleteTheme(id: number) {
    try {
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
    } catch (error) {
      if (error instanceof AppError) throw error
      throw AppError.internal('Failed to delete theme')
    }
  }

  async activateTheme(id: number) {
    try {
      // Use transaction to ensure atomicity
      return await prisma.$transaction(async (tx) => {
        const theme = await tx.theme.findUnique({
          where: { id }
        })

        if (!theme) {
          throw AppError.notFound('Theme')
        }

        // Deactivate all themes
        await tx.theme.updateMany({
          where: { isActive: true },
          data: { isActive: false }
        })

        // Activate the selected theme
        return await tx.theme.update({
          where: { id },
          data: { isActive: true }
        })
      })
    } catch (error) {
      if (error instanceof AppError) throw error
      throw AppError.internal('Failed to activate theme')
    }
  }
}

export const themeService = new ThemeService()
