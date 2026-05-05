import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import { asyncHandler, ApiResponse } from "../utils";
import { User } from "../models/user.models";

const router = Router()

// Debug endpoint - check current user in DB
router.get("/debug/me", protect, asyncHandler(async (req, res) => {
  if (!req.user?.id) {
    return res.status(400).json(new ApiResponse(400, null, "No user in request"))
  }

  const user = await User.findById(req.user.id)
  res.status(200).json(
    new ApiResponse(200, {
      requestUserId: req.user.id,
      foundUser: user,
      isActive: user?.isActive,
      email: user?.email
    }, "Debug info")
  )
}))

export default router
