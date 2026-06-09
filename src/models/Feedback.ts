import mongoose, { Schema, Document } from "mongoose";

export interface IFeedback extends Document {
  name?: string;
  email?: string;
  message: string;
  type: "feedback" | "bug";
  status: "new" | "reviewed" | "resolved";
  createdAt: Date;
}

const FeedbackSchema: Schema = new Schema({
  name: { type: String, trim: true },
  email: { type: String, trim: true, lowercase: true },
  message: { type: String, required: true, trim: true, maxlength: 2000 },
  type: { type: String, enum: ["feedback", "bug"], required: true },
  status: { type: String, enum: ["new", "reviewed", "resolved"], default: "new" },
  createdAt: { type: Date, default: Date.now },
});

// Use existing model or create a new one
export default mongoose.models.Feedback ||
  mongoose.model<IFeedback>("Feedback", FeedbackSchema);
