import type { Notification, NotificationType } from "@prisma/client"
import type { CreateNotificationData, NotificationFilters, PaginationOptions } from "./notification.interface"
import prisma from "../../db/prisma"

export const createNotification = async (data: CreateNotificationData): Promise<Notification> => {
  return await prisma.notification.create({
    data,
    include: {
      sender: {
        select: { id: true, username: true, avatar: true },
      },
      item: {
        select: { id: true, title: true },
      },
      comment: {
        select: { id: true, content: true },
      },
    },
  })
}

export const getUserNotifications = async (
  userId: string,
  filters: NotificationFilters = {},
  pagination: PaginationOptions = { page: 1, limit: 20 },
) => {
  const { page, limit } = pagination
  const skip = (page - 1) * limit

  const where: any = {
    receiverId: userId,
  }

  if (filters.isRead !== undefined) {
    where.isRead = filters.isRead
  }

  if (filters.type) {
    where.type = filters.type
  }

  const [notifications, total] = await Promise.all([
    prisma.notification.findMany({
      where,
      include: {
        sender: {
          select: { id: true, username: true, avatar: true },
        },
        item: {
          select: { id: true, title: true },
        },
        comment: {
          select: { id: true, content: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.notification.count({ where }),
  ])

  return {
    notifications,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  }
}

export const markNotificationAsRead = async (notificationId: string, userId: string): Promise<Notification | null> => {
  try {
    return await prisma.notification.update({
      where: {
        id: notificationId,
        receiverId: userId, // Ensure user can only mark their own notifications
      },
      data: { isRead: true },
    })
  } catch (error) {
    return null
  }
}

export const markAllNotificationsAsRead = async (userId: string): Promise<number> => {
  const result = await prisma.notification.updateMany({
    where: {
      receiverId: userId,
      isRead: false,
    },
    data: { isRead: true },
  })

  return result.count
}

export const getUnreadNotificationCount = async (userId: string): Promise<number> => {
  return await prisma.notification.count({
    where: {
      receiverId: userId,
      isRead: false,
    },
  })
}

export const deleteNotification = async (notificationId: string, userId: string): Promise<boolean> => {
  try {
    await prisma.notification.delete({
      where: {
        id: notificationId,
        receiverId: userId,
      },
    })
    return true
  } catch (error) {
    return false
  }
}

// Helper functions for creating specific notification types
export const createCommentNotification = async (
  commentId: string,
  itemId: string,
  senderId: string,
  receiverId: string,
  isReply = false,
): Promise<Notification | null> => {
  // Don't notify if user is commenting on their own item/comment
  if (senderId === receiverId) return null

  const [comment, item, sender] = await Promise.all([
    prisma.comment.findUnique({ where: { id: commentId } }),
    prisma.roadmapItem.findUnique({ where: { id: itemId } }),
    prisma.user.findUnique({ where: { id: senderId } }),
  ])

  if (!comment || !item || !sender) return null

  const type: NotificationType = isReply ? "COMMENT_REPLY" : "ITEM_COMMENT"
  const title = isReply ? "New reply to your comment" : "New comment on your item"
  const message = isReply
    ? `${sender.username} replied to your comment on "${item.title}"`
    : `${sender.username} commented on "${item.title}"`

  return await createNotification({
    type,
    title,
    message,
    senderId,
    receiverId,
    itemId,
    commentId,
    metadata: {
      commentContent: comment.content.slice(0, 100),
      itemTitle: item.title,
    },
  })
}

export const createVoteMilestoneNotification = async (
  itemId: string,
  ownerId: string,
  milestone: number,
): Promise<Notification | null> => {
  const item = await prisma.roadmapItem.findUnique({ where: { id: itemId } })
  if (!item) return null

  return await createNotification({
    type: "VOTE_MILESTONE",
    title: "Vote milestone reached!",
    message: `Your item "${item.title}" has reached ${milestone} votes!`,
    receiverId: ownerId,
    itemId,
    metadata: {
      milestone,
      itemTitle: item.title,
    },
  })
}
