import Users from "../database/models/user.model.js";
import Company from "../database/models/company.model.js";
import Jobs from "../database/models/jobs.model.js";
import Applications from "../database/models/applications.model.js";
import { Op } from "sequelize";
import sequelize from "../config/dbConfig.js";

// ============================================
// DASHBOARD STATISTICS
// ============================================

export const getDashboardStats = async (req, res) => {
  try {
    // Total counts
    const totalUsers = await Users.count();
    const totalCompanies = await Company.count();
    const totalJobs = await Jobs.count();
    const totalApplications = await Applications.count();

    // Users by role
    const usersByRole = await Users.findAll({
      attributes: [
        'role',
        [sequelize.fn('COUNT', sequelize.col('role')), 'count']
      ],
      group: ['role']
    });

    // Jobs by status
    const jobsByStatus = await Jobs.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('status')), 'count']
      ],
      group: ['status']
    });

    // Jobs by type
    const jobsByType = await Jobs.findAll({
      attributes: [
        'jobType',
        [sequelize.fn('COUNT', sequelize.col('jobType')), 'count']
      ],
      group: ['jobType']
    });

    // Applications by status
    const applicationsByStatus = await Applications.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('status')), 'count']
      ],
      group: ['status']
    });

    // Recent activities (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentUsers = await Users.count({
      where: { createdAt: { [Op.gte]: thirtyDaysAgo } }
    });

    const recentJobs = await Jobs.count({
      where: { createdAt: { [Op.gte]: thirtyDaysAgo } }
    });

    const recentApplications = await Applications.count({
      where: { createdAt: { [Op.gte]: thirtyDaysAgo } }
    });

    return res.status(200).json({
      message: "Dashboard statistics retrieved successfully",
      stats: {
        overview: {
          totalUsers,
          totalCompanies,
          totalJobs,
          totalApplications
        },
        usersByRole: usersByRole.map(item => ({
          role: item.role,
          count: parseInt(item.dataValues.count)
        })),
        jobsByStatus: jobsByStatus.map(item => ({
          status: item.status,
          count: parseInt(item.dataValues.count)
        })),
        jobsByType: jobsByType.map(item => ({
          type: item.jobType,
          count: parseInt(item.dataValues.count)
        })),
        applicationsByStatus: applicationsByStatus.map(item => ({
          status: item.status,
          count: parseInt(item.dataValues.count)
        })),
        recentActivity: {
          newUsers: recentUsers,
          newJobs: recentJobs,
          newApplications: recentApplications
        }
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// ============================================
// USER MANAGEMENT
// ============================================

export const getAllUsersAdmin = async (req, res) => {
  try {
    const { role, search } = req.query;
    
    let whereClause = {};

    // Filter by role
    if (role) {
      whereClause.role = role;
    }

    // Search by name, email, or username
    if (search) {
      whereClause[Op.or] = [
        { fullName: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { userName: { [Op.like]: `%${search}%` } }
      ];
    }

    const users = await Users.findAll({
      where: whereClause,
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Company,
          as: 'company',
          attributes: ['id', 'companyName']
        },
        {
          model: Applications,
          as: 'applications',
          attributes: ['id', 'status']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({
      message: "Users retrieved successfully",
      count: users.length,
      users
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUserDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await Users.findByPk(id, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Company,
          as: 'company',
          include: [
            {
              model: Jobs,
              as: 'jobs',
              attributes: ['id', 'title', 'status', 'createdAt']
            }
          ]
        },
        {
          model: Applications,
          as: 'applications',
          include: [
            {
              model: Jobs,
              as: 'job',
              attributes: ['id', 'title'],
              include: [
                {
                  model: Company,
                  as: 'Company',
                  attributes: ['id', 'companyName']
                }
              ]
            }
          ]
        }
      ]
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User details retrieved successfully",
      user
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await Users.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent admin from deleting themselves
    if (user.id === req.user.id) {
      return res.status(400).json({ message: "You cannot delete your own account" });
    }

    await user.destroy();

    return res.status(200).json({
      message: "User deleted successfully"
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const user = await Users.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent admin from changing their own role
    if (user.id === req.user.id) {
      return res.status(400).json({ message: "You cannot change your own role" });
    }

    // Validate role
    const validRoles = ['admin', 'employer', 'applicant'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    await user.update({ role });

    const userResponse = {
      id: user.id,
      fullName: user.fullName,
      userName: user.userName,
      email: user.email,
      contact: user.contact,
      role: user.role,
      updatedAt: user.updatedAt
    };

    return res.status(200).json({
      message: "User role updated successfully",
      user: userResponse
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// ============================================
// COMPANY MANAGEMENT
// ============================================

export const getAllCompaniesAdmin = async (req, res) => {
  try {
    const { search } = req.query;
    
    let whereClause = {};

    // Search by company name, industry, or location
    if (search) {
      whereClause[Op.or] = [
        { companyName: { [Op.like]: `%${search}%` } },
        { industry: { [Op.like]: `%${search}%` } },
        { location: { [Op.like]: `%${search}%` } }
      ];
    }

    const companies = await Company.findAll({
      where: whereClause,
      include: [
        {
          model: Users,
          as: "User",
          attributes: ["id", "fullName", "email"]
        },
        {
          model: Jobs,
          as: "jobs",
          attributes: ["id", "title", "status"]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({
      message: "Companies retrieved successfully",
      count: companies.length,
      companies
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteCompanyAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const company = await Company.findByPk(id);

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    await company.destroy();

    return res.status(200).json({
      message: "Company deleted successfully"
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// ============================================
// JOB MANAGEMENT
// ============================================

export const getAllJobsAdmin = async (req, res) => {
  try {
    const { status, search } = req.query;
    
    let whereClause = {};

    // Filter by status
    if (status) {
      whereClause.status = status;
    }

    // Search by title or description
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    const jobs = await Jobs.findAll({
      where: whereClause,
      include: [
        {
          model: Company,
          as: "Company",
          attributes: ["id", "companyName"],
          include: [
            {
              model: Users,
              as: "User",
              attributes: ["id", "fullName", "email"]
            }
          ]
        },
        {
          model: Applications,
          as: "applications",
          attributes: ["id", "status"]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({
      message: "Jobs retrieved successfully",
      count: jobs.length,
      jobs
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteJobAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Jobs.findByPk(id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    await job.destroy();

    return res.status(200).json({
      message: "Job deleted successfully"
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// ============================================
// APPLICATION MANAGEMENT
// ============================================

export const getAllApplicationsAdmin = async (req, res) => {
  try {
    const { status, search } = req.query;
    
    let whereClause = {};

    // Filter by status
    if (status) {
      whereClause.status = status;
    }

    const applications = await Applications.findAll({
      where: whereClause,
      include: [
        {
          model: Users,
          as: "user",
          attributes: ["id", "fullName", "email"],
          where: search ? {
            [Op.or]: [
              { fullName: { [Op.like]: `%${search}%` } },
              { email: { [Op.like]: `%${search}%` } }
            ]
          } : undefined
        },
        {
          model: Jobs,
          as: "job",
          attributes: ["id", "title", "status"],
          include: [
            {
              model: Company,
              as: "Company",
              attributes: ["id", "companyName"]
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({
      message: "Applications retrieved successfully",
      count: applications.length,
      applications
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteApplicationAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await Applications.findByPk(id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    await application.destroy();

    return res.status(200).json({
      message: "Application deleted successfully"
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};