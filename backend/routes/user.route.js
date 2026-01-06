import { login, registerUser, getAllUsers, deleteUser } from "../controllers/user.controller.js";
import { loginSchema, registerationSchema } from "../schemas/userValSchema.js";
import validateRequest from "../middlewares/validateRequest.js";
import {authentication, authorize} from "../middlewares/authentication.js";
import express from "express";

const router = express.Router();

router.post("/register", validateRequest(registerationSchema), registerUser);
router.post('/login', validateRequest(loginSchema), login);
router.get('/',authentication, authorize('admin'), getAllUsers);
router.delete('/:id', authentication, authorize('admin'), deleteUser);

export default router;
