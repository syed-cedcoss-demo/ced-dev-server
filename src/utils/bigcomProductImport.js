/* eslint-disable camelcase */
import notificationModel from '../models/notificationModel.js';
import productModel from '../models/productModel.js';
import queueProcessModel from '../models/queueProcessModel.js';
import { getCall } from '../services/request.js';
import appError from '../validations/appError.js';

/*
const productsImport = async (props) => {
  try {
    const data = await getCall({
      storeHash: props?.store_hash,
      accessToken: props?.access_token,
      url: `v3/catalog/products?page=${props?.page}&limit=50&include=variants`
    });
    const per = (props?.page / data?.meta?.pagination?.total_pages) * 100;
    console.log(`product: ${per.toFixed(2)}% imported, user: ${props?.userId}`);
    const preparedProduct = [];
    if (data?.data?.length > 0) {
      for await (const sp of data.data) {
        // checking product have variants or not
        if (sp?.variants?.length > 1) {
          for await (const vp of sp.variants) {
            const payload = {
              user_id: props?.userId,
              type: 'variant',
              product_id: vp?.product_id,
              title: vp?.name,
              sku: vp?.sku,
              product: vp,
              platform: 'bigcommerce'
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
              platform: 'bigcommerce',
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
              platform: 'bigcommerce',
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
    appError(error);
  }
};
*/

const productsImport = async (props) => {
  try {
    const { userId, store_hash, access_token, page } = props;

    const data = await getCall({
      storeHash: store_hash,
      accessToken: access_token,
      url: `v3/catalog/products?page=${page}&limit=50&include=variants`
    });

    const per = (page / data?.meta?.pagination?.total_pages) * 100;
    console.log(`product: ${per.toFixed(2)}% imported, user: ${userId}`);

    const preparedProduct = [];

    if (data?.data?.length > 0) {
      // Cache for existing products
      const existingProductsCache = new Set();

      for await (const sp of data.data) {
        const productType = sp?.variants?.length > 1 ? 'variant' : 'simple';

        for await (const vp of sp.variants) {
          const product_id = vp?.product_id;

          if (!existingProductsCache.has(product_id)) {
            existingProductsCache.add(product_id);

            const payload = {
              user_id: userId,
              type: productType,
              product_id,
              title: vp?.name,
              sku: vp?.sku,
              product: vp,
              platform: 'bigcommerce'
            };

            preparedProduct.push(payload);
          }
        }
      }

      if (preparedProduct.length > 0) {
        await productModel.insertMany(preparedProduct);
      }

      if (data?.meta?.pagination?.total_pages > page) {
        await productsImport({ ...props, page: page + 1 });
      } else {
        await queueProcessModel.deleteOne({
          user_id: userId,
          platform: 'bigcommerce',
          process: 'product-import'
        });

        await notificationModel.create({
          user_id: userId,
          message: 'Product Import Completed',
          type: 'success'
        });
      }
    }
  } catch (error) {
    await queueProcessModel.deleteOne({
      user_id: props.userId,
      platform: 'bigcommerce',
      process: 'product-import'
    });

    await notificationModel.create({
      user_id: props.userId,
      message: error?.message,
      type: 'error'
    });

    appError(error);
  }
};

export default productsImport;
