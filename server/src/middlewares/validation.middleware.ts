import { z } from "zod";
import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils";

export const validate = (schema: z.ZodObject<any, any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.issues.map((err: z.ZodIssue) => `${err.path.join(".")}: ${err.message}`);
        return res.status(400).json({
          success: false,
          message: "Validation Error",
          errors: errorMessages,
        });
      }
      next(error);
    }
  };
};

/* ---------- PLACE SCHEMAS ---------- */

export const placeSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(100),
  description: z.string().min(10, "Description must be at least 10 characters").max(2000),
  district: z.enum(["Banswara", "Dungarpur"]),
  category: z.enum(["temple", "nature", "tribal", "waterfall", "historical", "spiritual"]),
  image: z.string().url("Invalid image URL"),
  featured: z.boolean().optional(),
  trending: z.boolean().optional(),
  bestSeason: z.enum(["Summer", "Monsoon", "Winter"]).optional(),
  coordinates: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  }),
});

export const updatePlaceSchema = placeSchema.partial();

/* ---------- USER SCHEMAS ---------- */

export const updateRoleSchema = z.object({
  role: z.enum(["user", "editor", "admin"]),
});
