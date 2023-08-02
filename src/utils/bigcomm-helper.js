import notificationModel from '../models/notificationModel.js';
import productModel from '../models/productModel.js';
import queueProcessModel from '../models/queueProcessModel.js';
import userModel from '../models/userModel.js';
import { noExpireSignJWT } from '../services/jwt.js';
import { getCall, postCall } from '../services/request.js';
import appError from '../validations/appError.js';

export const productsImport = async (id, res) => {
  // SAVE IMPORTED PRODUCTS TO DB
  const handleSaveProduct = async (page) => {
    const user = await userModel.findOne({ _id: id }, { connected_platform: 1 });
    const credential = user?.connected_platform?.find((el) => el?.platform === 'bigcommerce');
    const data = await getCall({
      storeHash: credential.store_hash,
      accessToken: credential.access_token,
      url: `v3/catalog/products?page=${page}&limit=100&include=variants`
    });
    const preparedProduct = [];
    if (data?.data?.length > 0) {
      for (const sp of data?.data) {
        if (sp?.variants?.length > 0) {
          for (const vp of sp?.variants) {
            preparedProduct.push({
              user_id: id,
              type: 'variant',
              product_id: vp?.product_id,
              title: vp?.name,
              sku: vp?.sku,
              product: vp
            });
          }
        }

        preparedProduct.push({
          user_id: id,
          type: 'simple',
          product_id: sp?.id,
          title: sp?.name,
          sku: sp?.sku,
          product: { ...sp, variants: [] }
        });
      }
      await productModel.insertMany(preparedProduct);
      if (data?.meta?.pagination?.total_pages > page) {
        handleSaveProduct(page + 1);
      } else {
        await queueProcessModel.deleteOne({
          user_id: id,
          platform: 'bigcommerce',
          process: 'product-import'
        });
        return 0;
      }
    }
  };

  try {
    // CHECK IS THERE ANY PROCESS IN QUEUE FOR THIS USER
    const process = await queueProcessModel.findOne({
      $and: [{ user_id: id }, { platform: 'bigcommerce' }, { process: 'product-import' }]
    });
    if (process?.user_id) {
      return res.status(208).send({
        success: false,
        msg: 'product import already in process',
        data: {}
      });
    }

    // create new process
    await queueProcessModel.create({
      user_id: id,
      platform: 'bigcommerce',
      process: 'product-import'
    });

    handleSaveProduct(1);

    return res.status(200).send({
      success: true,
      msg: 'product import started',
      data: {}
    });
  } catch (error) {
    await queueProcessModel.deleteOne({
      user_id: id,
      platform: 'bigcommerce',
      process: 'product-import'
    });
    appError(error, res);
  }
};

export const createWebhooks = async (props) => {
  const token = await noExpireSignJWT({ userId: props?.userId });
  webhooks({
    ...props,
    message: 'create product webhook created',
    body: {
      scope: 'store/product/created',
      destination: 'https://cedcoss-dev-server.serveo.net/big-com/product-webhooks',
      is_active: true,
      headers: {
        user_token: token
      }
    }
  });
  webhooks({
    ...props,
    message: 'delete product webhook created',
    body: {
      scope: 'store/product/deleted',
      destination: 'https://cedcoss-dev-server.serveo.net/big-com/product-webhooks',
      is_active: true,
      headers: {
        user_token: token
      }
    }
  });
  webhooks({
    ...props,
    message: 'update product webhook created',
    body: {
      scope: 'store/product/updated',
      destination: 'https://cedcoss-dev-server.serveo.net/big-com/product-webhooks',
      is_active: true,
      headers: {
        user_token: token
      }
    }
  });
};
const webhooks = async (props) => {
  try {
    await postCall({
      storeHash: props.store_hash,
      accessToken: props.access_token,
      url: 'v3/hooks',
      body: props?.body
    });
    await notificationModel.create({
      user_id: props?.userId,
      message: props?.message,
      type: 'success'
    });
  } catch (error) {
    appError(error);
    await notificationModel.create({
      user_id: props?.userId,
      message: error?.message,
      type: 'error'
    });
  }
};
