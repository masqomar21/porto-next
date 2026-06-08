import { Schema, Document, models, model } from 'mongoose';

export interface ISkill extends Document {
  category: string;
  name: string;
  level: number; // 0–100
  icon?: string;
  order: number;
  categoryOrder: number;
}

const SkillSchema = new Schema<ISkill>(
  {
    category: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    level: { type: Number, required: true, min: 0, max: 100, default: 80 },
    icon: { type: String },
    order: { type: Number, default: 0 },
    categoryOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Skill = models.Skill || model<ISkill>('Skill', SkillSchema);
export default Skill;
