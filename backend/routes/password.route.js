import express from 'express';
import { requestPasswordReset, resetPassword } from '../controllers/password.controller.js';


const router = express.Router();

router.post('/request-reset',  requestPasswordReset);
router.post('/reset-password',  resetPassword);


export default router;
