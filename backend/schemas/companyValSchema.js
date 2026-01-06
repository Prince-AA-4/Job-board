import Joi from 'joi';


export const companySchema = Joi.object({
    companyName: Joi.string().required(),
    location: Joi.string().required(),
    industry: Joi.string().required(),
    website: Joi.string().required().uri(),
    description: Joi.string().optional(),
})





export const updateCompanySchema = Joi.object({
    companyName: Joi.string().optional(),
    location: Joi.string().optional(),
    industry: Joi.string().optional(),
    website: Joi.string().optional().uri(),
})



