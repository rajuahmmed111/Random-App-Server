export interface CreateCommentData {
  content: string
  userId: string
  itemId: string
  parentId?: string | null
}

export interface UpdateCommentData {
  content: string
}

export interface PaginationOptions {
  page: number
  limit: number
}

export interface CommentResponse {
  id: string
  content: string
  userId: string
  itemId: number
  parentId?: string | null
  createdAt: Date
  updatedAt: Date
  user: {
    id: string
    username: string
    avatar?: string | null
  }
  replies?: CommentResponse[]
}
