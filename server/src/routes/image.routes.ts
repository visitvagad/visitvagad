import { Router } from "express"
import { getAuthParams } from "../controllers/image.controller"
import { protect, authorize } from "../middlewares/auth.middleware"

const router = Router()

router.get("/auth", protect, authorize("admin", "editor"), getAuthParams)

export default router
