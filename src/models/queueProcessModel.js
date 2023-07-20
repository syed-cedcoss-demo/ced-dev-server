import { model, Schema } from 'mongoose';

const queueProcessSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'user'
    },
    process: {
      type: String
    },
    platform: {
      type: String
    }
  },
  { timestamps: true }
);

const queueProcessModel = model('queue_process', queueProcessSchema);
export default queueProcessModel;
