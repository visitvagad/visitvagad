import { Router } from "express";
import { getAllPlaces, getPlaceById, createPlace, updatePlace, deletePlace, getStats } from "../controllers/place.controller";
import { protect, authorize } from "../middlewares/auth.middleware";
import { validate, placeSchema, updatePlaceSchema } from "../middlewares/validation.middleware";

const router = Router()

router.get("/", getAllPlaces)
router.get("/stats", protect, authorize("admin"), getStats)
router.get("/:id", getPlaceById)

// Admin and Editor routes
router.post("/", protect, authorize("admin", "editor"), validate(placeSchema), createPlace)
router.patch("/:id", protect, authorize("admin", "editor"), validate(updatePlaceSchema), updatePlace)

// Admin only routes
router.delete("/:id", protect, authorize("admin"), deletePlace)

export default router