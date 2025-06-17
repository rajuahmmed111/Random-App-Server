import { Router } from "express"
import { authenticateToken } from "../../middleware/auth"
import { asyncHandler } from "../../../utils/asyncHandler"
import { getItemVotes, getVoteStatus, toggleVote } from "./vote.controller"

const router = Router()

// All vote routes require authentication
router.post("/:itemId/toggle", authenticateToken, asyncHandler(toggleVote))
router.get("/:itemId/status", authenticateToken, asyncHandler(getVoteStatus))
router.get("/:itemId/count", asyncHandler(getItemVotes))

export default router
