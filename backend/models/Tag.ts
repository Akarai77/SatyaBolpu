import mongoose, { Schema } from "mongoose";

const tagSchema = new Schema({
  tag: {
    type: String,
    required: true,
    unique: true
  }
});

export const Tag = mongoose.model('Tag',tagSchema);
