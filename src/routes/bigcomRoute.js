import express from 'express';
import {
  connectPlatform,
  importer,
  orderCreated,
  watchWebhookProduct
} from '../controllers/bigcomController.js';
import { auth } from '../middleware/auth.js';
import { bigcomConnectValid } from '../middleware/bodyValidate.js';

const router = express.Router();

router.post('/connect-platform', auth, bigcomConnectValid, connectPlatform);
router.get('/product-import', auth, importer);

// WEBHOOKs ROUTES
router.post('/order-webhooks', auth, orderCreated);
router.post('/product-webhooks', watchWebhookProduct);

export default router;
