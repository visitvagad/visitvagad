import mongoose, { Schema, Document } from "mongoose";
import { IDay } from "../types";

export interface IItineraryDocument extends Document {
    user: mongoose.Types.ObjectId
    title: string
    duration: number
    days: IDay[]
    isPublic: boolean
    status?: "draft" | "pending_review" | "published"
    createdBy?: string
    updatedBy?: string
    createdAt: Date
    updatedAt: Date
}
/* ---------------- Day Schema ---------------- */

const daySchema = new Schema({
    dayNumber: {
        type: Number,
        required: true
    },

    places: [
        {
            type: Schema.Types.ObjectId,
            ref: "Place",
            required: true
        }
    ],

    notes: {
        type: String
    }
});


/* ---------------- Itinerary Schema ---------------- */

const itinerarySchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        title: {
            type: String,
            required: true
        },

        duration: {
            type: Number,
            required: true
        },

        days: [daySchema],

        isPublic: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

export const Itinerary = mongoose.model<IItineraryDocument>("Itinerary", itinerarySchema);