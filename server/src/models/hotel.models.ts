import mongoose, { Schema, Document } from "mongoose";

export interface IHotel extends Document {
  name: string;
  category: string;
  priceRange: string;
  amenities: string[];
  rating: number;
  bookingLink?: string;
  verified: boolean;
  image: string;
  status?: "draft" | "pending_review" | "published";
  createdBy?: string;
  updatedBy?: string;
}

const hotelSchema: Schema = new Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  priceRange: { type: String, required: true },
  amenities: [{ type: String }],
  rating: { type: Number, default: 0, min: 0, max: 5 },
  bookingLink: { type: String },
  verified: { type: Boolean, default: false },
  image: { type: String, required: true },
  status: { type: String, enum: ["draft", "pending_review", "published"], default: "draft" },
  createdBy: { type: String, required: true },
  updatedBy: { type: String }
}, { timestamps: true });

export default mongoose.model<IHotel>("Hotel", hotelSchema);
