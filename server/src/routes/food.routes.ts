import { Router } from "express"
import { getFoods, getFood, createFood, updateFood, deleteFood } from "../controllers/food.controller"
import { protect, authorize } from "../middlewares/auth.middleware"

const router = Router()

router.route("/")
    .get(getFoods)
    .post(protect, authorize("admin", "editor"), createFood)

router.route("/:id")
    .get(getFood)
    .patch(protect, authorize("admin", "editor"), updateFood)
    .delete(protect, authorize("admin", "editor"), deleteFood)

export default router
