import { model, Schema } from 'mongoose';

const webhooksSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'user'
    },
    scope: {
      type: String
    },
    id: {
      type: String
    },
    platform: {
      type: String
    }
  },
  { timestamps: true }
);

const webhooksModel = model('webhook', webhooksSchema);
export default webhooksModel;
