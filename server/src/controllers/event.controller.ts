import { Request, Response } from "express"
import Event from "../models/event.models"
import { asyncHandler, ApiResponse, ApiError } from "../utils"
import { AuthRequest } from "../types"
import { 
  hasPermission, 
  canViewContent,
  getContentFilter,
  ContentStatus 
} from "../utils/permissions"
import { logAudit } from "../models/audit.models"

/* ---------- GET ALL EVENTS ---------- */

export const getEvents = asyncHandler(async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query

    // ✅ Build filter based on user role
    const roleFilter = getContentFilter(req.user?.role || "user", req.user?.id || "")
    
    const skip = (Number(page) - 1) * Number(limit)

    const [events, total] = await Promise.all([
        Event.find(roleFilter).skip(skip).limit(Number(limit)).sort({ date: 1 }),
        Event.countDocuments(roleFilter)
    ])

    res.status(200).json(
        new ApiResponse(
            200,
            { events, total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
            "Events fetched successfully"
        )
    )
})

/* ---------- GET EVENT BY ID ---------- */

export const getEvent = asyncHandler(async (req: Request, res: Response) => {
    const event = await Event.findById(req.params.id)
    if (!event) throw new ApiError(404, "Event not found")

    // ✅ Check if user can view this event
    if (!canViewContent(event.status as ContentStatus, req.user?.role || "user", req.user?.id ?? "", event.createdBy)) {
        throw new ApiError(403, "You don't have permission to view this event")
    }

    res.status(200).json(new ApiResponse(200, event, "Event fetched successfully"))
})

/* ---------- CREATE EVENT ---------- */

export const createEvent = asyncHandler(async (req: AuthRequest, res: Response) => {
    // ✅ Only editors and admins can create
    if (!hasPermission(req.user!.role, 'create_content')) {
        throw new ApiError(403, "You don't have permission to create content")
    }

    const role = req.user!.role
    const status = role === "admin" ? "published" : "pending_review"

    const event = await Event.create({
        ...req.body,
        status,
        createdBy: req.user!.id
    })

    // ✅ Audit log
    await logAudit(
        req.user!.id,
        "CREATE_CONTENT",
        "Event",
        (event._id as unknown as string).toString(),
        event.name,
        undefined,
        req.ip,
        req.get("user-agent"),
        "success"
    )

    res.status(201).json(new ApiResponse(201, event, "Event created successfully"))
})

/* ---------- UPDATE EVENT ---------- */

export const updateEvent = asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = req.params.id as string
    const role = req.user!.role
    const userId = req.user!.id
    
    // ✅ Load existing event
    const existingEvent = await Event.findById(id)
    if (!existingEvent) throw new ApiError(404, "Event not found")

    // ✅ OWNERSHIP CHECK: Editors can only edit their own
    if (role === "editor" && existingEvent.createdBy !== userId) {
        await logAudit(
            userId,
            "UPDATE_CONTENT",
            "Event",
            id,
            existingEvent.name,
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

    const event = await Event.findByIdAndUpdate(id, updateData, { new: true })
    if (!event) throw new ApiError(404, "Event not found")

    // ✅ Audit log
    await logAudit(
        userId,
        "UPDATE_CONTENT",
        "Event",
        id,
        event.name,
        { status: { before: existingEvent.status, after: event.status } },
        req.ip,
        req.get("user-agent"),
        "success"
    )

    res.status(200).json(new ApiResponse(200, event, "Event updated successfully"))
})

/* ---------- DELETE EVENT ---------- */

export const deleteEvent = asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = req.params.id as string
    const role = req.user!.role
    const userId = req.user!.id

    // ✅ Only admins can delete
    if (!hasPermission(role, 'delete_any_content')) {
        throw new ApiError(403, "Only admins can delete content permanently")
    }

    const event = await Event.findByIdAndDelete(id)
    if (!event) throw new ApiError(404, "Event not found")

    // ✅ Audit log
    await logAudit(
        userId,
        "DELETE_CONTENT",
        "Event",
        id,
        event.name,
        undefined,
        req.ip,
        req.get("user-agent"),
        "success"
    )

    res.status(200).json(new ApiResponse(200, null, "Event deleted successfully"))
})
