import { Schema, Document, models, model } from 'mongoose';

export interface INavbar extends Document {
  title: string;
  imageUrl: string;
  updatedAt: Date;
}

const NavbarSchema = new Schema<INavbar>(
  {
    title: { type: String, default: 'My Portfolio' },
    imageUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

const Navbar = models.Navbar || model<INavbar>('Navbar', NavbarSchema);
export default Navbar;
