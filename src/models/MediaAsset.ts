import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMediaAsset extends Document {
  filename: string;
  url: string;
  key: string;
  size: number;
  mimeType: string;
  createdAt: Date;
  updatedAt: Date;
}

const MediaAssetSchema: Schema<IMediaAsset> = new Schema(
  {
    filename: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    key: { type: String, required: true, trim: true },
    size: { type: Number, required: true, default: 0 },
    mimeType: { type: String, required: true, default: 'image/jpeg' },
  },
  { timestamps: true }
);

const MediaAsset: Model<IMediaAsset> =
  mongoose.models.MediaAsset || mongoose.model<IMediaAsset>('MediaAsset', MediaAssetSchema);

export default MediaAsset;
