import mongoose, { Document, Schema } from "mongoose";

export interface ITag extends Document {
  tag: string;
}

const tagSchema = new Schema({
  tag: {
    type: String,
    required: true,
    unique: true
  }
});

export const Tag = mongoose.model('Tag',tagSchema);
