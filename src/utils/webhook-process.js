import chalk from 'chalk';
import orderModel from '../models/orderModel.js';
import productModel from '../models/productModel.js';
import userModel from '../models/userModel.js';
import webhooksModel from '../models/webhookModel.js';
import { getCall } from '../services/request.js';
import appError from '../validations/appError.js';

export const webhooksProcess = async () => {
  try {
    const data = await webhooksModel.findOne({});
    let status = false;
    if (data?.scope === 'store/product/updated') {
      status = await webhookProductUpdated({ userId: data?.user_id, productId: data?.id });
    } else if (data?.scope === 'store/product/created') {
      status = await webhookProductCreated({ userId: data?.user_id, productId: data?.id });
    } else if (data?.scope === 'store/product/deleted') {
      status = await webhookProductDeleted({ userId: data?.user_id, productId: data?.id });
    } else if (data?.scope === 'store/order/created') {
      status = await webhookOrderCreated({ userId: data?.user_id, orderId: data?.id });
    } else if (data?.scope === 'store/order/updated') {
      status = await webhookOrderUpdated({ userId: data?.user_id, orderId: data?.id });
    }
    if (status) {
      await webhooksModel.deleteOne({
        user_id: data?.user_id,
        scope: data?.scope,
        platform: 'bigcommerce'
      });
      console.log(chalk.bgCyan.bold(`Webhooks ${data?.scope} trigger, status: ${status}`));
    }
    setInterval(() => {
      webhooksProcess();
    }, 1000 * 30);
  } catch (error) {
    appError(error);
  }
};

// PRODUCT UPDATED ON BIG-COMMERCE STORE
const webhookProductUpdated = async (props) => {
  try {
    const user = await userModel.findOne({ _id: props?.userId });
    const credential = user?.connected_platform?.find((el) => el?.platform === 'bigcommerce');
    const res = await getCall({
      storeHash: credential?.store_hash,
      accessToken: credential?.access_token,
      url: `v3/catalog/products/${props?.productId}?include=variants`
    });
    if (res?.data?.id) {
      if (res?.data?.variants?.length > 1) {
        for await (const vp of res.data.variants) {
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
        return true;
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
        return true;
      }
    }
    return false;
  } catch (error) {
    appError(error);
  }
};

// PRODUCT CREATED ON BIG-COMMERCE STORE
const webhookProductCreated = async (props) => {
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
      for (const vp of res.data.variants) {
        preparedProduct.push({
          user_id: props?.userId,
          type: 'variant',
          product_id: vp?.product_id,
          title: vp?.name,
          sku: vp?.sku,
          product: vp,
          platform: 'bigcommerce'
        });
      }
      return true;
    }
    preparedProduct.push({
      user_id: props?.userId,
      type: 'simple',
      product_id: res?.data?.id,
      title: res?.data?.name,
      sku: res?.data?.sku,
      platform: 'bigcommerce',
      product: { ...res?.data, variants: [] }
    });
    await productModel.create(preparedProduct);
    return true;
  } catch (error) {
    appError(error);
  }
};

// PRODUCT DELETED ON BIG-COMMERCE STORE
const webhookProductDeleted = async (props) => {
  try {
    await productModel.deleteMany({
      user_id: props?.userId,
      product_id: props?.productId
    });
  } catch (error) {
    appError(error);
  }
};

// ORDER CREATED ON BIG-COMMERCE STORE
const webhookOrderCreated = async (props) => {
  try {
    const user = await userModel.findOne({ _id: props?.userId });
    const credential = user?.connected_platform?.find((el) => el?.platform === 'bigcommerce');
    const res = await getCall({
      storeHash: credential?.store_hash,
      accessToken: credential?.access_token,
      url: `v2/orders/${props?.orderId}`
    });
    if (res?.id) {
      const payload = {
        user_id: props?.userId,
        order_id: res?.id,
        order_status: res?.status,
        platform: 'bigcommerce',
        order: res
      };
      const order = await orderModel.create(payload);
      return !!order?.user_id;
    }
  } catch (error) {
    appError(error);
  }
};

// ORDER CREATED ON BIG-COMMERCE STORE
const webhookOrderUpdated = async (props) => {
  try {
    const user = await userModel.findOne({ _id: props?.userId });
    const credential = user?.connected_platform?.find((el) => el?.platform === 'bigcommerce');
    const res = await getCall({
      storeHash: credential?.store_hash,
      accessToken: credential?.access_token,
      url: `v2/orders/${props?.orderId}`
    });
    if (res?.id) {
      const payload = {
        user_id: props?.userId,
        order_id: res?.id,
        order_status: res?.status,
        platform: 'bigcommerce',
        order: res
      };
      const order = await orderModel.updateOne(
        { user_id: props?.userId, order_id: res?.id, platform: 'bigcommerce' },
        { $set: payload }
      );
      return order?.modifiedCount > 0;
    }
    return false;
  } catch (error) {
    appError(error);
  }
};
