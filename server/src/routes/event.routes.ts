import { Router } from "express"
import { getEvents, getEvent, createEvent, updateEvent, deleteEvent } from "../controllers/event.controller"
import { protect, authorize } from "../middlewares/auth.middleware"

const router = Router()

router.route("/")
    .get(getEvents)
    .post(protect, authorize("admin", "editor"), createEvent)

router.route("/:id")
    .get(getEvent)
    .patch(protect, authorize("admin", "editor"), updateEvent)
    .delete(protect, authorize("admin", "editor"), deleteEvent)

export default router
