import express from 'express';
import passport from 'passport';
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

// OAUTH ROUTES
router.get('/google-auth', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google-login',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect(`${process.env.APP_URL}/login/?token=${req?.user?.token}`);
  }
);

export default router;
