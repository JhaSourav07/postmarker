import mongoose, { Schema, Document, Model } from "mongoose";

export interface IThread extends Document {
  threadId: string;
  userEmail: string;
  tempEmail: string;
  hashedToken: string;
  /**
   * The email address the original message was sent TO.
   * Used by IMAP sync to only accept replies from the intended recipient.
   */
  recipientEmail?: string;
  /**
   * The Message-ID of the original outbound email (set by Nodemailer).
   * Used by IMAP sync to verify genuine replies via In-Reply-To / References.
   */
  sentMessageId?: string;
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
    sentMessageId: {
      type: String,
      default: null,
    },
    recipientEmail: {
      type: String,
      default: null,
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
