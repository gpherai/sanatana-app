/**
 * Category Repository
 * Database operations for categories
 */

import { BaseRepository } from '@/core/database/base.repository'
import { prisma } from '@/core/database/prisma'

type Category = any

export class CategoryRepository extends BaseRepository<Category> {
  protected model = prisma.category

  async findByName(name: string): Promise<Category | null> {
    return await this.model.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive'
        }
      }
    })
  }

  async findAllWithEventCount(): Promise<unknown[]> {
    return await this.model.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { events: true }
        }
      }
    })
  }

  async findByIdWithEventCount(id: number): Promise<unknown | null> {
    return await this.model.findUnique({
      where: { id },
      include: {
        _count: {
          select: { events: true }
        }
      }
    })
  }

  async searchByName(query: string): Promise<Category[]> {
    return await this.model.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive'
        }
      },
      orderBy: { name: 'asc' }
    })
  }
}

export const categoryRepository = new CategoryRepository()
