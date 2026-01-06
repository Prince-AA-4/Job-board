import express from 'express';
import { authentication, authorize } from '../middlewares/authentication.js';
import validateRequest from '../middlewares/validateRequest.js';
import { companySchema, updateCompanySchema } from '../schemas/companyValSchema.js';
import {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
  getMyCompanies
} from '../controllers/company.controller.js';


const router = express.Router();


// PUBLIC ROUTES

// Get all companies
router.get('/', getAllCompanies);

// Get company by ID
router.get('/:id', getCompanyById);


// PROTECTED ROUTES - EMPLOYER & ADMIN

// Create a new company (Employer & Admin only)
router.post('/', 
  authentication, 
  authorize('employer', 'admin'), validateRequest(companySchema),
  createCompany
);


// Get my companies (Employer & Admin only)
router.get('/my/companies', 
  authentication, 
  authorize('employer', 'admin'), 
  getMyCompanies
);

// Update company by ID (Employer & Admin only - ownership checked in controller)

router.put('/:id', authentication, authorize('employer', 'admin'), validateRequest(updateCompanySchema), updateCompany);

// Delete company by ID (Employer & Admin only - ownership checked in controller)
router.delete('/:id', 
  authentication, 
  authorize('employer', 'admin'), 
  deleteCompany
);

export default router;