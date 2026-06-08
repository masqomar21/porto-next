import { Schema, Document, models, model } from 'mongoose';

export interface IProject extends Document {
  title: string;
  slug: string;
  excerpt: string;
  coverUrl: string;
  content: string; // HTML from TipTap
  tags: string[];
  liveUrl: string;
  githubUrl: string;
  featured: boolean;
  order: number;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    excerpt: { type: String, default: '' },
    coverUrl: { type: String, default: '' },
    content: { type: String, default: '' },
    tags: { type: [String], default: [] },
    liveUrl: { type: String, default: '' },
    githubUrl: { type: String, default: '' },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Project = models.Project || model<IProject>('Project', ProjectSchema);
export default Project;
