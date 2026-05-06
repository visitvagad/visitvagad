import { Request, Response } from "express"
import { Itinerary } from "../models/itinerary.models"
import { asyncHandler, ApiResponse, ApiError } from "../utils"
import { AuthRequest } from "../types"
import { 
  hasPermission, 
  canViewContent,
  getContentFilter,
  ContentStatus 
} from "../utils/permissions"
import { logAudit } from "../models/audit.models"

/* ---------- GET ALL ITINERARIES ---------- */

export const getItineraries = asyncHandler(async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query

    // ✅ Build filter based on user role
    const roleFilter = getContentFilter(req.user?.role || "user", req.user?.id || "")
    
    const skip = (Number(page) - 1) * Number(limit)

    const [itineraries, total] = await Promise.all([
        Itinerary.find(roleFilter).skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
        Itinerary.countDocuments(roleFilter)
    ])

    res.status(200).json(
        new ApiResponse(
            200,
            { itineraries, total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
            "Itineraries fetched successfully"
        )
    )
})

/* ---------- GET ITINERARY BY ID ---------- */

export const getItinerary = asyncHandler(async (req: Request, res: Response) => {
    const itinerary = await Itinerary.findById(req.params.id)
    if (!itinerary) throw new ApiError(404, "Itinerary not found")

    // ✅ Check if user can view this itinerary
    if (!canViewContent(itinerary.status as ContentStatus, req.user?.role || "user", req.user?.id ?? "", itinerary.createdBy)) {
        throw new ApiError(403, "You don't have permission to view this itinerary")
    }

    res.status(200).json(new ApiResponse(200, itinerary, "Itinerary fetched successfully"))
})

/* ---------- CREATE ITINERARY ---------- */

export const createItinerary = asyncHandler(async (req: AuthRequest, res: Response) => {
    // ✅ Only editors and admins can create
    if (!hasPermission(req.user!.role, 'create_content')) {
        throw new ApiError(403, "You don't have permission to create content")
    }

    const role = req.user!.role
    const status = role === "admin" ? "published" : "pending_review"

    const itinerary = await Itinerary.create({
        ...req.body,
        status,
        createdBy: req.user!.id
    })

    // ✅ Audit log
    await logAudit(
        req.user!.id,
        "CREATE_CONTENT",
        "Itinerary",
        (itinerary._id as unknown as string).toString(),
        itinerary.title,
        undefined,
        req.ip,
        req.get("user-agent"),
        "success"
    )

    res.status(201).json(new ApiResponse(201, itinerary, "Itinerary created successfully"))
})

/* ---------- UPDATE ITINERARY ---------- */

export const updateItinerary = asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = req.params.id as string
    const role = req.user!.role
    const userId = req.user!.id
    
    // ✅ Load existing itinerary
    const existingItinerary = await Itinerary.findById(id)
    if (!existingItinerary) throw new ApiError(404, "Itinerary not found")

    // ✅ OWNERSHIP CHECK: Editors can only edit their own
    if (role === "editor" && existingItinerary.createdBy !== userId) {
        await logAudit(
            userId,
            "UPDATE_CONTENT",
            "Itinerary",
            id,
            existingItinerary.title,
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

    const itinerary = await Itinerary.findByIdAndUpdate(id, updateData, { new: true })
    if (!itinerary) throw new ApiError(404, "Itinerary not found")

    // ✅ Audit log
    await logAudit(
        userId,
        "UPDATE_CONTENT",
        "Itinerary",
        id,
        itinerary.title,
        { status: { before: existingItinerary.status, after: itinerary.status } },
        req.ip,
        req.get("user-agent"),
        "success"
    )

    res.status(200).json(new ApiResponse(200, itinerary, "Itinerary updated successfully"))
})

/* ---------- DELETE ITINERARY ---------- */

export const deleteItinerary = asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = req.params.id as string
    const role = req.user!.role
    const userId = req.user!.id

    // ✅ Only admins can delete
    if (!hasPermission(role, 'delete_any_content')) {
        throw new ApiError(403, "Only admins can delete content permanently")
    }

    const itinerary = await Itinerary.findByIdAndDelete(id)
    if (!itinerary) throw new ApiError(404, "Itinerary not found")

    // ✅ Audit log
    await logAudit(
        userId,
        "DELETE_CONTENT",
        "Itinerary",
        id,
        itinerary.title,
        undefined,
        req.ip,
        req.get("user-agent"),
        "success"
    )

    res.status(200).json(new ApiResponse(200, null, "Itinerary deleted successfully"))
})
