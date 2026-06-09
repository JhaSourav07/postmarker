import mongoose, { Schema, Document, Model } from "mongoose";

export interface IThread extends Document {
  threadId: string;
  userEmail: string;
  tempEmail: string;
  hashedToken: string;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
}

const ThreadSchema: Schema<IThread> = new Schema(
  {
    threadId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    tempEmail: {
      type: String,
      required: true,
      unique: true,
    },
    hashedToken: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
  },
  {
    timestamps: true,
  }
);

const Thread: Model<IThread> =
  mongoose.models.Thread || mongoose.model<IThread>("Thread", ThreadSchema);

export default Thread;
