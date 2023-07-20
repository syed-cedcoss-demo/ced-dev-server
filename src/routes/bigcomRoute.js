import express from 'express';
import { connectPlatform, importer, orderCreated } from '../controllers/bigcomController.js';
import { auth } from '../middleware/auth.js';
import { bigcomConnectValid } from '../middleware/bodyValidate.js';

const router = express.Router();

router.post('/connect-platform', auth, bigcomConnectValid, connectPlatform);
router.get('/product-import', auth, importer);

// WEBHOOKs ROUTES
router.post('/order-created', auth, orderCreated);
router.post('/order-updated', auth, orderCreated);

export default router;
