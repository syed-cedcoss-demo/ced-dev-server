import queueProcessModel from '../models/queueProcessModel.js';
import userModel from '../models/userModel.js';

import {
  createWebhooks,
  productsImport,
  webhookProductCreated,
  webhookProductDeleted,
  webhookProductUpdated
} from '../utils/bigcom-helper.js';
import appError from '../validations/appError.js';

// BIGCOMMERCE CONNECT SHOP
export const connectPlatform = async (req, res) => {
  try {
    const { userId } = req;
    const { storeHash, accessToken, clientId, clientSecret } = req.body;
    const payload = {
      platform: 'bigcommerce',
      store_hash: storeHash,
      access_token: accessToken,
      client_id: clientId,
      client_secret: clientSecret
    };
    const user = await userModel.find({ _id: userId });
    if (user.length === 0) {
      return res
        .status(404)
        .send({ success: false, msg: 'user not found for given token', data: {} });
    }
    if (user[0].connected_platform.some((el) => el?.platform === payload?.platform)) {
      return res.status(409).send({
        success: false,
        msg: 'Your BigCommerce store already connected',
        data: {}
      });
    }
    const platform = await userModel.find({
      connected_platform: { $elemMatch: { store_hash: { $eq: payload?.store_hash } } }
    });
    if (platform?.length > 0) {
      return res.status(409).send({
        success: false,
        msg: 'You can not connect same account with multiple user',
        data: {}
      });
    }
    await userModel.updateOne({ _id: userId }, { $push: { connected_platform: payload } });

    // START PRODUCT IMPORT
    await queueProcessModel.create({
      user_id: userId,
      platform: 'bigcommerce',
      process: 'product-import'
    });
    productsImport({ ...payload, userId, page: 1 });

    // CREATE WEBHOOKS
    createWebhooks({ ...payload, userId });
    return res.status(200).send({
      success: true,
      msg: 'account successfully connected',
      data: {}
    });
  } catch (error) {
    appError(error, res);
  }
};

// BIGCOMMERCE PRODUCTS IMPORT
export const importer = async (req, res) => {
  try {
    const { userId } = req;
    // CHECK USER EXIST OR NOT
    const user = await userModel.findOne({ _id: userId }, { connected_platform: 1 });
    if (!user?._id) {
      return res.status(404).send({
        success: false,
        msg: 'User does not exist in database',
        data: {}
      });
    }
    // CHECK PLATFORM CONNECTED OR NOT
    const credential = user?.connected_platform?.find((el) => el?.platform === 'bigcommerce');
    if (!credential?.store_hash) {
      return res.status(404).send({
        success: false,
        msg: 'platform not connected',
        data: {}
      });
    }

    // CHECK IS THERE ANY PROCESS IN QUEUE FOR THIS USER
    const process = await queueProcessModel.findOne({
      $and: [{ user_id: userId }, { platform: 'bigcommerce' }, { process: 'product-import' }]
    });
    if (process?.user_id) {
      return res.status(208).send({
        success: false,
        msg: 'product import already in process',
        data: {}
      });
    }
    // CREATE NEW PROCESS
    await queueProcessModel.create({
      user_id: userId,
      platform: 'bigcommerce',
      process: 'product-import'
    });
    // CALL PRODUCTS IMPORTER
    productsImport({ ...credential, userId, page: 1 });

    return res.status(200).send({
      success: true,
      msg: 'Product import started',
      data: {}
    });
  } catch (error) {
    appError(error, res);
  }
};

// WATCH BIGCOMMERCE PRODUCT WEBHOOKS
export const watchWebhookProduct = (req, res) => {
  try {
    const data = req?.body;
    console.log('req.body', data);
    if (data?.scope === 'store/product/updated') {
      webhookProductUpdated({ userId: req?.userId, productId: data?.data?.id });
    } else if (data?.scope === 'store/product/created') {
      webhookProductCreated({ userId: req?.userId, productId: data?.data?.id });
    } else if (data?.scope === 'store/product/deleted') {
      webhookProductDeleted({ userId: req?.userId, productId: data?.data?.id });
    }
    res.status(200).send('ok');
  } catch (error) {
    appError(error, res);
  }
};

// WATCH BIGCOMMERCE ORDER  WEBHOOKS
export const watchWebhookOrder = async (req, res) => {
  try {
    console.log('req.body', req.body);
    res.status(200).send('ok');
  } catch (error) {
    appError(error, res);
  }
};
