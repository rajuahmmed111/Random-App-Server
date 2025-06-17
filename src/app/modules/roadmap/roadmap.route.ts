import { Router } from "express"
import { validateRequest } from "../../middleware/validateRequest"
import { authenticateToken, optionalAuth } from "../../middleware/auth"
import { asyncHandler } from "../../../utils/asyncHandler"
import { roadmapValidation } from "./roadmap.validation"
import {
  createItem,
  deleteItem,
  getAllItems,
  getItemById,
  updateItem,
  // Random item controllers
  createRandomItem,
  createBulkRandom,
  createDemo,
  getTemplates,
} from "./roadmap.controller"

const router = Router()

// Public routes (with optional auth for vote status)
router.get("/", optionalAuth, asyncHandler(getAllItems))
router.get("/:id", optionalAuth, asyncHandler(getItemById))

// Template routes
router.get("/admin/templates", authenticateToken, asyncHandler(getTemplates))

// Admin only routes
router.post("/", authenticateToken, validateRequest(roadmapValidation.create), asyncHandler(createItem))
router.put("/:id", authenticateToken, validateRequest(roadmapValidation.update), asyncHandler(updateItem))
router.delete("/:id", authenticateToken, asyncHandler(deleteItem))

// Random item creation routes
router.post("/admin/random", authenticateToken, asyncHandler(createRandomItem))
router.post("/admin/bulk-random", authenticateToken, asyncHandler(createBulkRandom))
router.post("/admin/demo", authenticateToken, asyncHandler(createDemo))

export default router
