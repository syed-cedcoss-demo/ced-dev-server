import express from 'express';
import {
  connectPlatform,
  importer,
  watchWebhookOrder,
  watchWebhookProduct
} from '../controllers/bigcomController.js';
import { auth, webhookAuth } from '../middleware/auth.js';
import { bigcomConnectValid } from '../middleware/bodyValidate.js';

const router = express.Router();

router.post('/connect-platform', auth, bigcomConnectValid, connectPlatform);
router.get('/product-import', auth, importer);

// WEBHOOKs ROUTES
router.post('/order-webhooks', webhookAuth, watchWebhookOrder);
router.post('/product-webhooks', webhookAuth, watchWebhookProduct);

export default router;
