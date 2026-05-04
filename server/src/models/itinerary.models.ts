import mongoose, { Schema, Model } from "mongoose";
import { IDay, IItinerary } from "../types/index.ts";
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

export const Itinerary = mongoose.model("Itinerary", itinerarySchema);