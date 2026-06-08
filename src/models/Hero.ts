import { Schema, Document, models, model } from 'mongoose';

export interface IHero extends Document {
  name: string;
  roles: string[];
  tagline: string;
  ctaPrimaryLabel: string;
  ctaPrimaryUrl: string;
  ctaSecondaryLabel: string;
  ctaSecondaryUrl: string;
  imageUrl?: string;
  updatedAt: Date;
}

const HeroSchema = new Schema<IHero>(
  {
    name: { type: String, default: 'Your Name' },
    roles: { type: [String], default: ['Full-Stack Developer', 'Open Source Enthusiast'] },
    tagline: { type: String, default: 'I build fast, beautiful, and scalable web applications.' },
    ctaPrimaryLabel: { type: String, default: 'View Projects' },
    ctaPrimaryUrl: { type: String, default: '#projects' },
    ctaSecondaryLabel: { type: String, default: 'Read Blog' },
    ctaSecondaryUrl: { type: String, default: '/blog' },
    imageUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

const Hero = models.Hero || model<IHero>('Hero', HeroSchema);
export default Hero;
