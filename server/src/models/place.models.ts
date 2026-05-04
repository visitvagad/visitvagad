import mongoose, { Schema, model, Document, Model } from "mongoose";
import { IPlace } from "../types/index.ts";


const placeSchema = new Schema<IPlace>({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    district: {
        type: String,
        enum: ["Banswara", "Dungarpur"],
        required: true
    },
    category: {
        type: String,
        enum: ["temple", "nature", "tribal", "waterfall", "historical", "spiritual"],
        required: true
    },
    image: {
        type: String,
        required: true,
        trim: true
    },
    featured: {
        type: Boolean,
        default: false
    },
    trending: {
        type: Boolean,
        default: false
    },
    bestSeason: {
        type: String,
        enum: ["Summer", "Monsoon", "Winter"]
    },
    coordinates: {
        latitude: {
            type: Number,
            required: true,
            min: -90,
            max: 90
        },
        longitude: {
            type: Number,
            required: true,
            min: -180,
            max: 180
        }
    }
}, { timestamps: true });

// Compound unique index: same place name can exist in different districts
placeSchema.index({ name: 1, district: 1 }, { unique: true });

const Place: Model<IPlace> = mongoose.model<IPlace>("Place", placeSchema);

export default Place