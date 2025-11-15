/**
 * Base Repository Pattern
 * Provides common CRUD operations for all repositories
 */

export interface BaseEntity {
  id: number
  createdAt: Date
  updatedAt: Date
}

export interface FindManyOptions<T> {
  where?: Partial<T>
  orderBy?: Record<string, 'asc' | 'desc'>
  skip?: number
  take?: number
}

export abstract class BaseRepository<T extends BaseEntity> {
  protected abstract model: any

  async findById(id: number): Promise<T | null> {
    return await this.model.findUnique({
      where: { id }
    })
  }

  async findMany(options: FindManyOptions<T> = {}): Promise<T[]> {
    return await this.model.findMany({
      where: options.where,
      orderBy: options.orderBy,
      skip: options.skip,
      take: options.take
    })
  }

  async findFirst(where: Partial<T>): Promise<T | null> {
    return await this.model.findFirst({ where })
  }

  async create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    return await this.model.create({ data })
  }

  async update(id: number, data: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>): Promise<T> {
    return await this.model.update({
      where: { id },
      data
    })
  }

  async delete(id: number): Promise<T> {
    return await this.model.delete({
      where: { id }
    })
  }

  async count(where?: Partial<T>): Promise<number> {
    return await this.model.count({ where })
  }

  async exists(where: Partial<T>): Promise<boolean> {
    const count = await this.model.count({ where })
    return count > 0
  }

  async deleteMany(where: Partial<T>): Promise<{ count: number }> {
    return await this.model.deleteMany({ where })
  }
}
