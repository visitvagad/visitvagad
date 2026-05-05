import { Request, Response } from "express"
import Event from "../models/event.models"
import { asyncHandler, ApiResponse, ApiError } from "../utils"
import { AuthRequest } from "../types"

export const getEvents = asyncHandler(async (_: Request, res: Response) => {
    const events = await Event.find().sort({ date: 1 })
    res.status(200).json(new ApiResponse(200, events, "Events fetched successfully"))
})

export const getEvent = asyncHandler(async (req: Request, res: Response) => {
    const event = await Event.findById(req.params.id)
    if (!event) throw new ApiError(404, "Event not found")
    res.status(200).json(new ApiResponse(200, event, "Event fetched successfully"))
})

export const createEvent = asyncHandler(async (req: AuthRequest, res: Response) => {
    const role = req.user?.role
    const status = role === "admin" ? "published" : "pending_review"

    const event = await Event.create({
        ...req.body,
        status,
        createdBy: req.user?.id
    })
    res.status(201).json(new ApiResponse(201, event, "Event created successfully"))
})

export const updateEvent = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params
    const role = req.user?.role
    
    if (req.body.status === "published" && role !== "admin") {
        throw new ApiError(403, "Only admins can publish content")
    }

    const updateData = { ...req.body, updatedBy: req.user?.id }
    if (role === "editor" && req.body.status !== "draft") {
        updateData.status = "pending_review"
    }

    const event = await Event.findByIdAndUpdate(id, updateData, { new: true })
    if (!event) throw new ApiError(404, "Event not found")
    res.status(200).json(new ApiResponse(200, event, "Event updated successfully"))
})

export const deleteEvent = asyncHandler(async (req: AuthRequest, res: Response) => {
    const role = req.user?.role
    if (role !== "admin") {
        throw new ApiError(403, "Only admins can delete content permanently")
    }

    const event = await Event.findByIdAndDelete(req.params.id)
    if (!event) throw new ApiError(404, "Event not found")
    res.status(200).json(new ApiResponse(200, null, "Event deleted successfully"))
})
