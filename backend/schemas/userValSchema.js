import Joi from 'joi';

export const registerationSchema = Joi.object({
    fullName: Joi.string().min(2).max(100).required(),
    userName: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email({ maxDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    password: Joi.string().min(8).required(),
    contact: Joi.string().optional().allow('', null),
    role: Joi.string().valid('admin', 'employer', 'applicant').required()
});

export const loginSchema = Joi.object({
    email: Joi.string().email({ maxDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    password: Joi.string().min(8).required()
});