import Jobs from "../database/models/jobs.model.js";
import Company from "../database/models/company.model.js";
import Applications from "../database/models/applications.model.js";
import Users from "../database/models/user.model.js";
import { Op } from "sequelize";

export const createJob = async (req, res) => {
  try {
    const { title, description, companyId, jobType, location, salary, deadline } = req.body;
    const userId = req.user.id;

    // Check if company exists
    const company = await Company.findByPk(companyId);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Check ownership (admins can create for any company, employers only their own)
    if (company.userId !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: "You don't have permission to create jobs for this company" });
    }

    const newJob = await Jobs.create({
      title,
      description,
      companyId,
      jobType,
      location,
      salary: salary || 'Competitive',
      deadline,
      status: 'active',
    });

    return res.status(201).json({
      message: "Job created successfully",
      job: newJob,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const { status, jobType, location, search } = req.query;
    
    let filters = {};

    // Filter by status
    if (status) {
      filters.status = status;
    }

    // Filter by job type
    if (jobType) {
      filters.jobType = jobType;
    }

    // Filter by location
    if (location) {
      filters.location = { [Op.like]: `%${location}%` };
    }

    // Search by title or description
    if (search) {
      filters[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
    }

    const jobs = await Jobs.findAll({
      where: filters,
      include: [
        {
          model: Company,
          as: "Company",
          attributes: ["id", "companyName", "location", "industry"],
          include: [
            {
              model: Users,
              as: "User",
              attributes: ["id", "fullName", "email"],
            },
          ],
        },
        {
          model: Applications,
          as: "applications",
          attributes: ["id", "status"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      message: "All jobs retrieved successfully",
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Jobs.findByPk(id, {
      include: [
        {
          model: Company,
          as: "Company",
          attributes: ["id", "companyName", "location", "industry", "website", "description"],
          include: [
            {
              model: Users,
              as: "User",
              attributes: ["id", "fullName", "email", "contact"],
            },
          ],
        },
        {
          model: Applications,
          as: "applications",
          attributes: ["id", "status", "createdAt"],
          include: [
            {
              model: Users,
              as: "user",
              attributes: ["id", "fullName", "email"],
            },
          ],
        },
      ],
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    return res.status(200).json({
      message: "Job retrieved successfully",
      job,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, jobType, location, salary, deadline, status } = req.body;
    const userId = req.user.id;

    const job = await Jobs.findByPk(id, {
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

    // Check ownership (admins can update any job, employers only their own)
    if (job.Company.userId !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: "You don't have permission to update this job" });
    }

    await job.update({
      title: title || job.title,
      description: description || job.description,
      jobType: jobType || job.jobType,
      location: location || job.location,
      salary: salary || job.salary,
      deadline: deadline || job.deadline,
      status: status || job.status,
    });

    return res.status(200).json({
      message: "Job updated successfully",
      job,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const job = await Jobs.findByPk(id, {
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

    // Check ownership (admins can delete any job, employers only their own)
    if (job.Company.userId !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: "You don't have permission to delete this job" });
    }

    await job.destroy();

    return res.status(200).json({
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getJobsByCompany = async (req, res) => {
  try {
    const { companyId } = req.params;

    const company = await Company.findByPk(companyId);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    const jobs = await Jobs.findAll({
      where: { companyId },
      include: [
        {
          model: Company,
          as: "Company",
          attributes: ["id", "companyName", "location", "industry"],
        },
        {
          model: Applications,
          as: "applications",
          attributes: ["id", "status"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      message: "Jobs retrieved successfully",
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const closeJob = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const job = await Jobs.findByPk(id, {
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

    // Check ownership (admins can close any job, employers only their own)
    if (job.Company.userId !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: "You don't have permission to close this job" });
    }

    await job.update({ status: 'closed' });

    return res.status(200).json({
      message: "Job closed successfully",
      job,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};