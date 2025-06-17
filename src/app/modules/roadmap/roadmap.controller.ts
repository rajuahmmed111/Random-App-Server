import type { Request, Response } from "express"
import { AppError } from "../../../error/AppError"
import {
  createRoadmapItem,
  deleteRoadmapItem,
  getAllRoadmapItems,
  getRoadmapItemById,
  updateRoadmapItem,
  // ✅ NEW: Random item services
  createRandomRoadmapItem,
  createBulkRandomItems,
  createDemoItems,
} from "./roadmap.service"
import { getVoteCount, hasUserVoted } from "../vote/vote.service"
import { getCommentCountByItemId } from "../comment/comment.service"
import { randomItemTemplates } from "./roadmap.templates"

export const getAllItems = async (req: Request, res: Response): Promise<void> => {
  const { status, category, priority, search, sortBy = "upvotes", sortOrder = "desc", page = 1, limit = 50 } = req.query

  const userId = (req as any).user?.id as string | undefined

  const filters = {
    status: status as string | undefined,
    category: category as string | undefined,
    priority: priority as string | undefined,
    search: search as string | undefined,
  }

  const pagination = {
    page: Number(page),
    limit: Number(limit),
  }

  const sort = {
    sortBy: sortBy as string,
    sortOrder: sortOrder as "asc" | "desc",
  }

  const result = await getAllRoadmapItems(filters, pagination, sort)

  const transformedItems = await Promise.all(
    result.items.map(async (item) => {
      const voteCount = await getVoteCount(item.id)
      const commentCount = await getCommentCountByItemId(item.id)
      const hasVoted = userId ? await hasUserVoted(userId, item.id) : false

      return {
        id: item.id,
        title: item.title,
        description: item.description,
        status: item.status,
        category: item.category,
        priority: item.priority,
        upvotes: voteCount,
        createdAt: item.createdAt.toISOString(),
        commentCount,
        hasVoted,
      }
    }),
  )

  res.status(200).json({
    success: true,
    statusCode: 200,
    data: {
      items: transformedItems,
      pagination: result.pagination,
    },
    message: "Roadmap items retrieved successfully",
  })
}

export const getItemById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params
  const userId = (req as any).user?.id

  const item = await getRoadmapItemById(id)
  if (!item) {
    throw new AppError("Roadmap item not found", 404)
  }

  const voteCount = await getVoteCount(item.id)
  const commentCount = await getCommentCountByItemId(item.id)
  const hasVoted = userId ? await hasUserVoted(userId, item.id) : false

  const transformedItem = {
    id: item.id,
    title: item.title,
    description: item.description,
    status: item.status,
    category: item.category,
    priority: item.priority,
    upvotes: voteCount,
    createdAt: item.createdAt.toISOString(),
    commentCount,
    hasVoted,
  }

  res.status(200).json({
    success: true,
    statusCode: 200,
    data: { item: transformedItem },
    message: "Roadmap item retrieved successfully",
  })
}

export const createItem = async (req: Request, res: Response): Promise<void> => {
  const { title, description, status, category, priority } = req.body

  const item = await createRoadmapItem({
    title,
    description,
    status,
    category,
    priority,
  })

  const transformedItem = {
    id: item.id,
    title: item.title,
    description: item.description,
    status: item.status,
    category: item.category,
    priority: item.priority,
    upvotes: 0,
    createdAt: item.createdAt.toISOString(),
    commentCount: 0,
    hasVoted: false,
  }

  res.status(201).json({
    success: true,
    statusCode: 201,
    data: { item: transformedItem },
    message: "Roadmap item created successfully",
  })
}

export const updateItem = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params
  const updateData = req.body

  const item = await updateRoadmapItem(id, updateData)
  if (!item) {
    throw new AppError("Roadmap item not found", 404)
  }

  const voteCount = await getVoteCount(item.id)
  const commentCount = await getCommentCountByItemId(item.id)

  const transformedItem = {
    id: item.id,
    title: item.title,
    description: item.description,
    status: item.status,
    category: item.category,
    priority: item.priority,
    upvotes: voteCount,
    createdAt: item.createdAt.toISOString(),
    commentCount,
    hasVoted: false,
  }

  res.status(200).json({
    success: true,
    statusCode: 200,
    data: { item: transformedItem },
    message: "Roadmap item updated successfully",
  })
}

export const deleteItem = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params

  await deleteRoadmapItem(id)

  res.status(200).json({
    success: true,
    statusCode: 200,
    data: null,
    message: "Roadmap item deleted successfully",
  })
}

// ✅ NEW: Random item controllers
export const createRandomItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const item = await createRandomRoadmapItem()

    const transformedItem = {
      id: item.id,
      title: item.title,
      description: item.description,
      status: item.status,
      category: item.category,
      priority: item.priority,
      upvotes: 0,
      createdAt: item.createdAt.toISOString(),
      commentCount: 0,
      hasVoted: false,
    }

    res.status(201).json({
      success: true,
      statusCode: 201,
      data: { item: transformedItem },
      message: "Random roadmap item created successfully",
    })
  } catch (error: any) {
    throw new AppError(error.message || "Failed to create random item", 500)
  }
}

export const createBulkRandom = async (req: Request, res: Response): Promise<void> => {
  const { count = 5 } = req.body

  if (count < 1 || count > 50) {
    throw new AppError("Count must be between 1 and 50", 400)
  }

  try {
    const result = await createBulkRandomItems(count)

    const transformedItems = result.success.map((item: any) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      status: item.status,
      category: item.category,
      priority: item.priority,
      upvotes: 0,
      createdAt: item.createdAt.toISOString(),
      commentCount: 0,
      hasVoted: false,
    }))

    res.status(201).json({
      success: true,
      statusCode: 201,
      data: {
        items: transformedItems,
        created: result.success.length,
        errors: result.errors,
      },
      message: `Successfully created ${result.success.length} random items`,
    })
  } catch (error: any) {
    throw new AppError(error.message || "Failed to create bulk random items", 500)
  }
}

export const createDemo = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await createDemoItems()

    const transformedItems = result.success.map((item: any) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      status: item.status,
      category: item.category,
      priority: item.priority,
      upvotes: 0,
      createdAt: item.createdAt.toISOString(),
      commentCount: 0,
      hasVoted: false,
    }))

    res.status(201).json({
      success: true,
      statusCode: 201,
      data: {
        items: transformedItems,
        created: result.success.length,
        errors: result.errors,
      },
      message: `Successfully created ${result.success.length} demo items`,
    })
  } catch (error: any) {
    throw new AppError(error.message || "Failed to create demo items", 500)
  }
}

export const getTemplates = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({
    success: true,
    statusCode: 200,
    data: {
      templates: randomItemTemplates,
      count: randomItemTemplates.length,
    },
    message: "Templates retrieved successfully",
  })
}
