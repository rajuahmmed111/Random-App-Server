import { Router } from "express"
import { register, login, getProfile } from "./auth.controller"
import { validateRequest } from "../../middleware/validateRequest"
import { authValidation } from "./auth.validation"
import { authenticateToken } from "../../middleware/auth"
import { asyncHandler } from "../../../utils/asyncHandler"

const router = Router()

// Public routes
router.post("/register", validateRequest(authValidation.register), asyncHandler(register))
router.post("/login", validateRequest(authValidation.login), asyncHandler(login))

// Protected routes
router.get("/profile", authenticateToken, asyncHandler(getProfile))

export default router
