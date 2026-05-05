import { Request, Response } from "express"
import { Itinerary } from "../models/itinerary.models"
import { asyncHandler, ApiResponse, ApiError } from "../utils"
import { AuthRequest } from "../types"

export const getItineraries = asyncHandler(async (_: Request, res: Response) => {
    const itineraries = await Itinerary.find().sort({ createdAt: -1 })
    res.status(200).json(new ApiResponse(200, itineraries, "Itineraries fetched successfully"))
})

export const getItinerary = asyncHandler(async (req: Request, res: Response) => {
    const itinerary = await Itinerary.findById(req.params.id)
    if (!itinerary) throw new ApiError(404, "Itinerary not found")
    res.status(200).json(new ApiResponse(200, itinerary, "Itinerary fetched successfully"))
})

export const createItinerary = asyncHandler(async (req: AuthRequest, res: Response) => {
    const role = req.user?.role
    const status = role === "admin" ? "published" : "pending_review"

    const itinerary = await Itinerary.create({
        ...req.body,
        status,
        createdBy: req.user?.id
    })
    res.status(201).json(new ApiResponse(201, itinerary, "Itinerary created successfully"))
})

export const updateItinerary = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params
    const role = req.user?.role
    
    if (req.body.status === "published" && role !== "admin") {
        throw new ApiError(403, "Only admins can publish content")
    }

    const updateData = { ...req.body, updatedBy: req.user?.id }
    if (role === "editor" && req.body.status !== "draft") {
        updateData.status = "pending_review"
    }

    const itinerary = await Itinerary.findByIdAndUpdate(id, updateData, { new: true })
    if (!itinerary) throw new ApiError(404, "Itinerary not found")
    res.status(200).json(new ApiResponse(200, itinerary, "Itinerary updated successfully"))
})

export const deleteItinerary = asyncHandler(async (req: AuthRequest, res: Response) => {
    const role = req.user?.role
    if (role !== "admin") {
        throw new ApiError(403, "Only admins can delete content permanently")
    }

    const itinerary = await Itinerary.findByIdAndDelete(req.params.id)
    if (!itinerary) throw new ApiError(404, "Itinerary not found")
    res.status(200).json(new ApiResponse(200, null, "Itinerary deleted successfully"))
})
