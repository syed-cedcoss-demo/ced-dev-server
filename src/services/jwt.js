import jwt from 'jsonwebtoken';

export const signJWT = async (payload, time = '12h') => {
  return await jwt.sign(payload, process.env.APP_JWT_SECRET, {
    expiresIn: time
  });
};
export const noExpireSignJWT = async (payload) => {
  return await jwt.sign(payload, process.env.NO_EXPIRE_APP_JWT_SECRET);
};

export const verifyJWT = async (token) => {
  return await jwt.verify(token, process.env.APP_JWT_SECRET);
};
export const noExpireVerifyJWT = async (token) => {
  return await jwt.verify(token, process.env.NO_EXPIRE_APP_JWT_SECRET);
};
