import { Request, Response, NextFunction } from "express"
import { clerkClient } from "@clerk/clerk-sdk-node"

import { asyncHandler, ApiError } from "../utils"
import { User } from "../models/user.models"


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
            // Step 1: Verify token with Clerk
            const decodedToken = await clerkClient.verifyToken(token)
            const clerkId = decodedToken.sub

            // Step 2: Find user in MongoDB by clerkId
            let user = await User.findOne({ clerkId })

            // Step 3: Lazy Sync if user not found
            if (!user) {
                const clerkUser = await clerkClient.users.getUser(clerkId)
                const email = clerkUser.emailAddresses[0]?.emailAddress
                const name = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || "User"

                // Check if user exists by email (link legacy accounts)
                user = await User.findOne({ email })

                if (user) {
                    user.clerkId = clerkId
                    await user.save()
                } else {
                    user = await User.create({
                        clerkId,
                        email,
                        name,
                        role: "user"
                    })
                }
            }

            // Step 4: Attach user to request
            req.user = {
                id: (user._id as string).toString(),
                role: user.role
            }

            next()
        } catch (error) {
            console.error("Clerk verification error:", error)
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