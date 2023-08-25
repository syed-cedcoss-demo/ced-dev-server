import productModel from '../models/productModel.js';
import queueProcessModel from '../models/queueProcessModel.js';
import userModel from '../models/userModel.js';

import productsImport from '../utils/bigcomProductImport.js';
import { createWebhooks, webhooksProcess } from '../utils/bigcomWebhooks.js';
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

// INCOMING WEBHOOKS
export const incomingWebhooks = async (req, res) => {
  try {
    const data = req?.body;
    const payload = {
      user_id: req?.userId,
      id: data?.data?.id,
      scope: data?.scope,
      platform: 'bigcommerce'
    };
    webhooksProcess(payload);
    res.status(200).send('ok');

    /* const result = await webhooksModel.create(payload);
    if (result?.id) {
      res.status(200).send('ok');
    } else {
      appError(
        {
          message: 'webhook not saved in our db due to some error:',
          stack: `user_id- ${req.userId} -, ${data}`
        },
        res
      );
    } */
  } catch (error) {
    appError(error, res);
  }
};

// GET A PRODUCT
export const getAProduct = async (req, res) => {
  try {
    const product = await productModel.findOne({
      user_id: req?.userId,
      product_id: req.query.product_id,
      platform: 'bigcommerce'
    });
    if (product?.length <= 0) {
      return res.status(404).send({
        success: false,
        msg: 'no product found',
        data: {}
      });
    }
    res.status(200).send({
      success: true,
      msg: 'success',
      data: { rows: product, meta: {} }
    });
  } catch (error) {
    appError(error, res);
  }
};

// GET ALL PRODUCT
export const getAllProduct = async (req, res) => {
  try {
    const page = req.query.page ?? 1;
    let limit = req.query.per_page ?? 10;
    limit = limit > 100 ? 100 : limit;
    const skip = (page - 1) * limit;
    const product = productModel
      .find({ user_id: req?.userId, platform: 'bigcommerce' })
      .skip(skip)
      .limit(limit);
    const count = productModel.countDocuments({ user_id: req?.userId });
    const [productVal, countVal] = await Promise.allSettled([product, count]);
    if (productVal?.length <= 0) {
      return res.status(404).send({
        success: false,
        msg: 'User not found',
        data: {}
      });
    }
    res.status(200).send({
      success: true,
      msg: 'success',
      data: {
        rows: productVal?.value,
        page_context: { page, per_page: limit, has_more_page: countVal?.value > page * limit }
      }
    });
  } catch (error) {
    appError(error, res);
  }
};
