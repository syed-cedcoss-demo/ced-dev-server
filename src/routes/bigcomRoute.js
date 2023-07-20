import express from 'express';
import { connectPlatform, orderCreated } from '../controllers/bigcomController.js';
import { auth } from '../middleware/auth.js';
import { isValidConnectBody } from '../middleware/bodyValidate.js';

const router = express.Router();

router.post('/connect-platform', auth, isValidConnectBody, connectPlatform);

// WEBHOOKs ROUTES
router.post('/order-created', auth, orderCreated);
router.post('/order-updated', auth, orderCreated);

export default router;
