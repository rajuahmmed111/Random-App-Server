import jwt from "jsonwebtoken"
import { AppError } from "../../../error/AppError"
import config from "../../../config/config"

export const generateToken = (userId: string): string => {
  if (!config.jwt.jwt_secret) {
    throw new AppError("JWT secret not configured", 500)
  }

  return jwt.sign({ userId }, config.jwt.jwt_secret, { expiresIn: config.jwt.expires_in })
}

export const verifyToken = (token: string): { userId: string } => {
  if (!config.jwt.jwt_secret) {
    throw new AppError("JWT secret not configured", 500)
  }

  try {
    const decoded = jwt.verify(token, config.jwt.jwt_secret) as { userId: string }
    return decoded
  } catch (error) {
    throw new AppError("Invalid or expired token", 401)
  }
}
