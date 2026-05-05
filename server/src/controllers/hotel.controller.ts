import { Request, Response } from "express"
import Hotel from "../models/hotel.models"
import { asyncHandler, ApiResponse, ApiError } from "../utils"
import { AuthRequest } from "../types"

export const getHotels = asyncHandler(async (_: Request, res: Response) => {
    const hotels = await Hotel.find().sort({ createdAt: -1 })
    res.status(200).json(new ApiResponse(200, hotels, "Hotels fetched successfully"))
})

export const getHotel = asyncHandler(async (req: Request, res: Response) => {
    const hotel = await Hotel.findById(req.params.id)
    if (!hotel) throw new ApiError(404, "Hotel not found")
    res.status(200).json(new ApiResponse(200, hotel, "Hotel fetched successfully"))
})

export const createHotel = asyncHandler(async (req: AuthRequest, res: Response) => {
    const role = req.user?.role
    const status = role === "admin" ? "published" : "pending_review"
    
    const hotel = await Hotel.create({
        ...req.body,
        status,
        createdBy: req.user?.id
    })
    res.status(201).json(new ApiResponse(201, hotel, "Hotel created successfully"))
})

export const updateHotel = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params
    const role = req.user?.role
    
    if (req.body.status === "published" && role !== "admin") {
        throw new ApiError(403, "Only admins can publish content")
    }

    const updateData = { ...req.body, updatedBy: req.user?.id }
    if (role === "editor" && req.body.status !== "draft") {
        updateData.status = "pending_review"
    }

    const hotel = await Hotel.findByIdAndUpdate(id, updateData, { new: true })
    if (!hotel) throw new ApiError(404, "Hotel not found")
    res.status(200).json(new ApiResponse(200, hotel, "Hotel updated successfully"))
})

export const deleteHotel = asyncHandler(async (req: AuthRequest, res: Response) => {
    const role = req.user?.role
    if (role !== "admin") {
        throw new ApiError(403, "Only admins can delete content permanently")
    }

    const hotel = await Hotel.findByIdAndDelete(req.params.id)
    if (!hotel) throw new ApiError(404, "Hotel not found")
    res.status(200).json(new ApiResponse(200, null, "Hotel deleted successfully"))
})
