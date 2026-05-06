import { Request, Response } from "express"
import Hotel from "../models/hotel.models"
import { asyncHandler, ApiResponse, ApiError } from "../utils"
import { AuthRequest } from "../types"
import { 
  hasPermission, 
  canViewContent,
  getContentFilter,
  ContentStatus 
} from "../utils/permissions"
import { logAudit } from "../models/audit.models"

/* ---------- GET ALL HOTELS ---------- */

export const getHotels = asyncHandler(async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query

    // ✅ Build filter based on user role
    const roleFilter = getContentFilter(req.user?.role || "user", req.user?.id || "")
    
    const skip = (Number(page) - 1) * Number(limit)

    const [hotels, total] = await Promise.all([
        Hotel.find(roleFilter).skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
        Hotel.countDocuments(roleFilter)
    ])

    res.status(200).json(
        new ApiResponse(
            200,
            { hotels, total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
            "Hotels fetched successfully"
        )
    )
})

/* ---------- GET HOTEL BY ID ---------- */

export const getHotel = asyncHandler(async (req: Request, res: Response) => {
    const hotel = await Hotel.findById(req.params.id)
    if (!hotel) throw new ApiError(404, "Hotel not found")

    // ✅ Check if user can view this hotel
    if (!canViewContent(hotel.status as ContentStatus, req.user?.role || "user", req.user?.id ?? "", hotel.createdBy)) {
        throw new ApiError(403, "You don't have permission to view this hotel")
    }

    res.status(200).json(new ApiResponse(200, hotel, "Hotel fetched successfully"))
})

/* ---------- CREATE HOTEL ---------- */

export const createHotel = asyncHandler(async (req: AuthRequest, res: Response) => {
    // ✅ Only editors and admins can create
    if (!hasPermission(req.user!.role, 'create_content')) {
        throw new ApiError(403, "You don't have permission to create content")
    }

    const role = req.user!.role
    const status = role === "admin" ? "published" : "pending_review"
    
    const hotel = await Hotel.create({
        ...req.body,
        status,
        createdBy: req.user!.id
    })

    // ✅ Audit log
    await logAudit(
        req.user!.id,
        "CREATE_CONTENT",
        "Hotel",
        (hotel._id as unknown as string).toString(),
        hotel.name,
        undefined,
        req.ip,
        req.get("user-agent"),
        "success"
    )

    res.status(201).json(new ApiResponse(201, hotel, "Hotel created successfully"))
})

/* ---------- UPDATE HOTEL ---------- */

export const updateHotel = asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = req.params.id as string
    const role = req.user!.role
    const userId = req.user!.id
    
    // ✅ Load existing hotel
    const existingHotel = await Hotel.findById(id)
    if (!existingHotel) throw new ApiError(404, "Hotel not found")

    // ✅ OWNERSHIP CHECK: Editors can only edit their own
    if (role === "editor" && existingHotel.createdBy !== userId) {
        await logAudit(
            userId,
            "UPDATE_CONTENT",
            "Hotel",
            id,
            existingHotel.name,
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

    const updateData: any = { ...req.body, updatedBy: userId }
    if (role === "editor" && req.body.status !== "draft") {
        updateData.status = "pending_review"
    }

    const hotel = await Hotel.findByIdAndUpdate(id, updateData, { new: true })
    if (!hotel) throw new ApiError(404, "Hotel not found")

    // ✅ Audit log
    await logAudit(
        userId,
        "UPDATE_CONTENT",
        "Hotel",
        id,
        hotel.name,
        { status: { before: existingHotel.status, after: hotel.status } },
        req.ip,
        req.get("user-agent"),
        "success"
    )

    res.status(200).json(new ApiResponse(200, hotel, "Hotel updated successfully"))
})

/* ---------- DELETE HOTEL ---------- */

export const deleteHotel = asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = req.params.id as string
    const role = req.user!.role
    const userId = req.user!.id

    // ✅ Only admins can delete
    if (!hasPermission(role, 'delete_any_content')) {
        throw new ApiError(403, "Only admins can delete content permanently")
    }

    const hotel = await Hotel.findByIdAndDelete(id)
    if (!hotel) throw new ApiError(404, "Hotel not found")

    // ✅ Audit log
    await logAudit(
        userId,
        "DELETE_CONTENT",
        "Hotel",
        id,
        hotel.name,
        undefined,
        req.ip,
        req.get("user-agent"),
        "success"
    )

    res.status(200).json(new ApiResponse(200, null, "Hotel deleted successfully"))
})
