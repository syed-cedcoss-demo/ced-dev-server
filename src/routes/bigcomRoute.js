import express from 'express';
import { connectPlatform, orderCreated } from '../controllers/bigcomController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// WEBHOOKs ROUTES
router.post('/order-created', auth, orderCreated);
router.post('/order-updated', auth, orderCreated);

router.post('/connect-platform', auth, connectPlatform);

export default router;
