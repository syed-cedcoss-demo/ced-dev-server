import userModel from '../models/userModel.js';
import { getCall } from '../services/request.js';
import appError from '../validations/appError.js';
import {
  emailValidation,
  passwordValidation,
  usernameValidation
} from '../validations/fieldsValidation.js';

export const signupValidate = (req, res, next) => {
  const { email, password, username } = req.body;
  if (!email || !password || !username) {
    return res.status(406).send({
      success: false,
      msg: 'email, password and username are required'
    });
  }
  const isEmailValid = emailValidation(email);
  if (!isEmailValid?.success) {
    return res.status(406).send({
      success: false,
      msg: isEmailValid.msg
    });
  }
  const isValidPassword = passwordValidation(password);
  if (!isValidPassword?.success) {
    return res.status(406).send({
      success: false,
      msg: isValidPassword.msg
    });
  }
  const isValidUsername = usernameValidation(username);
  if (!isValidUsername?.success) {
    return res.status(406).send({
      success: false,
      msg: isValidUsername.msg
    });
  }
  next();
};

export const loginValidate = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(406).send({
      success: false,
      msg: 'email and password are required'
    });
  }
  const isEmailValid = emailValidation(email);
  if (!isEmailValid?.success) {
    return res.status(406).send({
      success: false,
      msg: isEmailValid.msg
    });
  }
  const isValidPassword = passwordValidation(password);
  if (!isValidPassword?.success) {
    return res.status(406).send({
      success: false,
      msg: isValidPassword.msg
    });
  }
  next();
};

export const isValidConnectBody = async (req, res, next) => {
  try {
    // CHECK IS ALL DETAILS ARE PROVIDED
    const { storeHash, accessToken, clientId, clientSecret } = req.body;
    if (!storeHash || !accessToken || !clientId || !clientSecret) {
      return res.status(406).send({
        success: false,
        msg: 'storeHash, accessToken, clientId and clientSecret are required'
      });
    }

    // CHECK IF THE CLIENT CREDENTIALS ARE VALID
    const isClientValid = await getCall({
      url: 'v3/catalog/products?page=1&limit=1',
      storeHash,
      accessToken
    });
    if (!isClientValid?.data) {
      return res.status(400).send({
        success: false,
        msg: 'Your credentials are invalid',
        data: {}
      });
    }

    // CHECK THE STORE IS ALREADY CONNECTED WITH ANOTHER ACCOUNT
    const isStoreConnected = await userModel.findOne(
      {
        connected_platform: { $elemMatch: { store_hash: storeHash } }
      },
      { connected_platform: 1 }
    );
    if (isStoreConnected?._id) {
      return res.status(406).send({
        success: false,
        msg: 'This store is already connected with another account',
        data: {}
      });
    }
    next();
  } catch (error) {
    appError(res, error);
  }
};
