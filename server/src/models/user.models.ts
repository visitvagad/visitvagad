import mongoose, { Schema, Document, Model } from "mongoose";
import { IUser } from "../types/index.ts";
import bcrypt from "bcryptjs";

const userSchema = new Schema<IUser>({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Please use a valid email"]
    },
    clerkId: {
        type: String,
        unique: true,
        sparse: true
    },
    password: {
        type: String,
        required: false,
        minlength: 6
    },
    role: {
        type: String,
        enum: ["user", "editor", "admin"],
        default: "user"
    }
}, {
    timestamps: true
});


export const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
