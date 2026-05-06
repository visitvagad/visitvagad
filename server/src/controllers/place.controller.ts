import { asyncHandler, ApiError, ApiResponse } from "../utils"
import { Request, Response } from "express"
import Place from "../models/place.models"
import { User } from "../models/user.models"
import { AuthRequest } from "../types"
import { 
  hasPermission, 
  canViewContent,
  getContentFilter,
  getNextStatus,
  ContentStatus 
} from "../utils/permissions"
import { logAudit } from "../models/audit.models"

/* ---------- GET ALL PLACES ---------- */

export const getAllPlaces = asyncHandler(async (req: Request, res: Response) => {
    const { district, category, featured, trending, status, createdBy, page = 1, limit = 10 } = req.query

    // ✅ Build filter based on user role
    const roleFilter = getContentFilter(req.user?.role || "user", req.user?.id || "")
    const filter: any = { ...roleFilter }

    if (district) filter.district = district
    if (category) filter.category = category
    if (featured !== undefined) filter.featured = featured === 'true'
    if (trending !== undefined) filter.trending = trending === 'true'

    // ✅ Only admins can filter by status
    if (status && req.user?.role === "admin") {
        filter.status = status
    }

    // ✅ Only admins can filter by createdBy
    if (createdBy && req.user?.role === "admin") {
        filter.createdBy = createdBy
    }

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


/* ---------- GET PLACE BY ID ---------- */

export const getPlaceById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    const currentUserId = req.user?.id ?? ""

    const place = await Place.findById(id)

    if (!place) {
        throw new ApiError(404, "Place not found")
    }

    // ✅ Check if user can view this place
    if (!canViewContent(place.status as ContentStatus, req.user?.role || "user", currentUserId, place.createdBy)) {
        throw new ApiError(403, "You don't have permission to view this place")
    }

    res.status(200).json(
        new ApiResponse(200, place, "Place fetched successfully")
    )
})

/* ---------- CREATE PLACE ---------- */

export const createPlace = asyncHandler(async (req: AuthRequest, res: Response) => {
    // ✅ Only editors and admins can create
    if (!hasPermission(req.user!.role, 'create_content')) {
        throw new ApiError(403, "You don't have permission to create content")
    }

    const role = req.user!.role
    
    // ✅ Admin publishes immediately, editor goes to pending review
    const nextStatus = getNextStatus('draft' as ContentStatus, role, 'save')
    
    const place = await Place.create({
        ...req.body,
        status: nextStatus,
        createdBy: req.user!.id
    })

    // ✅ Audit log
    await logAudit(
        req.user!.id,
        "CREATE_CONTENT",
        "Place",
        (place._id as unknown as string).toString(),
        place.name,
        undefined,
        req.ip,
        req.get("user-agent"),
        "success"
    )

    res.status(201).json(
        new ApiResponse(201, place, "Place created successfully")
    )
})

/* ---------- UPDATE PLACE ---------- */

export const updatePlace = asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = req.params.id as string
    const role = req.user!.role
    const userId = req.user!.id
    
    // ✅ Load existing place
    const existingPlace = await Place.findById(id)
    if (!existingPlace) {
        throw new ApiError(404, "Place not found")
    }

    // ✅ OWNERSHIP CHECK: Editors can only edit their own
    if (role === "editor" && existingPlace.createdBy !== userId) {
        // ✅ Audit log - unauthorized attempt
        await logAudit(
            userId,
            "UPDATE_CONTENT",
            "Place",
            id,
            existingPlace.name,
            undefined,
            req.ip,
            req.get("user-agent"),
            "failure",
            "User tried to edit content they don't own"
        )
        throw new ApiError(403, "You can only edit content you created")
    }

    // ✅ Only admins can directly publish
    if (req.body.status === "published" && role !== "admin") {
        throw new ApiError(403, "Only admins can publish content")
    }

    const updateData: any = { 
        ...req.body, 
        updatedBy: userId 
    }
    
    // ✅ Auto-downgrade editor updates to pending_review if trying to save as published
    if (role === "editor" && req.body.status !== "draft") {
        updateData.status = "pending_review"
    }

    const place = await Place.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true
    })

    // ✅ Audit log
    await logAudit(
        userId,
        "UPDATE_CONTENT",
        "Place",
        id,
        place!.name,
        { status: { before: existingPlace.status, after: place!.status } },
        req.ip,
        req.get("user-agent"),
        "success"
    )

    res.status(200).json(
        new ApiResponse(200, place, "Place updated successfully")
    )
})

/* ---------- DELETE PLACE ---------- */

export const deletePlace = asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = req.params.id as string
    const role = req.user!.role
    const userId = req.user!.id

    // ✅ Only admins can delete
    if (!hasPermission(role, 'delete_any_content')) {
        throw new ApiError(403, "Only admins can delete content permanently")
    }

    const place = await Place.findByIdAndDelete(id)

    if (!place) {
        throw new ApiError(404, "Place not found")
    }

    // ✅ Audit log
    await logAudit(
        userId,
        "DELETE_CONTENT",
        "Place",
        id,
        place.name,
        undefined,
        req.ip,
        req.get("user-agent"),
        "success"
    )

    res.status(200).json(
        new ApiResponse(200, null, "Place deleted successfully")
    )
})

/* ---------- GET STATS ---------- */

export const getStats = asyncHandler(async (req: AuthRequest, res: Response) => {
    // ✅ Only admins can view stats
    if (!hasPermission(req.user!.role, 'view_analytics')) {
        throw new ApiError(403, "You don't have permission to view analytics")
    }

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
