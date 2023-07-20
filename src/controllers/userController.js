import { v2 as cloudinary } from 'cloudinary';
import multiparty from 'multiparty';
import util from 'util';
import userModel from '../models/userModel.js';
import appError from '../validations/appError.js';

// CLOUDINARY CONFIG
cloudinary.config({
  cloud_name: 'di1gp4ac6',
  api_key: '252421633165296',
  api_secret: 'Lq_1V8VwTKXsV7_gHSzxKoj5XYQ',
  secure: true
});
cloudinary.uploader.upload = util.promisify(cloudinary.uploader.upload);

// // multiparty
const form = new multiparty.Form();
form.setMaxListeners(15);
// form.parse = util.promisify(form.parse);

// get an user
export const getUser = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req?.userId });
    if (user?.length <= 0) {
      return res.status(404).send({
        success: false,
        msg: 'User not found',
        data: {}
      });
    }
    res.status(200).send({
      success: true,
      msg: 'success',
      data: { rows: user, meta: {} }
    });
  } catch (error) {
    appError(res, error);
  }
};
// get all users
export const getAllUser = async (req, res) => {
  try {
    const page = req.query.page ?? 1;
    let limit = req.query.limit ?? 10;
    limit = limit > 100 ? 100 : limit;
    const skip = (page - 1) * limit;

    const user = userModel.find({}).skip(skip).limit(limit);
    const count = userModel.countDocuments({});
    const [userVal, countVal] = await Promise.allSettled([user, count]);
    if (user?.length <= 0) {
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
        users: userVal?.value,
        page_context: { page, per_page: limit, has_more_page: countVal?.value > page * limit }
      }
    });
  } catch (error) {
    appError(res, error);
  }
};

// update user profile
export const updateProfile = async (req, res) => {
  try {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return res.status(500).json({ error: 'Error processing the file upload' });
      }
      console.log('files', files);
      console.log('fields', fields);
    });
    // console.log('req.file', req.file);
    // const response = await cloudinary.uploader.upload(req.file.buffer, {
    //   folder: 'ced_dev_server_img',
    //   use_filename: true
    // });
    // console.log('response', response);
    res.status(200).send('ok');
  } catch (error) {
    console.log('error', error);
    res.status(500).send('error');
  }
};
