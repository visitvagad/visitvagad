import { Document, Types } from "mongoose";
import type { Request as ExpressRequest } from "express";


/* ---------------- IUser Schema Types ---------------- */

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    role: "user" | "editor" | "admin";
    isActive: boolean;
}
/* ---------------- IPlace Schema Types ---------------- */

export interface IPlace extends Document {
    name: string;
    description: string;
    district: "Banswara" | "Dungarpur";
    category: "temple" | "nature" | "tribal" | "waterfall" | "historical" | "spiritual";
    image: string;
    featured: boolean;
    trending: boolean;
    bestSeason?: "Summer" | "Monsoon" | "Winter";
    status?: "draft" | "pending_review" | "published";
    createdBy?: string;
    updatedBy?: string;
    coordinates: {
        latitude: number;
        longitude: number;
    };
}
/* ---------------- Day Schema Types ---------------- */
export interface IDay {
    dayNumber: number
    places: Types.ObjectId[]
    notes?: string
}
/* ---------------- Itinerary Schema Types ---------------- */

export interface IItinerary extends Document {
    user: Types.ObjectId
    title: string
    duration: number
    days: IDay[]
    isPublic: boolean
    createdAt: Date
    updatedAt: Date
}

/* ---------------- AuthRequest Types ---------------- */

export interface AuthRequest extends ExpressRequest {
  user?: {
    id: string
    role: "user" | "editor" | "admin"
  }
}