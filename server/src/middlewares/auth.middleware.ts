import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

import { asyncHandler, ApiError } from "../utils"
import { User } from "../models/user.models"
import { config } from "../config/config"


/* ---------- EXTEND EXPRESS REQUEST ---------- */

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string
                role: "user" | "editor" | "admin"
            }
        }
    }
}



/* ---------- AUTHENTICATION MIDDLEWARE ---------- */

export const protect = asyncHandler(
    async (req: Request, _: Response, next: NextFunction) => {

        const authHeader = req.headers.authorization
        const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null

        if (!token) {
            throw new ApiError(401, "Authorization token required")
        }

        try {
            const decoded = jwt.verify(token, config.jwtSecret) as { id?: string }

            if (!decoded?.id) {
                throw new ApiError(401, "Invalid token payload")
            }

            const user = await User.findById(decoded.id)

            if (!user || !user.isActive) {
                throw new ApiError(401, "User account has been deactivated")
            }

            // Attach user details to request for downstream authorization
            req.user = {
                id: (user._id as unknown as string).toString(),
                role: user.role
            }

            next()
        } catch (error) {
            console.error("Token verification error:", error)
            throw new ApiError(401, "Invalid or expired token")
        }
    }
)



/* ---------- ROLE AUTHORIZATION ---------- */

export const authorize = (...roles: ("user" | "editor" | "admin")[]) => {
    return (req: Request, _: Response, next: NextFunction) => {

        if (!req.user) {
            throw new ApiError(401, "Unauthorized")
        }

        if (!roles.includes(req.user.role)) {
            throw new ApiError(403, "Forbidden: insufficient permissions")
        }

        next()
    }
}