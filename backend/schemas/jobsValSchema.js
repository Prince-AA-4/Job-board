import Joi from "joi";

export const jobSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    companyId: Joi.number().integer().positive().required(), // ← Add this!
    jobType: Joi.string().valid('Full-Time', 'Part-Time', 'Internship').required(), 
    location: Joi.string().required(),
    salary: Joi.string().optional(),
    deadline: Joi.date().min('now').optional().messages({
        'date.min': 'Deadline must be today or in the future'
    }),
    status: Joi.string().valid('active', 'closed').optional(),
});

export const updateJobSchema = Joi.object({
    title: Joi.string().optional(),
    description: Joi.string().optional(),
    jobType: Joi.string().valid('Full-Time', 'Part-Time', 'Internship').optional(),
    location: Joi.string().optional(),
    salary: Joi.string().optional(),
    deadline: Joi.date().min('now').optional().messages({
        'date.min': 'Deadline must be today or in the future'
    }),
    status: Joi.string().valid('active', 'closed').optional(), 
});