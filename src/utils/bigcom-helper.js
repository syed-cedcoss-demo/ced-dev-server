import notificationModel from '../models/notificationModel.js';
import productModel from '../models/productModel.js';
import queueProcessModel from '../models/queueProcessModel.js';
import userModel from '../models/userModel.js';
import { noExpireSignJWT } from '../services/jwt.js';
import { getCall, postCall } from '../services/request.js';
import appError from '../validations/appError.js';

export const productsImport = async (props) => {
  try {
    const data = await getCall({
      storeHash: props?.store_hash,
      accessToken: props?.access_token,
      url: `v3/catalog/products?page=${props?.page}&limit=100&include=variants`
    });
    console.log(
      `page ${props?.page} next ${data?.data?.length} data imported, total: `,
      data?.data?.length * props?.page
    );
    const preparedProduct = [];
    if (data?.data?.length > 0) {
      for (const sp of data?.data) {
        if (sp?.variants?.length > 0) {
          for (const vp of sp?.variants) {
            preparedProduct.push({
              user_id: props?.userId,
              type: 'variant',
              product_id: vp?.product_id,
              title: vp?.name,
              sku: vp?.sku,
              product: vp
            });
          }
        }

        preparedProduct.push({
          user_id: props?.userId,
          type: 'simple',
          product_id: sp?.id,
          title: sp?.name,
          sku: sp?.sku,
          product: { ...sp, variants: [] }
        });
      }
      await productModel.insertMany(preparedProduct);
      if (data?.meta?.pagination?.total_pages > props?.page) {
        productsImport({ ...props, page: props?.page + 1 });
      } else {
        await queueProcessModel.deleteOne({
          user_id: props?.userId,
          platform: 'bigcommerce',
          process: 'product-import'
        });
        await notificationModel.create({
          user_id: props?.userId,
          message: 'Product Import Completed',
          type: 'success'
        });
      }
    }
  } catch (error) {
    console.log('error?.message', error?.message);
    await queueProcessModel.deleteOne({
      user_id: props?.userId,
      platform: 'bigcommerce',
      process: 'product-import'
    });
    await notificationModel.create({
      user_id: props?.userId,
      message: error?.message,
      type: 'error'
    });
  }
};

export const createWebhooks = async (props) => {
  const token = await noExpireSignJWT({ userId: props?.userId });
  // PRODUCTS WEBHOOKS
  webhooks({
    ...props,
    message: 'create product webhook created',
    body: {
      scope: 'store/product/created',
      destination: `${process.env.SERVER_URL}/big-com/product-webhooks`,
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
      destination: `${process.env.SERVER_URL}/big-com/product-webhooks`,
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
      destination: `${process.env.SERVER_URL}/big-com/product-webhooks`,
      is_active: true,
      headers: {
        user_token: token
      }
    }
  });

  // ORDERS WEBHOOKS
  webhooks({
    ...props,
    message: 'create order webhook created',
    body: {
      scope: 'store/order/created',
      destination: `${process.env.SERVER_URL}/big-com/order-webhooks`,
      is_active: true,
      headers: {
        user_token: token
      }
    }
  });
  webhooks({
    ...props,
    message: 'create order webhook updated',
    body: {
      scope: 'store/order/updated',
      destination: `${process.env.SERVER_URL}/big-com/order-webhooks`,
      is_active: true,
      headers: {
        user_token: token
      }
    }
  });
  webhooks({
    ...props,
    message: 'create order webhook archived',
    body: {
      scope: 'store/order/archived',
      destination: `${process.env.SERVER_URL}/big-com/order-webhooks`,
      is_active: true,
      headers: {
        user_token: token
      }
    }
  });
};
const webhooks = async (props) => {
  try {
    const res = await postCall({
      storeHash: props.store_hash,
      accessToken: props.access_token,
      url: 'v3/hooks',
      body: props?.body
    });
    if (res?.data?.id) {
      await notificationModel.create({
        user_id: props?.userId,
        message: props?.message,
        type: 'success'
      });
    } else {
      await notificationModel.create({
        user_id: props?.userId,
        message: props?.message,
        type: 'success'
      });
    }
  } catch (error) {
    appError(error);
    await notificationModel.create({
      user_id: props?.userId,
      message: error?.message,
      type: 'error'
    });
  }
};

// PRODUCT UPDATED ON BIGCOMMERCE STORE
export const webhookProductUpdated = async (props) => {
  console.log('props', props);
  try {
    const user = await userModel.findOne({ _id: props?.userId });
    const credential = user?.connected_platform?.find((el) => el?.platform === 'bigcommerce');
    const res = await getCall({
      storeHash: credential?.store_hash,
      accessToken: credential?.access_token,
      url: `v3/catalog/products/${props?.productId}?include=variants`
    });
    const preparedProduct = [];

    if (res?.data?.variants?.length > 0) {
      for (const vp of res?.data?.variants) {
        preparedProduct.push({
          user_id: props?.userId,
          type: 'variant',
          product_id: vp?.product_id,
          title: vp?.name,
          sku: vp?.sku,
          product: vp
        });
      }
    }
    preparedProduct.push({
      user_id: props?.userId,
      type: 'simple',
      product_id: res?.data?.id,
      title: res?.data?.name,
      sku: res?.data?.sku,
      product: { ...res?.data, variants: [] }
    });
    await productModel.updateMany(
      {
        $and: [{ user_id: props?.userId }, { product_id: props?.productId }]
      },
      preparedProduct
    );
  } catch (error) {
    appError(error);
  }
};

// PRODUCT CREATED ON BIG-COMMERCE STORE
export const webhookProductCreated = async (props) => {
  try {
    const user = await userModel.findOne({ _id: props?.userId });
    const credential = user?.connected_platform?.find((el) => el?.platform === 'bigcommerce');
    const res = await getCall({
      storeHash: credential?.store_hash,
      accessToken: credential?.access_token,
      url: `v3/catalog/products/${props?.productId}?include=variants`
    });
    const preparedProduct = [];

    if (res?.data?.variants?.length > 0) {
      for (const vp of res?.data?.variants) {
        preparedProduct.push({
          user_id: props?.userId,
          type: 'variant',
          product_id: vp?.product_id,
          title: vp?.name,
          sku: vp?.sku,
          product: vp
        });
      }
    }
    preparedProduct.push({
      user_id: props?.userId,
      type: 'simple',
      product_id: res?.data?.id,
      title: res?.data?.name,
      sku: res?.data?.sku,
      product: { ...res?.data, variants: [] }
    });
    await productModel.create(preparedProduct);
  } catch (error) {
    appError(error);
  }
};
