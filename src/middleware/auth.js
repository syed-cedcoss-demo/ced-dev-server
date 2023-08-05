import { noExpireVerifyJWT, verifyJWT } from '../services/jwt.js';
import appError from '../validations/appError.js';

export const auth = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const token = authorization?.split(' ')?.[1];
    const isValid = await verifyJWT(token);
    if (isValid?.id) {
      req.userId = isValid.id;
      req.token = token;
      next();
    } else {
      res.status(402).send({ success: false, msg: 'token verification error' });
    }
  } catch (error) {
    appError(error, res);
  }
};

export const webhookAuth = async (req, res, next) => {
  try {
    const token = req?.headers?.user_token;
    const isValid = await noExpireVerifyJWT(token);
    if (isValid?.userId) {
      req.userId = isValid.userId;
      req.token = token;
      next();
    } else {
      res.status(402).send({ success: false, msg: 'token verification error' });
    }
  } catch (error) {
    appError(error, res);
  }
};
