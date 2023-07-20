// import { v2 as cloudinary } from 'cloudinary';
import express from 'express';
// import multer from 'multer';
import { getAllUser, getUser, updateProfile } from '../controllers/userController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.get('/get-user', auth, getUser);
router.get('/get-all-users', auth, getAllUser);
router.put('/update-profile', auth, updateProfile);
// router.post('/update-password', signup);

export default router;
