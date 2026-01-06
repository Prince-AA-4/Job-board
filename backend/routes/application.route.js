import express from "express";
import { authentication, authorize } from "../middlewares/authentication.js";
import validateRequest from "../middlewares/validateRequest.js";
import {
  createApplication,
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
  deleteApplication,
  getMyApplications,
  getApplicationsByJob,
} from "../controllers/application.controller.js";
import {
  createApplicationSchema,
  updateApplicationSchema,
} from "../schemas/applicationValschema.js";
import upload from "../middlewares/fileupload.js";

const router = express.Router();

// ============================================
// PROTECTED ROUTES - APPLICANT
// ============================================

// Create a new application (Applicant only)
router.post(
  "/:jobId",
  authentication,
  authorize("applicant"),
  upload.single("resume"),
  validateRequest(createApplicationSchema),
  createApplication
);

// Get my applications (Applicant only)
router.get(
  "/my-applications",
  authentication,
  authorize("applicant"),
  getMyApplications
);

// Delete application by ID (Applicant & Admin only - ownership checked in controller)
router.delete(
  "/:id",
  authentication,
  authorize("applicant", "admin"),
  deleteApplication
);

// ============================================
// PROTECTED ROUTES - ALL AUTHENTICATED USERS
// ============================================

// Get all applications (filtered by role in controller)
router.get("/", authentication, getAllApplications);

// Get application by ID (permission checked in controller)
router.get("/:id", authentication, getApplicationById);

// ============================================
// PROTECTED ROUTES - EMPLOYER & ADMIN
// ============================================

// Update application status (Employer & Admin only - ownership checked in controller)
router.patch(
  "/:id/status",
  authentication,
  authorize("employer", "admin"),
  validateRequest(updateApplicationSchema),
  updateApplicationStatus
);

// Get all applications for a specific job (Employer & Admin only - ownership checked in controller)
router.get(
  "/job/:jobId",
  authentication,
  authorize("employer", "admin"),
  getApplicationsByJob
);


export default router;
