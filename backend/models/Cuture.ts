import mongoose, { Document, Schema } from 'mongoose';

export interface ICulture extends Document {
  name: string;
  descr: string;
  image: string;
  posts: number;
}

const cultureSchema = new Schema<ICulture>({
  name: {
    type: String,
    required: true,
  },
  descr: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  posts: {
    type: Number,
    required: true
  }
});

export const Culture = mongoose.model<ICulture>('Culture',cultureSchema);
