import { model, Schema } from 'mongoose';

const orderSchema = new Schema(
  {
    user_id: {
      type: String
    },
    order_id: {
      type: String
    },
    order_status: {
      type: String
    },
    platform: {
      type: String
    },
    order: {
      type: Object
    }
  },
  { timestamps: true }
);

const orderModel = model('order', orderSchema);
export default orderModel;
