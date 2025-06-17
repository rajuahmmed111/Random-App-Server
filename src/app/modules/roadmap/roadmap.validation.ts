import Joi from "joi"

export const roadmapValidation = {
  create: Joi.object({
    title: Joi.string().min(3).max(200).required(),
    description: Joi.string().min(10).max(1000).required(),
    status: Joi.string().valid("PLANNED", "IN_PROGRESS", "COMPLETED", "ON_HOLD", "CANCELLED").optional(),
    category: Joi.string()
      .valid("UI_UX", "FEATURES", "PLATFORM", "SECURITY", "PERFORMANCE", "INTEGRATION", "MOBILE", "API")
      .required(),
    priority: Joi.string().valid("LOW", "MEDIUM", "HIGH", "CRITICAL").optional(),
  }),

  update: Joi.object({
    title: Joi.string().min(3).max(200).optional(),
    description: Joi.string().min(10).max(1000).optional(),
    status: Joi.string().valid("PLANNED", "IN_PROGRESS", "COMPLETED", "ON_HOLD", "CANCELLED").optional(),
    category: Joi.string()
      .valid("UI_UX", "FEATURES", "PLATFORM", "SECURITY", "PERFORMANCE", "INTEGRATION", "MOBILE", "API")
      .optional(),
    priority: Joi.string().valid("LOW", "MEDIUM", "HIGH", "CRITICAL").optional(),
  }),

  // Bulk creation validation
  bulkRandom: Joi.object({
    count: Joi.number().integer().min(1).max(50).optional(),
  }),
}
