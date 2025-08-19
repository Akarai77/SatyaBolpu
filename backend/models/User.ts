import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  uname: string;
  email: string;
  phone: number;
  role: 'user' | 'admin';
  verified: boolean;
  password: string;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  uname: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  verified: {
    type: Boolean,
    default: false
  },
  password: {
    type: String,
    required: true,
  },
},{ timestamps: true });

export const User = mongoose.model<IUser>('User',userSchema);
