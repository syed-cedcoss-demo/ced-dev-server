import userModel from '../models/userModel.js';
import { forgetPassEmail, registrationMail } from '../services/email.js';
import { hashPassword, verifyPassword } from '../services/hash.js';
import { signJWT, verifyJWT } from '../services/jwt.js';
import { genFourDigitOTP } from '../utils/genOTP.js';
import appError from '../validations/appError.js';

export const signup = async (req, res) => {
  try {
    let payload = req.body;
    const isUser = await userModel.find({ email: { $eq: payload?.email } });
    if (isUser?.length !== 0) {
      return res.status(200).send({ success: false, msg: 'user already exist' });
    }
    const hashPass = hashPassword(payload.password);
    const otp = genFourDigitOTP();
    const allSettled = await Promise.allSettled([hashPass, otp]);
    payload = { ...payload, password: allSettled[0]?.value, otp: allSettled[1]?.value };
    const user = await userModel.create(payload);
    const token = await signJWT({ id: user?._id }, '1h');
    await registrationMail({
      name: user?.name,
      email: payload?.email,
      otp: allSettled[1]?.value,
      url: `${process.env.SERVER_URL}/auth/verify?token=${token}`
    });
    res.status(200).send({
      success: true,
      msg: 'user registration successful, check your mail to verify'
    });
  } catch (error) {
    appError(error, res);
  }
};

export const verify = async (req, res) => {
  try {
    const { token } = req.query;
    const isValid = await verifyJWT(token);
    if (isValid?.id) {
      const isActive = await userModel.updateOne(
        { _id: isValid?.id },
        { $set: { is_active: true } }
      );
      if (isActive?.modifiedCount > 0) {
        res
          .status(200)
          .send(
            '<h2 style="color:green; text-align:center;padding:30px;">Your account verification successful, Login & continue</h2>'
          );
      }
    }
  } catch (error) {
    appError(error, res);
  }
};

export const login = async (req, res) => {
  try {
    const payload = req.body;
    const user = await userModel.find(
      { email: { $eq: payload?.email } },
      { password: 1, is_active: 1 }
    );
    if (user.length <= 0) {
      return res
        .status(400)
        .send({ success: false, msg: 'Email id or password is not valid' });
    }
    if (!user?.[0]?.is_active) {
      return res.status(403).send({ success: false, msg: 'Your account is not activated' });
    }
    const isValid = await verifyPassword(payload?.password, user?.[0].password);
    if (isValid) {
      const token = await signJWT({ id: user?.[0]?._id });
      res.status(200).send({ success: true, token, msg: 'success' });
    } else {
      res.status(404).send({ success: false, msg: 'Email id or password is not valid' });
    }
  } catch (error) {
    appError(error, res);
  }
};

export const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.find({ email: { $eq: email } });
    if (user.length > 0) {
      const token = await signJWT({ id: user?.[0]?._id }, '1h');
      await forgetPassEmail({
        username: user?.username,
        email,
        url: `${process.env.SERVER_URL}/auth/reset-password?token=${token}`
      });
      res.status(200).send({
        success: true,
        msg: 'Email successfully sent, check your inbox or spam folder'
      });
    } else {
      res.status(404).send({ success: false, msg: 'Email not found' });
    }
  } catch (error) {
    appError(error, res);
  }
};

export const resetPassword = async (req, res) => {
  try {
    const payload = req.body;
    const isValid = await verifyJWT(payload?.token);
    if (isValid?.id) {
      const hashPass = await hashPassword(payload.password);
      const isActive = await userModel.updateOne(
        { _id: isValid?.id },
        { $set: { password: hashPass } }
      );
      if (isActive?.modifiedCount > 0) {
        res.status(200).send({ success: true, msg: 'Password successfully updated' });
      }
    } else {
      res.status(402).send({ success: false, msg: 'Invalid token' });
    }
  } catch (error) {
    appError(error, res);
  }
};
