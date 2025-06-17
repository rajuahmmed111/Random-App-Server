import { Router } from "express"
import { validateRequest } from "../../middleware/validateRequest"
import { commentValidation } from "./comment.validation"
import { authenticateToken } from "../../middleware/auth"
import { asyncHandler } from "../../../utils/asyncHandler"
import { createComment, deleteComment, getComments, updateComment } from "./comment.controller"

const router = Router()

// Public routes
router.get("/item/:itemId", asyncHandler(getComments))

// Protected routes
router.post("/item/:itemId", authenticateToken, validateRequest(commentValidation.create), asyncHandler(createComment))
router.put("/:id", authenticateToken, validateRequest(commentValidation.update), asyncHandler(updateComment))
router.delete("/:id", authenticateToken, asyncHandler(deleteComment))

export default router
