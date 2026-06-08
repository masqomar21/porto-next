import { Schema, Document, models, model } from 'mongoose';

export interface ISocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface IContact extends Document {
  email: string;
  socialLinks: ISocialLink[];
  updatedAt: Date;
}

const SocialLinkSchema = new Schema<ISocialLink>({
  platform: { type: String, required: true },
  url: { type: String, required: true },
  icon: { type: String, required: true },
}, { _id: false });

const ContactSchema = new Schema<IContact>(
  {
    email: { type: String, default: '' },
    socialLinks: { type: [SocialLinkSchema], default: [] },
  },
  { timestamps: true }
);

const Contact = models.Contact || model<IContact>('Contact', ContactSchema);
export default Contact;
