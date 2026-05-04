import { asyncHandler, ApiError, ApiResponse } from "../utils"
import { Request, Response } from "express"
import Place from "../models/place.models"
import { User } from "../models/user.models"

/* ---------- getAllPlaces ---------- */

export const getAllPlaces = asyncHandler(async (req: Request, res: Response) => {

    const { district, category, featured, trending, page = 1, limit = 10 } = req.query

    // dynamic filter
    const filter: any = {}

    if (district) filter.district = district
    if (category) filter.category = category
    if (featured !== undefined) filter.featured = featured === 'true'
    if (trending !== undefined) filter.trending = trending === 'true'

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

/* ---------- createPlace (Admin Only) ---------- */

export const createPlace = asyncHandler(async (req: Request, res: Response) => {
    const place = await Place.create(req.body)
    res.status(201).json(
        new ApiResponse(201, place, "Place created successfully")
    )
})

/* ---------- updatePlace (Admin Only) ---------- */

export const updatePlace = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    const place = await Place.findByIdAndUpdate(id, req.body, {
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

/* ---------- deletePlace (Admin Only) ---------- */

export const deletePlace = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    const place = await Place.findByIdAndDelete(id)

    if (!place) {
        throw new ApiError(404, "Place not found")
    }

    res.status(200).json(
        new ApiResponse(200, null, "Place deleted successfully")
    )
})

/* ---------- getStats (Admin Only) ---------- */

export const getStats = asyncHandler(async (req: Request, res: Response) => {
    const [totalPlaces, featuredPlaces, trendingPlaces, totalUsers] = await Promise.all([
        Place.countDocuments(),
        Place.countDocuments({ featured: true }),
        Place.countDocuments({ trending: true }),
        User.countDocuments()
    ])

    res.status(200).json(
        new ApiResponse(
            200,
            {
                totalPlaces,
                featuredPlaces,
                trendingPlaces,
                totalUsers
            },
            "Stats fetched successfully"
        )
    )
})
