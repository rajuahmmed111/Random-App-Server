import type { Status, Category, Priority } from "@prisma/client"

export interface CreateRoadmapItemData {
  title: string
  description: string
  status?: Status
  category: Category
  priority?: Priority
}

export interface UpdateRoadmapItemData {
  title?: string
  description?: string
  status?: Status
  category?: Category
  priority?: Priority
}

export interface FilterOptions {
  status?: string
  category?: string
  priority?: string
  search?: string
}

export interface PaginationOptions {
  page: number
  limit: number
}

export interface SortOptions {
  sortBy: string
  sortOrder: "asc" | "desc"
}
