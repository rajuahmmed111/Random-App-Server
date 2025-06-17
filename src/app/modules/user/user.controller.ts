import type { Request, Response } from "express"
import { findUserById, updateUser } from "./user.service"
import { ApiResponse } from "../../../utils/apiResponse"
import { AppError } from "../../../error/AppError"

export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).user.id

  const user = await findUserById(userId)
  if (!user) {
    throw new AppError("User not found", 404)
  }

  const response = new ApiResponse(
    200,
    {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
    },
    "Profile retrieved successfully",
  )

  res.status(200).json(response)
}

export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).user.id
  const updateData = req.body

  const user = await updateUser(userId, updateData)
  if (!user) {
    throw new AppError("User not found", 404)
  }

  const response = new ApiResponse(
    200,
    {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
    },
    "Profile updated successfully",
  )

  res.status(200).json(response)
}
