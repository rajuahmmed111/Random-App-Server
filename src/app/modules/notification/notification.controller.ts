import type { Request, Response } from "express"
import { AppError } from "../../../error/AppError"
import { deleteNotification, getUnreadNotificationCount, getUserNotifications, markAllNotificationsAsRead, markNotificationAsRead } from "./notification.service"

export const getNotifications = async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).user.id
  const { isRead, type, page = 1, limit = 20 } = req.query

  const filters = {
    isRead: isRead === "true" ? true : isRead === "false" ? false : undefined,
    type: type as any,
  }

  const pagination = {
    page: Number(page),
    limit: Number(limit),
  }

  const result = await getUserNotifications(userId, filters, pagination)

  const transformedNotifications = result.notifications.map((notification: any) => ({
    id: notification.id,
    type: notification.type,
    title: notification.title,
    message: notification.message,
    isRead: notification.isRead,
    createdAt: notification.createdAt.toISOString(),
    sender: notification.sender,
    item: notification.item,
    comment: notification.comment,
    metadata: notification.metadata,
  }))

  res.status(200).json({
    success: true,
    statusCode: 200,
    data: {
      notifications: transformedNotifications,
      pagination: result.pagination,
    },
    message: "Notifications retrieved successfully",
  })
}

export const markAsRead = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params
  const userId = (req as any).user.id

  const notification = await markNotificationAsRead(id, userId)
  if (!notification) {
    throw new AppError("Notification not found", 404)
  }

  res.status(200).json({
    success: true,
    statusCode: 200,
    data: { notification },
    message: "Notification marked as read",
  })
}

export const markAllAsRead = async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).user.id

  const count = await markAllNotificationsAsRead(userId)

  res.status(200).json({
    success: true,
    statusCode: 200,
    data: { markedCount: count },
    message: `${count} notifications marked as read`,
  })
}

export const getUnreadCount = async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).user.id

  const count = await getUnreadNotificationCount(userId)

  res.status(200).json({
    success: true,
    statusCode: 200,
    data: { unreadCount: count },
    message: "Unread count retrieved successfully",
  })
}

export const deleteNotificationById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params
  const userId = (req as any).user.id

  const success = await deleteNotification(id, userId)
  if (!success) {
    throw new AppError("Notification not found", 404)
  }

  res.status(200).json({
    success: true,
    statusCode: 200,
    data: null,
    message: "Notification deleted successfully",
  })
}
