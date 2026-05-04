import { Request, Response } from "express"
import { imageKit } from "../utils/imageKit"
import { asyncHandler, ApiResponse } from "../utils"

export const getAuthParams = asyncHandler(async (_: Request, res: Response) => {
    const authenticationParameters = imageKit.getAuthenticationParameters()
    res.status(200).json(
        new ApiResponse(200, authenticationParameters, "Authentication parameters fetched successfully")
    )
})
