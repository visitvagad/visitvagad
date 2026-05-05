import { Router } from "express"
import { getItineraries, getItinerary, createItinerary, updateItinerary, deleteItinerary } from "../controllers/itinerary.controller"
import { protect, authorize } from "../middlewares/auth.middleware"

const router = Router()

router.route("/")
    .get(getItineraries)
    .post(protect, authorize("admin", "editor"), createItinerary)

router.route("/:id")
    .get(getItinerary)
    .patch(protect, authorize("admin", "editor"), updateItinerary)
    .delete(protect, authorize("admin", "editor"), deleteItinerary)

export default router
