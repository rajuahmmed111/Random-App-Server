import type { Request, Response, NextFunction } from "express"
import type Joi from "joi"
import { AppError } from "../../error/AppError"

export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body)

    if (error) {
      const errorMessage = error.details.map((detail) => detail.message).join(", ")
      throw new AppError(errorMessage, 400)
    }

    next()
  }
}
