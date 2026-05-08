import { Request, Response } from "express"
import { imageKit } from "../utils/imageKit"
import { asyncHandler, ApiResponse, ApiError } from "../utils"
import { config } from "../config/config"
import crypto from "crypto"

export const getAuthParams = asyncHandler(async (_: Request, res: Response) => {
    // ✅ Manual signature generation with explicit stringification
    const token = crypto.randomBytes(16).toString("hex")
    const expire = Math.floor(Date.now() / 1000) + 2400

    // Explicitly pull from config and verify
    const privateKey = config.imageKitPrivateKey

    if (!privateKey) {
        throw new ApiError(500, "ImageKit configuration missing on server")
    }

    const signature = crypto
        .createHmac("sha1", privateKey)
        .update(token + String(expire)) // ✅ Explicit string concatenation
        .digest("hex")

    res.status(200).json(
        new ApiResponse(
            200,
            { token, expire, signature },
            "Authentication parameters fetched successfully"
        )
    )
})

export const listFiles = asyncHandler(async (_: Request, res: Response) => {
    // ✅ Use the assets.list method for newer SDK versions
    const files = await imageKit.assets.list({
        limit: 50,
        skip: 0
    })
    res.status(200).json(
        new ApiResponse(200, files, "Files fetched successfully")
    )
})

export const deleteFile = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params

    if (!id) {
        throw new ApiError(400, "File ID is required")
    }

    // ✅ New SDK (v7+) structure
    await imageKit.files.delete(id as string)

    res.status(200).json(
        new ApiResponse(200, null, "File deleted successfully from media library")
    )
})
