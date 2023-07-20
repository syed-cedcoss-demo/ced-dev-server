import queueProcessModel from '../models/queueProcessModel';
import userModel from '../models/userModel';

export const productsImport = async (prop, res) => {
  try {
    // check is there any process in queue for this user
    const process = queueProcessModel.findOne({
      $and: [{ user_id: prop.id }, { platform: 'big-com' }, { process: 'product-import' }]
    });
    if (process?.length > 0) {
      return res.status(208).send({
        success: true,
        msg: 'product import already in process'
      });
    }
    // get big-commerce credentials
    const user = userModel.findOne({ _id: prop.id }, { connected_platform: 1 });
    console.log('user', user);
  } catch (error) {
    console.log('error', error);
  }
};
