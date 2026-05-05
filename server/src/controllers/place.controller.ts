import { asyncHandler, ApiError, ApiResponse } from "../utils"
import { Request, Response } from "express"
import Place from "../models/place.models"
import { User } from "../models/user.models"
import { AuthRequest } from "../types"

/* ---------- getAllPlaces ---------- */

export const getAllPlaces = asyncHandler(async (req: Request, res: Response) => {

    const { district, category, featured, trending, status, createdBy, page = 1, limit = 10 } = req.query

    // dynamic filter
    const filter: any = {}

    if (district) filter.district = district
    if (category) filter.category = category
    if (featured !== undefined) filter.featured = featured === 'true'
    if (trending !== undefined) filter.trending = trending === 'true'
    if (status) filter.status = status
    if (createdBy) filter.createdBy = createdBy

    const skip = (Number(page) - 1) * Number(limit)

    const [places, total] = await Promise.all([
        Place.find(filter).skip(skip).limit(Number(limit)),
        Place.countDocuments(filter)
    ])

    res.status(200).json(
        new ApiResponse(
            200,
            {
                places,
                total,
                page: Number(page),
                pages: Math.ceil(total / Number(limit))
            },
            "Places fetched successfully"
        )
    )
})


/* ---------- getPlaceById ---------- */

export const getPlaceById = asyncHandler(async (req: Request, res: Response) => {

    const { id } = req.params

    const place = await Place.findById(id)

    if (!place) {
        throw new ApiError(404, "Place not found")
    }

    res.status(200).json(
        new ApiResponse(200, place, "Place fetched successfully")
    )
})

/* ---------- createPlace ---------- */

export const createPlace = asyncHandler(async (req: AuthRequest, res: Response) => {
    const role = req.user?.role
    const status = role === "admin" ? "published" : "pending_review"
    
    const place = await Place.create({
        ...req.body,
        status,
        createdBy: req.user?.id
    })

    res.status(201).json(
        new ApiResponse(201, place, "Place created successfully")
    )
})

/* ---------- updatePlace ---------- */

export const updatePlace = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params
    const role = req.user?.role
    
    // Only admins can change status directly to published
    if (req.body.status === "published" && role !== "admin") {
        throw new ApiError(403, "Only admins can publish content")
    }

    const updateData = { 
        ...req.body, 
        updatedBy: req.user?.id 
    }
    
    // If editor updates, move back to pending review unless it's just a draft save
    if (role === "editor" && req.body.status !== "draft") {
        updateData.status = "pending_review"
    }

    const place = await Place.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true
    })

    if (!place) {
        throw new ApiError(404, "Place not found")
    }

    res.status(200).json(
        new ApiResponse(200, place, "Place updated successfully")
    )
})

/* ---------- deletePlace ---------- */

export const deletePlace = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params
    const role = req.user?.role

    if (role !== "admin") {
        throw new ApiError(403, "Only admins can delete content permanently")
    }

    const place = await Place.findByIdAndDelete(id)

    if (!place) {
        throw new ApiError(404, "Place not found")
    }

    res.status(200).json(
        new ApiResponse(200, null, "Place deleted successfully")
    )
})

/* ---------- getStats ---------- */

export const getStats = asyncHandler(async (req: Request, res: Response) => {
    const [totalPlaces, featuredPlaces, trendingPlaces, totalUsers, pendingReview] = await Promise.all([
        Place.countDocuments(),
        Place.countDocuments({ featured: true }),
        Place.countDocuments({ trending: true }),
        User.countDocuments(),
        Place.countDocuments({ status: "pending_review" })
    ])

    res.status(200).json(
        new ApiResponse(
            200,
            {
                totalPlaces,
                featuredPlaces,
                trendingPlaces,
                totalUsers,
                pendingReview
            },
            "Stats fetched successfully"
        )
    )
})
