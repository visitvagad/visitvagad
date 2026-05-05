import { Router } from "express";
import { register, login, getMe, getAllUsers, updateUserRole, deleteUser } from "../controllers/auth.controller"
import { protect, authorize } from "../middlewares/auth.middleware";
import { validate, updateRoleSchema, registerSchema, loginSchema } from "../middlewares/validation.middleware";

const router = Router()

router.post("/register", validate(registerSchema), register)
router.post("/login", validate(loginSchema), login)
router.get("/me", protect, getMe)

// Admin only routes
router.get("/users", protect, authorize("admin"), getAllUsers)
router.patch("/users/:id/role", protect, authorize("admin"), validate(updateRoleSchema), updateUserRole)
router.delete("/users/:id", protect, authorize("admin"), deleteUser)


export default router