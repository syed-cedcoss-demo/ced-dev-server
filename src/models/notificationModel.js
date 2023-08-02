import { model, Schema } from 'mongoose';

const notificationSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true
    },
    message: {
      type: String,
      required: true
    },
    is_read: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

const notificationModel = model('notification', notificationSchema);
export default notificationModel;
