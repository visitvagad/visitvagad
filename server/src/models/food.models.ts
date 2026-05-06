import mongoose, { Schema, Document } from "mongoose";

export interface IFood extends Document {
  name: string;
  category: string;
  description: string;
  image: string;
  status?: "draft" | "pending_review" | "published";
  createdBy?: string;
  updatedBy?: string;
}

const foodSchema: Schema = new Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  status: { type: String, enum: ["draft", "pending_review", "published"], default: "draft" },
  createdBy: { type: String, required: true },
  updatedBy: { type: String }
}, { timestamps: true });

export default mongoose.model<IFood>("Food", foodSchema);
