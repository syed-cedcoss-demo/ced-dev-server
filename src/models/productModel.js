import { model, Schema } from 'mongoose';

const productSchema = new Schema(
  {
    user_id: {
      type: String
    },
    source_product_id: {
      type: String
    },
    source_product_name: {
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
