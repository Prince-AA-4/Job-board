import Company from "../database/models/company.model.js";
import Users from "../database/models/user.model.js";
import Jobs from "../database/models/jobs.model.js";

export const createCompany = async (req, res) => {
  try {
    const { companyName, location, industry, website, description } = req.body;
    const userId = req.user.id;

    const newCompany = await Company.create({
      companyName,
      location,
      industry,
      website,
      description,
      userId,
    });

    return res.status(201).json({
      message: "Company created successfully",
      company: newCompany,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.findAll({
      include: [
        {
          model: Users,
          as: "User",
          attributes: ["id", "fullName", "userName", "email"],
        },
        {
          model: Jobs,
          as: "jobs",
          attributes: ["id", "title", "jobType", "location", "status"],
        },
      ],
    });

    return res.status(200).json({
      message: "All companies retrieved successfully",
      companies,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getCompanyById = async (req, res) => {
  try {
    const { id } = req.params;

    const company = await Company.findByPk(id, {
      include: [
        {
          model: Users,
          as: "User",
          attributes: ["id", "fullName", "userName", "email"],
        },
        {
          model: Jobs,
          as: "jobs",
          attributes: ["id", "title", "jobType", "location", "status", "salary"],
        },
      ],
    });

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    return res.status(200).json({
      message: "Company retrieved successfully",
      company,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const { companyName, location, industry, website, description } = req.body;
    const userId = req.user.id;

    const company = await Company.findByPk(id);

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Check ownership (admins can update any company, employers only their own)
    if (company.userId !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: "You don't have permission to update this company" });
    }

    await company.update({
      companyName: companyName || company.companyName,
      location: location || company.location,
      industry: industry || company.industry,
      website: website || company.website,
      description: description || company.description,
    });

    return res.status(200).json({
      message: "Company updated successfully",
      company,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const company = await Company.findByPk(id);

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Check ownership (admins can delete any company, employers only their own)
    if (company.userId !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: "You don't have permission to delete this company" });
    }

    await company.destroy();

    return res.status(200).json({
      message: "Company deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getMyCompanies = async (req, res) => {
  try {
    const userId = req.user.id;

    const companies = await Company.findAll({
      where: { userId },
      include: [
        {
          model: Jobs,
          as: "jobs",
          attributes: ["id", "title", "jobType", "location", "status"],
        },
      ],
    });

    return res.status(200).json({
      message: "Your companies retrieved successfully",
      companies,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};