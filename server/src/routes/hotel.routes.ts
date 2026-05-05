import { Router } from "express"
import { getHotels, getHotel, createHotel, updateHotel, deleteHotel } from "../controllers/hotel.controller"
import { protect, authorize } from "../middlewares/auth.middleware"

const router = Router()

router.route("/")
    .get(getHotels)
    .post(protect, authorize("admin", "editor"), createHotel)

router.route("/:id")
    .get(getHotel)
    .patch(protect, authorize("admin", "editor"), updateHotel)
    .delete(protect, authorize("admin", "editor"), deleteHotel)

export default router
