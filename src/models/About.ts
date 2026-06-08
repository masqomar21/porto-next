import { Schema, Document, models, model } from 'mongoose';

export interface IAbout extends Document {
  bio: string;
  photoUrl: string;
  resumeUrl: string;
  updatedAt: Date;
}

const AboutSchema = new Schema<IAbout>(
  {
    bio: { type: String, default: 'Write your bio here...' },
    photoUrl: { type: String, default: '' },
    resumeUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

const About = models.About || model<IAbout>('About', AboutSchema);
export default About;
