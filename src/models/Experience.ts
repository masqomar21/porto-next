import { Schema, Document, models, model } from 'mongoose';

export interface IExperienceLink {
  label: string;
  url: string;
}

export interface IExperience extends Document {
  role: string;
  company: string;
  companyUrl: string;
  duration: string;
  description: string;
  tags: string[];
  links: IExperienceLink[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ExperienceSchema = new Schema<IExperience>(
  {
    role: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    companyUrl: { type: String, default: '', trim: true },
    duration: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    tags: { type: [String], default: [] },
    links: [
      {
        label: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Experience = models.Experience || model<IExperience>('Experience', ExperienceSchema);
export default Experience;
