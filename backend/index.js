import express from "express";
import dotenv from "dotenv";
import sequelize from "./config/dbConfig.js";
import Users from "./database/models/index.js";
import Companies from "./database/models/index.js";
import Jobs from "./database/models/index.js";
import Applications from "./database/models/index.js";
import { usersTable } from "./database/models/user.model.js";
import { companyTable } from "./database/models/company.model.js";
import { applicationTable } from "./database/models/applications.model.js";
import { jobsTable } from "./database/models/jobs.model.js";
import userRoutes from "./routes/user.route.js";
import jobRoutes from "./routes/jobs.route.js";
import companyRoutes from "./routes/company.route.js";
import applicationRoutes from "./routes/application.route.js";
import adminRoutes from "./routes/admin.route.js";
import resumeRoutes from "./routes/resume.route.js";
import passwordRoutes from "./routes/password.route.js"
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);


app.use("/api/users", userRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/uploads", resumeRoutes);
app.use("/api/passwords", passwordRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database conected succesfully.");
    app.listen(port, () => {
      console.log(`Server is runnung on port http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to start Server:", error);
  }
};

startServer();
usersTable();
companyTable();
jobsTable();
applicationTable();
