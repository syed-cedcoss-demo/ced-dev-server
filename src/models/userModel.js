import { model, Schema } from 'mongoose';

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      require: true
    },
    name: {
      type: String
    },
    password: {
      type: String,
      select: false
    },
    username: {
      type: String,
      unique: true
    },
    profile_pic: {
      type: String
    },
    is_active: {
      type: Boolean,
      default: false
    },
    otp: {
      type: Number,
      default: Math.floor(Math.random() * 10000),
      select: false
    },
    connected_platform: {
      type: Array
    }
  },
  { timestamps: true }
);

const userModel = model('user', userSchema);
export default userModel;
