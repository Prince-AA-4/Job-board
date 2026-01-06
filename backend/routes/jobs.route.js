import express from 'express';
import { authentication, authorize } from '../middlewares/authentication.js';
import validateRequest from '../middlewares/validateRequest.js';
import { jobSchema, updateJobSchema } from '../schemas/jobsValSchema.js';
import {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  getJobsByCompany,
  closeJob
} from '../controllers/jobs.controller.js';


const router = express.Router();

// ============================================
// PUBLIC ROUTES
// ============================================

// Get all jobs (with optional filtering: status, jobType, location, search)
router.get('/', getAllJobs);

// Get job by ID
router.get('/:id', getJobById);

// Get all jobs by company
router.get('/company/:companyId', getJobsByCompany);


// PROTECTED ROUTES - EMPLOYER & ADMIN
// Create a new job (Employer & Admin only)

router.post('/', authentication, authorize('employer', 'admin'), validateRequest(jobSchema), createJob);

// Update job by ID (Employer & Admin only - ownership checked in controller)
router.put('/:id', 
  authentication, 
  authorize('employer', 'admin'), 
  updateJob
);
router.put('/:id', authentication, authorize('employer', 'admin'), validateRequest(updateJobSchema), updateJob);

// Close job by ID (Employer & Admin only - ownership checked in controller)
router.patch('/:id/close', 
  authentication, 
  authorize('employer', 'admin'), 
  closeJob
);

// Delete job by ID (Employer & Admin only - ownership checked in controller)
router.delete('/:id', 
  authentication, 
  authorize('employer', 'admin'), 
  deleteJob
);

export default router;