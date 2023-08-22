import express from 'express';
import {
  connectPlatform,
  getAProduct,
  getAllProduct,
  importer,
  incomingWebhooks,
  watchWebhookOrder,
  watchWebhookProduct
} from '../controllers/bigcomController.js';
import { auth, webhookAuth } from '../middleware/auth.js';
import { bigcomConnectValid } from '../middleware/bodyValidate.js';

const router = express.Router();

router.post('/connect-platform', auth, bigcomConnectValid, connectPlatform);
router.get('/product-import', auth, importer);

// PRODUCT ROUTES
router.get('/get-product', auth, getAProduct);
router.get('/get-all-product', auth, getAllProduct);
// WEBHOOKs
router.post('/incoming-webhooks', webhookAuth, incomingWebhooks);
router.post('/order-webhooks', webhookAuth, watchWebhookOrder);
router.post('/product-webhooks', webhookAuth, watchWebhookProduct);

export default router;
