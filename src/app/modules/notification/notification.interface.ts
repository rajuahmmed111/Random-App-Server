import type { NotificationType } from "@prisma/client"

export interface CreateNotificationData {
  type: NotificationType
  title: string
  message: string
  receiverId: string
  senderId?: string
  itemId?: string
  commentId?: string
  metadata?: any
}

export interface NotificationResponse {
  id: string
  type: NotificationType
  title: string
  message: string
  isRead: boolean
  createdAt: string
  sender?: {
    id: string
    username: string
    avatar?: string
  }
  item?: {
    id: string
    title: string
  }
  comment?: {
    id: string
    content: string
  }
  metadata?: any
}

export interface NotificationFilters {
  isRead?: boolean
  type?: NotificationType
}

export interface PaginationOptions {
  page: number
  limit: number
}
