import express from 'express';
import { authentication, authorize } from '../middlewares/authentication.js';
// import validateRequest from '../middleware/validateRequest.js';
import {
  getDashboardStats,
  getAllUsersAdmin,
  getUserDetails,
  deleteUser,
  updateUserRole,
  getAllCompaniesAdmin,
  deleteCompanyAdmin,
  getAllJobsAdmin,
  deleteJobAdmin,
  getAllApplicationsAdmin,
  deleteApplicationAdmin
} from '../controllers/admin.controller.js';


const router = express.Router();

// All routes require authentication and admin role
router.use(authentication);
router.use(authorize('admin'));


// DASHBOARD


// Get dashboard statistics
router.get('/dashboard', getDashboardStats);


// USER MANAGEMENT

// Get all users with filtering
router.get('/users', getAllUsersAdmin);

// Get user details by ID
router.get('/users/:id', getUserDetails);

// Update user role
router.patch('/users/:id/role', updateUserRole);

// Delete user
router.delete('/users/:id', deleteUser);

// ============================================
// COMPANY MANAGEMENT
// ============================================

// Get all companies with filtering
router.get('/companies', getAllCompaniesAdmin);

// Delete company
router.delete('/companies/:id', deleteCompanyAdmin);

// ============================================
// JOB MANAGEMENT
// ============================================

// Get all jobs with filtering
router.get('/jobs', getAllJobsAdmin);

// Delete job
router.delete('/jobs/:id', deleteJobAdmin);


// APPLICATION MANAGEMENT


// Get all applications with filtering
router.get('/applications', getAllApplicationsAdmin);

// Delete application
router.delete('/applications/:id', deleteApplicationAdmin);

export default router;