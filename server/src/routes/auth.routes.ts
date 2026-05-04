import { Router } from "express";
import { getMe, getAllUsers, updateUserRole } from "../controllers/auth.controller"
import { protect, authorize } from "../middlewares/auth.middleware";
import { validate, updateRoleSchema } from "../middlewares/validation.middleware";

const router = Router()

router.get("/me", protect, getMe)

// Admin only routes
router.get("/users", protect, authorize("admin"), getAllUsers)
router.patch("/users/:id/role", protect, authorize("admin"), validate(updateRoleSchema), updateUserRole)


export default router