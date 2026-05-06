import { Router } from "express";
import { register, login, getMe, logout, getAllUsers, updateUserRole, deleteUser } from "../controllers/auth.controller"
import { protect } from "../middlewares/auth.middleware";
import { authorize } from "../utils/authorization"
import { validate, updateRoleSchema, registerSchema, loginSchema } from "../middlewares/validation.middleware";

const router = Router()

router.post("/register", validate(registerSchema), register)
router.post("/login", validate(loginSchema), login)
router.post("/logout", protect, logout)  // ✅ Add logout endpoint
router.get("/me", protect, getMe)

// Admin only routes
router.get("/users", protect, authorize("manage_users"), getAllUsers)
router.patch("/users/:id/role", protect, authorize("manage_roles"), validate(updateRoleSchema), updateUserRole)
router.delete("/users/:id", protect, authorize("manage_users"), deleteUser)


export default router