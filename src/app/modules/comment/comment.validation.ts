import Joi from "joi"

export const commentValidation = {
  create: Joi.object({
    content: Joi.string().min(1).max(500).required(),
    parentId: Joi.string().optional(),
  }),

  update: Joi.object({
    content: Joi.string().min(1).max(500).required(),
  }),
}
