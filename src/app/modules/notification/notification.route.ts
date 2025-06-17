import { Router } from "express"
import { authenticateToken } from "../../middleware/auth"
import { asyncHandler } from "../../../utils/asyncHandler"
import { deleteNotificationById, getNotifications, getUnreadCount, markAllAsRead, markAsRead } from "./notification.controller"

const router = Router()

// All notification routes require authentication
router.get("/", authenticateToken, asyncHandler(getNotifications))
router.get("/unread-count", authenticateToken, asyncHandler(getUnreadCount))
router.put("/:id/read", authenticateToken, asyncHandler(markAsRead))
router.put("/mark-all-read", authenticateToken, asyncHandler(markAllAsRead))
router.delete("/:id", authenticateToken, asyncHandler(deleteNotificationById))

export default router
