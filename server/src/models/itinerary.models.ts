import mongoose, { Schema, Document } from "mongoose";
import { IDay } from "../types";

export interface IItineraryDocument extends Document {
    user: mongoose.Types.ObjectId
    title: string
    description?: string
    coverImage?: string
    duration: number
    days: IDay[]
    featured: boolean
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

    activities: [
        {
            type: String,
            required: true
        }
    ],

    destinations: [
        {
            type: Schema.Types.ObjectId,
            ref: "Place"
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

        description: {
            type: String
        },

        coverImage: {
            type: String
        },

        duration: {
            type: Number,
            required: true
        },

        days: [daySchema],

        featured: {
            type: Boolean,
            default: false
        },

        status: {
            type: String,
            enum: ["draft", "pending_review", "published"],
            default: "draft"
        },

        createdBy: {
            type: String
        },

        updatedBy: {
            type: String
        }
    },
    { timestamps: true }
);

export const Itinerary = mongoose.model<IItineraryDocument>("Itinerary", itinerarySchema);