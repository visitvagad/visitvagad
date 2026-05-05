import { Router } from "express"
import { getAuthParams, listFiles } from "../controllers/image.controller"
import { protect, authorize } from "../middlewares/auth.middleware"

const router = Router()

router.get("/auth", protect, authorize("admin", "editor"), getAuthParams)
router.get("/list", protect, authorize("admin", "editor"), listFiles)

export default router
