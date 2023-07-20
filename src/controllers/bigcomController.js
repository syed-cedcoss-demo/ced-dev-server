import userModel from '../models/userModel.js';
import { productsImport } from '../utils/bigcomUtil.js';
import appError from '../validations/appError.js';

export const orderCreated = async (req, res) => {
  try {
    console.log('req.headers', req.headers);
    console.log('req.body', req.body);
    res.status(200).send('ok');
  } catch (error) {
    appError(res, error);
  }
};

// BIGCOMMERCE CONNECT SHOP
export const connectPlatform = async (req, res) => {
  try {
    const { storeHash, accessToken, clientId, clientSecret } = req.body;
    const payload = {
      platform: 'bigcommerce',
      store_hash: storeHash,
      access_token: accessToken,
      client_id: clientId,
      client_secret: clientSecret
    };
    const user = await userModel.find({ _id: req.userId });
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

    await userModel.updateOne({ _id: req.userId }, { $push: { connected_platform: payload } });
    productsImport(req.userId, res);
    return res.status(200).send({
      success: true,
      msg: 'account successfully connected',
      data: {}
    });
  } catch (error) {
    appError(res, error);
  }
};

// BIGCOMMERCE PRODUCTS IMPORT
export const importer = (req, res) => {
  try {
    productsImport(req.userId, res);
  } catch (error) {
    appError(res, error);
  }
};
