import { model, Schema } from 'mongoose';

const productSchema = new Schema(
  {
    user_id: {
      type: String
    },
    type: {
      type: String
    },
    product_id: {
      type: String
    },
    title: {
      type: String
    },
    sku: {
      type: String
    },
    product: {
      type: Object
    }
  },
  { timestamps: true }
);

const productModel = model('product', productSchema);
export default productModel;
