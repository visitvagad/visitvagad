import { Response } from "express"
import { AuthRequest } from "../types"
import { User } from "../models/user.models"
import { asyncHandler, ApiError, ApiResponse } from "../utils"

/* ---------- GET CURRENT USER ---------- */

export const getMe = asyncHandler(async (req: AuthRequest, res: Response) => {

  if (!req.user?.id) {
    throw new ApiError(401, "Unauthorized")
  }

  const user = await User
    .findById(req.user.id)

  if (!user) {
    throw new ApiError(404, "User not found")
  }

  res.status(200).json(
    new ApiResponse(200, user, "User fetched successfully")
  )

})



/* ---------- GET ALL USERS (Admin Only) ---------- */

export const getAllUsers = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { page = 1, limit = 10 } = req.query
  const skip = (Number(page) - 1) * Number(limit)

  const [users, total] = await Promise.all([
    User.find().select("-password").skip(skip).limit(Number(limit)),
    User.countDocuments()
  ])

  res.status(200).json(
    new ApiResponse(
      200, 
      {
        users,
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit))
      },
      "Users fetched successfully"
    )
  )
})



/* ---------- UPDATE USER ROLE (Admin Only) ---------- */

export const updateUserRole = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params
  const { role } = req.body

  if (!["user", "editor", "admin"].includes(role)) {
    throw new ApiError(400, "Invalid role")
  }

  const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select("-password")

  if (!user) {
    throw new ApiError(404, "User not found")
  }

  res.status(200).json(
    new ApiResponse(200, user, "User role updated successfully")
  )
})
