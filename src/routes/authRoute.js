import express from 'express';

import {
  forgetPassword,
  login,
  resetPassword,
  signup,
  verify
} from '../controllers/authController.js';
import { loginValidate, signupValidate } from '../middleware/bodyValidate.js';

const router = express.Router();

router.post('/signup', signupValidate, signup);
router.get('/verify', verify);
router.post('/login', loginValidate, login);
router.post('/forget-password', forgetPassword);
router.post('/reset-password', resetPassword);

export default router;
