import mongoose, { Document, Schema } from "mongoose";

interface ILocation {
  district: string;
  taluk: string;
  village: string;
  lat: number;
  lng: number;
}

export interface IPost extends Document {
  mainTitle: string;
  shortTitle: string;
  culture: "daivaradhane" | "nagaradhane" | "yakshagana" | "kambala";
  description: string;
  tags: string[];
  image: string;
  content: string;
  location?: ILocation;
}

const locationSchema = new Schema<ILocation>({
  district: { type: String, required: true },
  taluk: { type: String },
  village: { type: String, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
}, { _id: false });

const postSchema = new Schema<IPost>({
  mainTitle: {
    type: String,
    required: true
  },
  shortTitle: {
    type: String,
    required: true
  },
  culture: {
    type: String,
    enum: ["daivaradhane", "nagaradhane", "yakshagana", "kambala"],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  tags: {
    type: [String],
    required: true,
    validate: [(val: string[]) => val.length > 0, 'At least one tag required']
  },
  image: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  location: {
    type: locationSchema,
    required: false
  }
}, { timestamps: true });

postSchema.index({ culture: 1 });
postSchema.index({ tags: 1 });
postSchema.index({ createdAt: -1 });
postSchema.index({ "location.lng": 1, "location.lat": 1 });

export const Post = mongoose.model<IPost>('Post',postSchema);
