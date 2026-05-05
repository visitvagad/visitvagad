import { Request, Response } from "express"
import { imageKit } from "../utils/imageKit"
import { asyncHandler, ApiResponse } from "../utils"

export const getAuthParams = asyncHandler(async (_: Request, res: Response) => {
    const authenticationParameters = (imageKit as any).getAuthenticationParameters()
    res.status(200).json(
        new ApiResponse(200, authenticationParameters, "Authentication parameters fetched successfully")
    )
})

export const listFiles = asyncHandler(async (_: Request, res: Response) => {
    const files = await (imageKit as any).listFiles({
        limit: 50,
        skip: 0
    })
    res.status(200).json(
        new ApiResponse(200, files, "Files fetched successfully")
    )
})
