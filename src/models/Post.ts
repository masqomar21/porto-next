import { Schema, Document, models, model } from 'mongoose';

export interface IPost extends Document {
  title: string;
  slug: string;
  excerpt: string;
  coverUrl: string;
  content: string; // HTML from TipTap
  tags: string[];
  published: boolean;
  views: number;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    excerpt: { type: String, default: '' },
    coverUrl: { type: String, default: '' },
    content: { type: String, default: '' },
    tags: { type: [String], default: [] },
    published: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Post = models.Post || model<IPost>('Post', PostSchema);
export default Post;
