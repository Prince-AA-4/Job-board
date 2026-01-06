import express from "express"
import { getResume } from "../controllers/application.controller.js";
import { authorize, authentication } from "../middlewares/authentication.js";


const router = express.Router()


router.get(
  "/:applicationId/resume",
  authentication,
  authorize("employer", "admin"),
  getResume
);


export default router;