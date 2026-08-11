import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IInboxMessage extends Document {
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const InboxMessageSchema: Schema<IInboxMessage> = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const InboxMessage: Model<IInboxMessage> =
  mongoose.models.InboxMessage || mongoose.model<IInboxMessage>('InboxMessage', InboxMessageSchema);

export default InboxMessage;
