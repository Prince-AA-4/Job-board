import Joi from "joi";

export const createApplicationSchema = Joi.object({
  status: Joi.string().valid("applied", "interviewed", "hired", "rejected").optional(),
});

export const updateApplicationSchema = Joi.object({
  status: Joi.string().valid("applied", "interviewed","hired", "rejected").optional(),
});
