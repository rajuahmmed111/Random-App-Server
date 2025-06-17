import type { RoadmapItem } from "@prisma/client"
import type {
  CreateRoadmapItemData,
  FilterOptions,
  PaginationOptions,
  SortOptions,
  UpdateRoadmapItemData,
} from "./roadmap.interface"
import prisma from "../../db/prisma"
import { generateUniqueTitle, getRandomTemplate, getRandomTemplates, type ItemTemplate } from "./roadmap.templates"

export const getAllRoadmapItems = async (
  filters: FilterOptions,
  pagination: PaginationOptions,
  sort: SortOptions
) => {
  const { page, limit } = pagination
  const skip = (page - 1) * limit

  const where: any = {}

  if (filters.status) where.status = filters.status
  if (filters.category) where.category = filters.category
  if (filters.priority) where.priority = filters.priority
  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
    ]
  }

  const orderBy: any = {}

  // Fallback: Prisma can't sort by vote count directly, so sort by createdAt
  if (["title", "createdAt", "updatedAt", "priority", "category", "status"].includes(sort.sortBy)) {
    orderBy[sort.sortBy] = sort.sortOrder
  } else {
    // Default fallback
    orderBy["createdAt"] = "desc"
  }

  const [items, total] = await Promise.all([
    prisma.roadmapItem.findMany({
      where,
      include: {
        votes: true,
        comments: {
          include: {
            user: {
              select: { id: true, username: true },
            },
          },
        },
        _count: {
          select: {
            votes: true,
            comments: true,
          },
        },
      },
      orderBy,
      skip,
      take: limit,
    }),
    prisma.roadmapItem.count({ where }),
  ])

  const enrichedItems = items
    .map((item) => ({
      ...item,
      voteCount: item._count.votes,
      commentCount: item._count.comments,
    }))
    // manually sort by voteCount if requested
    .sort((a, b) => {
      if (sort.sortBy === "upvotes") {
        return sort.sortOrder === "asc"
          ? a.voteCount - b.voteCount
          : b.voteCount - a.voteCount
      }
      return 0 // already sorted by Prisma otherwise
    })

  return {
    items: enrichedItems,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  }
}



export const getRoadmapItemById = async (id: string, userId?: string) => {
  const item = await prisma.roadmapItem.findUnique({
    where: { id },
    include: {
      votes: userId
        ? {
            where: { userId },
          }
        : true,
      comments: {
        include: {
          user: {
            select: { id: true, username: true },
          },
          replies: {
            include: {
              user: {
                select: { id: true, username: true },
              },
            },
          },
        },
        where: { parentId: null },
      },
      _count: {
        select: {
          votes: true,
          comments: true,
        },
      },
    },
  })

  if (!item) return null

  return {
    ...item,
    voteCount: item._count.votes,
    commentCount: item._count.comments,
    hasVoted: userId ? item.votes.length > 0 : false,
  }
}

export const createRoadmapItem = async (data: CreateRoadmapItemData): Promise<RoadmapItem> => {
  return await prisma.roadmapItem.create({ data })
}

export const updateRoadmapItem = async (id: string, data: UpdateRoadmapItemData): Promise<RoadmapItem | null> => {
  try {
    return await prisma.roadmapItem.update({
      where: { id },
      data,
    })
  } catch (error) {
    return null
  }
}

export const deleteRoadmapItem = async (id: string): Promise<void> => {
  await prisma.roadmapItem.delete({
    where: { id },
  })
}

// Random item creation functions
export const createRandomRoadmapItem = async (): Promise<RoadmapItem> => {
  const template = getRandomTemplate()
  const uniqueTitle = generateUniqueTitle(template.title)

  return await createRoadmapItem({
    title: uniqueTitle,
    description: template.description,
    category: template.category as any,
    priority: template.priority as any,
    status: "PLANNED",
  })
}

export const createBulkRandomItems = async (count: number): Promise<{ success: RoadmapItem[]; errors: string[] }> => {
  const templates = getRandomTemplates(count)
  const success: RoadmapItem[] = []
  const errors: string[] = []

  for (const template of templates) {
    try {
      const uniqueTitle = generateUniqueTitle(template.title)
      const item = await createRoadmapItem({
        title: uniqueTitle,
        description: template.description,
        category: template.category as any,
        priority: template.priority as any,
        status: "PLANNED",
      })
      success.push(item)
    } catch (error: any) {
      errors.push(`Failed to create ${template.title}: ${error.message}`)
    }
  }

  return { success, errors }
}

export const createDemoItems = async (): Promise<{ success: RoadmapItem[]; errors: string[] }> => {
  const demoTemplates: ItemTemplate[] = [
    {
      title: "Dark Mode Support",
      description: "Add comprehensive dark mode theme across the entire application with system preference detection",
      category: "UI_UX",
      priority: "HIGH",
    },
    {
      title: "Mobile App Development",
      description: "Develop native mobile applications for iOS and Android with full feature parity",
      category: "MOBILE",
      priority: "HIGH",
    },
    {
      title: "Advanced Analytics",
      description: "Implement detailed analytics dashboard with custom reports and data visualization",
      category: "FEATURES",
      priority: "MEDIUM",
    },
    {
      title: "API Security Enhancement",
      description: "Add intelligent rate limiting and advanced security measures for API endpoints",
      category: "SECURITY",
      priority: "CRITICAL",
    },
    {
      title: "Real-time Collaboration",
      description: "Enable team workspaces with role-based permissions and real-time collaboration features",
      category: "FEATURES",
      priority: "MEDIUM",
    },
  ]

  const success: RoadmapItem[] = []
  const errors: string[] = []
  const statuses = ["PLANNED", "IN_PROGRESS", "COMPLETED", "PLANNED", "IN_PROGRESS"]

  for (let i = 0; i < demoTemplates.length; i++) {
    const template = demoTemplates[i]
    try {
      const uniqueTitle = generateUniqueTitle(template.title)
      const item = await createRoadmapItem({
        title: uniqueTitle,
        description: template.description,
        category: template.category as any,
        priority: template.priority as any,
        status: statuses[i] as any,
      })
      success.push(item)
    } catch (error: any) {
      errors.push(`Failed to create ${template.title}: ${error.message}`)
    }
  }

  return { success, errors }
}
