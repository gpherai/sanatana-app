/**
 * Category Types
 * Type definitions for event categories
 */

import { EventType, EventColor } from '@/core/config/constants'

export interface Category {
  id: number
  name: string
  description: string | null
  color: EventColor
  icon: string
  defaultEventType: EventType
  createdAt: Date
  updatedAt: Date
}

export interface CreateCategoryInput {
  name: string
  description?: string
  color: EventColor
  icon: string
  defaultEventType: EventType
}

export interface UpdateCategoryInput extends Partial<CreateCategoryInput> {
  id: number
}

export interface CategoryWithEventCount extends Category {
  _count: {
    events: number
  }
}
