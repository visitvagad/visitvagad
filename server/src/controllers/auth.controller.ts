import { Response } from "express"
import { AuthRequest } from "../types"
import { User } from "../models/user.models"
import { asyncHandler, ApiError, ApiResponse } from "../utils"
import AuditLog, { logAudit } from "../models/audit.models"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { config } from "../config/config"
import type { SignOptions } from "jsonwebtoken"

const generateToken = (id: string) => {
  return jwt.sign(
    { id },
    config.jwtSecret,
    { expiresIn: (config.jwtExpiresIn || "7d") as SignOptions["expiresIn"] }
  )
}

/**
 * Set secure httpOnly cookie with JWT
 * - httpOnly: prevents XSS token theft
 * - secure: HTTPS only in production
 * - sameSite: CSRF protection
 */
const setAuthCookie = (res: Response, token: string, userId: string) => {
  const isProduction = process.env.NODE_ENV === "production"
  
  res.cookie("auth_token", token, {
    httpOnly: true,           // ✅ XSS protection: not accessible to JavaScript
    secure: isProduction,     // ✅ HTTPS only in production
    sameSite: "strict",       // ✅ CSRF protection
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    path: "/",
    domain: isProduction ? undefined : undefined, // Only set domain in production
  })
}

/* ---------- REGISTER ---------- */

export const register = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, email, password } = req.body

  const normalizedEmail = email.toLowerCase().trim()
  const existingUser = await User.findOne({ email: normalizedEmail })

  if (existingUser) {
    // ✅ Log failed registration attempt
    await logAudit(
      "unknown",
      "LOGIN",
      "User",
      undefined,
      normalizedEmail,
      undefined,
      req.ip,
      req.get("user-agent"),
      "failure",
      "User already exists"
    )
    throw new ApiError(409, "User already exists with this email")
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password: hashedPassword,
    role: "user",
    isActive: true,
  })

  const userId = (user._id as unknown as string).toString()
  const token = generateToken(userId)

  // ✅ Set secure httpOnly cookie
  setAuthCookie(res, token, userId)

  // ✅ Log successful registration
  await logAudit(
    userId,
    "LOGIN",
    "User",
    userId,
    normalizedEmail,
    undefined,
    req.ip,
    req.get("user-agent"),
    "success"
  )

  // ✅ Don't send token in response body - it's in the cookie
  res.status(201).json(
    new ApiResponse(
      201,
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      "Registered successfully"
    )
  )
})

/* ---------- LOGIN ---------- */

export const login = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { email, password } = req.body

  const normalizedEmail = email.toLowerCase().trim()
  const user = await User.findOne({ email: normalizedEmail })

  if (!user) {
    // ✅ Log failed login
    await logAudit(
      "unknown",
      "LOGIN",
      "User",
      undefined,
      normalizedEmail,
      undefined,
      req.ip,
      req.get("user-agent"),
      "failure",
      "Invalid email or password"
    )
    throw new ApiError(401, "Invalid email or password")
  }

  if (!user.isActive) {
    // ✅ Log account deactivated attempt
    await logAudit(
      (user._id as unknown as string).toString(),
      "LOGIN",
      "User",
      (user._id as unknown as string).toString(),
      normalizedEmail,
      undefined,
      req.ip,
      req.get("user-agent"),
      "failure",
      "Account deactivated"
    )
    throw new ApiError(401, "User account has been deactivated")
  }

  if (!user.password) {
    throw new ApiError(401, "Password login is not available for this account")
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)

  if (!isPasswordValid) {
    // ✅ Log failed password
    await logAudit(
      (user._id as unknown as string).toString(),
      "LOGIN",
      "User",
      (user._id as unknown as string).toString(),
      normalizedEmail,
      undefined,
      req.ip,
      req.get("user-agent"),
      "failure",
      "Invalid password"
    )
    throw new ApiError(401, "Invalid email or password")
  }

  const userId = (user._id as unknown as string).toString()
  const token = generateToken(userId)

  // ✅ Set secure httpOnly cookie
  setAuthCookie(res, token, userId)

  // ✅ Log successful login
  await logAudit(
    userId,
    "LOGIN",
    "User",
    userId,
    user.email,
    undefined,
    req.ip,
    req.get("user-agent"),
    "success"
  )

  // ✅ Don't send token in response body - it's in the cookie
  res.status(200).json(
    new ApiResponse(
      200,
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      "Login successful"
    )
  )
})

/* ---------- GET CURRENT USER ---------- */

export const getMe = asyncHandler(async (req: AuthRequest, res: Response) => {

  if (!req.user?.id) {
    throw new ApiError(401, "Unauthorized")
  }

  const user = await User
    .findById(req.user.id)
    .select("-password")

  if (!user) {
    throw new ApiError(404, "User not found")
  }

  res.status(200).json(
    new ApiResponse(200, user, "User fetched successfully")
  )

})

/* ---------- LOGOUT ---------- */

export const logout = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user?.id) {
    throw new ApiError(401, "Unauthorized")
  }

  // ✅ Clear the auth cookie
  res.clearCookie("auth_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  })

  // ✅ Log logout
  await logAudit(
    req.user.id,
    "LOGOUT",
    "User",
    req.user.id,
    undefined,
    undefined,
    req.ip,
    req.get("user-agent"),
    "success"
  )

  res.status(200).json(
    new ApiResponse(200, null, "Logged out successfully")
  )
})

/* ---------- GET ALL USERS (Admin Only) ---------- */

export const getAllUsers = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { page = 1, limit = 10 } = req.query
  const skip = (Number(page) - 1) * Number(limit)

  const [users, total] = await Promise.all([
    User.find({ isActive: true }).select("-password").skip(skip).limit(Number(limit)),
    User.countDocuments({ isActive: true })
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



/* ---------- DELETE USER (Admin Only) - Soft Delete ---------- */

export const deleteUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params

  const user = await User.findByIdAndUpdate(id, { isActive: false }, { new: true }).select("-password")

  if (!user) {
    throw new ApiError(404, "User not found")
  }

  res.status(200).json(
    new ApiResponse(200, user, "User deleted successfully")
  )
})
