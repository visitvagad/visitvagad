import mongoose, { Schema, Document } from "mongoose";

export interface IEvent extends Document {
  name: string;
  date: string;
  location: string;
  description: string;
  culturalSignificance: string;
  image: string;
  recurring: boolean;
  status?: "draft" | "pending_review" | "published";
  createdBy?: string;
  updatedBy?: string;
}

const eventSchema: Schema = new Schema({
  name: { type: String, required: true },
  date: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  culturalSignificance: { type: String, required: true },
  image: { type: String, required: true },
  recurring: { type: Boolean, default: false },
  status: { type: String, enum: ["draft", "pending_review", "published"], default: "draft" },
  createdBy: { type: String, required: true },
  updatedBy: { type: String }
}, { timestamps: true });

export default mongoose.model<IEvent>("Event", eventSchema);
