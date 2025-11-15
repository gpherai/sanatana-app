/**
 * Category Service
 * Business logic for categories
 */

import { AppError } from '@/core/errors/AppError'
import { categoryRepository } from '../repositories/category.repository'
import { eventRepository } from '@/features/events/repositories/event.repository'
import { CreateCategoryInput, UpdateCategoryInput } from '../types/category.types'
import { createCategorySchema, updateCategorySchema } from '../validations/category.schema'

export class CategoryService {
  async getCategoryById(id: number) {
    const category = await categoryRepository.findByIdWithEventCount(id)

    if (!category) {
      throw AppError.notFound('Category')
    }

    return category
  }

  async getCategories() {
    return await categoryRepository.findAllWithEventCount()
  }

  async searchCategories(query: string) {
    if (!query || query.trim().length === 0) {
      return await this.getCategories()
    }

    return await categoryRepository.searchByName(query.trim())
  }

  async createCategory(input: CreateCategoryInput) {
    const validatedData = createCategorySchema.parse(input)

    // Check if category with same name already exists
    const existing = await categoryRepository.findByName(validatedData.name)
    if (existing) {
      throw AppError.conflict('Category with this name already exists')
    }

    const categoryData = {
      ...validatedData,
      description: validatedData.description ?? null
    }

    return await categoryRepository.create(categoryData)
  }

  async updateCategory(input: UpdateCategoryInput) {
    const validatedData = updateCategorySchema.parse(input)
    const { id, ...updateData } = validatedData

    // Check if category exists
    const existingCategory = await categoryRepository.findById(id)
    if (!existingCategory) {
      throw AppError.notFound('Category')
    }

    // Check if new name conflicts with existing category
    if (updateData.name && updateData.name !== existingCategory.name) {
      const nameExists = await categoryRepository.findByName(updateData.name)
      if (nameExists) {
        throw AppError.conflict('Category with this name already exists')
      }
    }

    return await categoryRepository.update(id, updateData)
  }

  async deleteCategory(id: number, deleteEvents: boolean = false) {
    const category = await categoryRepository.findById(id)

    if (!category) {
      throw AppError.notFound('Category')
    }

    // Check if category has events
    const events = await eventRepository.findByCategory(id)

    if (events.length > 0 && !deleteEvents) {
      throw AppError.unprocessable(
        `Cannot delete category with ${events.length} associated events. Set deleteEvents=true to delete events as well.`,
        { eventCount: events.length }
      )
    }

    // Delete associated events if requested
    if (deleteEvents && events.length > 0) {
      await eventRepository.deleteMany({ categoryId: id })
    }

    return await categoryRepository.delete(id)
  }
}

export const categoryService = new CategoryService()
