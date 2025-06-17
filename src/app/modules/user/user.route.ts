import { Router } from "express"
import { getUserProfile, updateUserProfile } from "./user.controller"
import { authenticateToken } from "../../middleware/auth"
import { asyncHandler } from "../../../utils/asyncHandler"

const router = Router()

// Protected routes
router.get("/profile", authenticateToken, asyncHandler(getUserProfile))
router.put("/profile", authenticateToken, asyncHandler(updateUserProfile))

export default router
