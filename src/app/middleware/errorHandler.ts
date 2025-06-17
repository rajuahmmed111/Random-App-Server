import type { Request, Response, NextFunction } from "express"
import { AppError } from "../../error/AppError"

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Basic error logging (optional)
  console.error("Error:", {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
  })

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
    })
  }

  // Prisma errors
  if (error.name === "PrismaClientKnownRequestError") {
    return res.status(400).json({
      success: false,
      message: "Database operation failed",
      ...(process.env.NODE_ENV === "development" && { error: error.message }),
    })
  }

  // Validation errors
  if (error.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: error.message,
    })
  }

  // Default error
  res.status(500).json({
    success: false,
    message: "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  })
}
