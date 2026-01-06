import Applications from "../database/models/applications.model.js";
import Jobs from "../database/models/jobs.model.js";
import Users from "../database/models/user.model.js";
import Company from "../database/models/company.model.js";
import path from "path";
import { Op } from "sequelize";

export const createApplication = async (req, res) => {
  try {
    const userId = req.user.id;
    const{ jobId } = req.params;
    const file = req.file;

    // Check if job exists and is active
    const job = await Jobs.findByPk(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.status !== 'active') {
      return res.status(400).json({ message: "This job is no longer accepting applications" });
    }

    // Check if deadline has passed
    if (job.deadline && new Date(job.deadline) < new Date()) {
      return res.status(400).json({ message: "Application deadline has passed" });
    }

    // Check if user has already applied
    const existingApplication = await Applications.findOne({
      where: { jobId, userId },
    });

    if (existingApplication) {
      return res.status(400).json({ message: "You have already applied for this job" });
    }

    if (!file){
      return res.status(400).json({message: " Resume file required"});
    }
    
    // Create application
    const newApplication = await Applications.create({
      jobId,
      userId,
      resume: file.path,
      status: 'applied'
    });

    return res.status(201).json({
      message: "Application submitted successfully",
      application: {
        id: newApplication.id,
        jobId: newApplication.jobId,
        userId: newApplication.userId,
        status: newApplication.status,
        createdAt: newApplication.createdAt,
        updatedAt: newApplication.updatedAt
      }
    });
  } catch (error) {
    console.error('Error creating application:', error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


export const getAllApplications = async (req, res) => {
  try {
    const { status, jobId } = req.query;
    const userId = req.user.id;
    const userRole = req.user.role;

    let whereClause = {};

    // Filter by status
    if (status) {
      whereClause.status = status;
    }

    // Filter by job ID
    if (jobId) {
      whereClause.jobId = jobId;
    }

    // If user is applicant, only show their applications
    if (userRole === 'applicant') {
      whereClause.userId = userId;
    }

    let includeOptions = [
      {
        model: Users,
        as: "user",
        attributes: ["id", "fullName", "userName", "email", "contact"],
      },
      {
        model: Jobs,
        as: "job",
        attributes: ["id", "title", "jobType", "location", "status"],
        include: [
          {
            model: Company,
            as: "Company",
            attributes: ["id", "companyName", "userId"],
          },
        ],
      },
    ];

    const applications = await Applications.findAll({
      where: whereClause,
      include: includeOptions,
      order: [["createdAt", "DESC"]],
    });

    // Filter applications for employers (only their company's jobs)
    let filteredApplications = applications;
    if (userRole === 'employer') {
      filteredApplications = applications.filter(
        (app) => app.job.Company.userId === userId
      );
    }

    return res.status(200).json({
      message: "Applications retrieved successfully",
      count: filteredApplications.length,
      applications: filteredApplications,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const application = await Applications.findByPk(id, {
      include: [
        {
          model: Users,
          as: "user",
          attributes: ["id", "fullName", "userName", "email", "contact"],
        },
        {
          model: Jobs,
          as: "job",
          attributes: ["id", "title", "description", "jobType", "location", "salary", "status"],
          include: [
            {
              model: Company,
              as: "Company",
              attributes: ["id", "companyName", "location", "industry", "userId"],
            },
          ],
        },
      ],
    });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Check ownership: applicants can only view their own, employers only for their jobs
    if (userRole === 'applicant' && application.userId !== userId) {
      return res.status(403).json({ message: "You don't have permission to view this application" });
    }

    if (userRole === 'employer' && application.job.Company.userId !== userId) {
      return res.status(403).json({ message: "You don't have permission to view this application" });
    }

    return res.status(200).json({
      message: "Application retrieved successfully",
      application,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    const application = await Applications.findByPk(id, {
      include: [
        {
          model: Jobs,
          as: "job",
          include: [
            {
              model: Company,
              as: "Company",
            },
          ],
        },
      ],
    });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Check ownership: employers can only update applications for their jobs
    if (req.user.role === 'employer' && application.job.Company.userId !== userId) {
      return res.status(403).json({ message: "You don't have permission to update this application" });
    }

    // Validate status
    const validStatuses = ['applied', 'interviewed', 'hired', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    await application.update({ status });

    return res.status(200).json({
      message: "Application status updated successfully",
      application,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const application = await Applications.findByPk(id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Check ownership: applicants can only delete their own applications
    if (application.userId !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: "You don't have permission to delete this application" });
    }

    await application.destroy();

    return res.status(200).json({
      message: "Application deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getMyApplications = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status } = req.query;

    let whereClause = { userId };

    if (status) {
      whereClause.status = status;
    }

    const applications = await Applications.findAll({
      where: whereClause,
      include: [
        {
          model: Jobs,
          as: "job",
          attributes: ["id", "title", "jobType", "location", "salary", "status"],
          include: [
            {
              model: Company,
              as: "Company",
              attributes: ["id", "companyName", "location", "industry"],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      message: "Your applications retrieved successfully",
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getApplicationsByJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    console.log(jobId, "job id");
    
    const userId = req.user.id;
    const userRole = req.user.role;

    // Check if job exists
    const job = await Jobs.findByPk(jobId, {
      include: [
        {
          model: Company,
          as: "Company",
        },
      ],
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Check ownership: employers can only view applications for their jobs
    if (userRole === 'employer' && job.Company.userId !== userId) {
      return res.status(403).json({ message: "You don't have permission to view these applications" });
    }

    const applications = await Applications.findAll({
      where: { jobId },
      include: [
        {
          model: Users,
          as: "user",
          attributes: ["id", "fullName", "userName", "email", "contact"],
        },
        {
          model:Jobs,
          as: "job",
          attributes: ['id', 'title', 'jobType', 'location', 'salary'],
        }
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      message: "Applications retrieved successfully",
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


export const getResume = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const application = await Applications.findByPk(applicationId);

    if (!application || !application.resume) {
      return res.status(404).json({ message: "Resume not found" });
    }


    return res.sendFile(application.resume); // ✅ only via authenticated route
  } catch (error) {
    console.error("Error fetching resume:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
