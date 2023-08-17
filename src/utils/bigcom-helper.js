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
      url: `v3/catalog/products?page=${props?.page}&limit=50&include=variants`
    });
    const per = (props?.page / data?.meta?.pagination?.total_pages) * 100;
    console.log(`${per.toFixed(2)}% product imported`);

    const preparedProduct = [];
    if (data?.data?.length > 0) {
      for await (const sp of data.data) {
        // checking product have variants or not
        if (sp?.variants?.length > 1) {
          for await (const vp of sp?.variants) {
            const payload = {
              user_id: props?.userId,
              type: 'variant',
              product_id: vp?.product_id,
              title: vp?.name,
              sku: vp?.sku,
              product: vp
            };
            const isExist = await productModel.findOne({
              user_id: props?.userId,
              product_id: vp?.product_id,
              type: 'variant'
            });
            if (!isExist) {
              preparedProduct.push(payload);
            }
          }
          // save parent product with type simple
          const isExist = await productModel.findOne({
            user_id: props?.userId,
            product_id: sp?.id,
            type: 'simple'
          });
          if (!isExist) {
            const variants = sp.variants[0];
            delete sp?.variants;
            const payload = {
              user_id: props?.userId,
              type: 'simple',
              product_id: sp?.id,
              title: sp?.name,
              sku: sp?.sku,
              product: { ...sp, ...variants }
            };
            preparedProduct.push(payload);
          }
        } else {
          const isExist = await productModel.findOne({
            user_id: props?.userId,
            product_id: sp?.id,
            type: 'simple'
          });
          if (!isExist) {
            const variants = sp.variants[0];
            delete sp?.variants;
            const payload = {
              user_id: props?.userId,
              type: 'simple',
              product_id: sp?.id,
              title: sp?.name,
              sku: sp?.sku,
              product: { ...sp, ...variants }
            };
            preparedProduct.push(payload);
          }
        }
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

// PRODUCT UPDATED ON BIG-COMMERCE STORE
export const webhookProductUpdated = async (props) => {
  try {
    console.log('product-updated-webhook: ', props);
    const user = await userModel.findOne({ _id: props?.userId });
    const credential = user?.connected_platform?.find((el) => el?.platform === 'bigcommerce');
    const res = await getCall({
      storeHash: credential?.store_hash,
      accessToken: credential?.access_token,
      url: `v3/catalog/products/${props?.productId}?include=variants`
    });

    if (res?.data?.id) {
      if (res?.data?.variants?.length > 1) {
        for await (const vp of res?.data?.variants) {
          const payload = {
            user_id: props?.userId,
            type: 'variant',
            product_id: vp?.product_id,
            title: vp?.name,
            sku: vp?.sku,
            product: vp
          };
          await productModel.updateOne(
            { user_id: props?.userId, product_id: vp?.product_id, type: 'variant' },
            { $set: payload }
          );
        }
      } else {
        const variants = res?.data.variants[0];
        delete res?.data?.variants;
        const payload = {
          user_id: props?.userId,
          type: 'simple',
          product_id: res?.data?.id,
          title: res?.data?.name,
          sku: res?.data?.sku,
          product: { ...res?.data, ...variants }
        };
        await productModel.updateOne(
          { user_id: props?.userId, product_id: res?.data?.id, type: 'simple' },
          { $set: payload }
        );
      }
    }
  } catch (error) {
    appError(error);
  }
};

// PRODUCT CREATED ON BIG-COMMERCE STORE
export const webhookProductCreated = async (props) => {
  try {
    console.log('product-created-webhook: ', props);
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

// PRODUCT DELETED ON BIG-COMMERCE STORE

export const webhookProductDeleted = async (props) => {
  try {
    console.log('product-deleted-webhook: ', props);
    await productModel.deleteMany({
      user_id: props?.userId,
      product_id: props?.productId
    });
  } catch (error) {
    appError(error);
  }
};
