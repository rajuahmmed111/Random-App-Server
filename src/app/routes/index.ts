import { Router } from "express"
import authRoutes from "../modules/auth/auth.route"
import userRoutes from "../modules/user/user.route"
import roadmapRoutes from "../modules/roadmap/roadmap.route"
import commentRoutes from "../modules/comment/comment.route"
import voteRoutes from "../modules/vote/vote.route"
import notificationRoutes from "../modules/notification/notification.route"

const router = Router()

router.use("/auth", authRoutes)
router.use("/users", userRoutes)
router.use("/roadmap", roadmapRoutes)
router.use("/comments", commentRoutes)
router.use("/votes", voteRoutes)
router.use("/notifications", notificationRoutes) 

export default router
