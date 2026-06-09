import { Schema, Document, models, model } from 'mongoose';

export interface INavbar extends Document {
  title: string;
  imageUrl: string;
  sectionOrder: string[];
  updatedAt: Date;
}

const NavbarSchema = new Schema<INavbar>(
  {
    title: { type: String, default: 'My Portfolio' },
    imageUrl: { type: String, default: '' },
    sectionOrder: {
      type: [String],
      default: ['hero', 'about', 'experience', 'skills', 'projects', 'blog', 'contact'],
    },
  },
  { timestamps: true }
);

if (models.Navbar) {
  delete (models as any).Navbar;
}
const Navbar = model<INavbar>('Navbar', NavbarSchema);
export default Navbar;
