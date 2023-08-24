import notificationModel from '../models/notificationModel.js';
import productModel from '../models/productModel.js';
import queueProcessModel from '../models/queueProcessModel.js';
import { getCall } from '../services/request.js';
import appError from '../validations/appError.js';

const productsImport = async (props) => {
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

export default productsImport;
