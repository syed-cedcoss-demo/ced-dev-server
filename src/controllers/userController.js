import userModel from '../models/userModel.js';
import appError from '../validations/appError.js';

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
    appError(error, res);
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
    appError(error, res);
  }
};
